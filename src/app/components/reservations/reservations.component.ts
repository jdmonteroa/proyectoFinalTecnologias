import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { Reserva, ReservasService } from '../../../services/reservas.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations = signal<Reserva[]>([]);
  displayedColumns: string[] = ['nombre', 'huespedes', 'tipohabitacion', 'fechas', 'metodopago', 'total', 'actions'];
  editingIndex = signal<number | null>(null);
  roomTypes = ['Celestial Suite', 'Mystic Forest Suite', 'Golden Horizon Suite', 'Otro'];
  paymentMethods = ['tarjeta', 'efectivo'];
  today = new Date();

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservations.set(data);
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las reservaciones', 'error');
      }
    });
  }

  isValidName(name: string) {
    return name && name.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  }

  isCheckOutBeforeCheckIn(checkIn: Date | string, checkOut: Date | string): boolean {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return checkOutDate <= checkInDate;
  }

  getMinCheckOutDate(checkInDate: Date | string): string {
    const date = new Date(checkInDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  validateReservation(reservation: Reserva): boolean {
    if (!this.isValidName(reservation.nombre)) {
      Swal.fire('Error', 'Nombre inválido', 'error');
      return false;
    }

    if (reservation.huespedes < 1 || reservation.huespedes > 5) {
      Swal.fire('Error', 'Huéspedes fuera de rango (1-5)', 'error');
      return false;
    }

    const checkIn = new Date(reservation.Fechallegada);
    const checkOut = new Date(reservation.fechasalida);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      Swal.fire('Error', 'La fecha de entrada no puede ser anterior a hoy', 'error');
      return false;
    }

    if (this.isCheckOutBeforeCheckIn(checkIn, checkOut)) {
      Swal.fire('Error', 'La fecha de salida debe ser posterior a la de entrada', 'error');
      return false;
    }

    if (!reservation.tipohabitacion || !this.roomTypes.includes(reservation.tipohabitacion)) {
      Swal.fire('Error', 'Tipo de habitación inválido', 'error');
      return false;
    }

    if (!reservation.metodopago || !this.paymentMethods.includes(reservation.metodopago)) {
      Swal.fire('Error', 'Método de pago inválido', 'error');
      return false;
    }

    return true;
  }

  deleteReservation(index: number): void {
    const reserva = this.reservations()[index];
    if (!reserva.id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9745D',
    }).then(result => {
      if (result.isConfirmed) {
        this.reservasService.eliminarReserva(reserva.id!).subscribe({
          next: () => {
            const updated = this.reservations().filter((_, i) => i !== index);
            this.reservations.set(updated);
            Swal.fire('¡Eliminado!', 'La reservación fue eliminada.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar la reservación.', 'error')
        });
      }
    });
  }

  getNightsCount(checkIn: Date | string, checkOut: Date | string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : 0;
  }

  getFormattedDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-MX');
  }

  startEdit(index: number): void {
    this.editingIndex.set(index);
  }

  cancelEdit(): void {
    this.editingIndex.set(null);
    this.loadReservations();
  }

  onDateChange(index: number, field: 'Fechallegada' | 'fechasalida', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const updated = [...this.reservations()];
    updated[index][field] = value;

    if (field === 'Fechallegada') {
      const entrada = new Date(value);
      const salida = new Date(updated[index].fechasalida);
      if (this.isCheckOutBeforeCheckIn(entrada, salida)) {
        const nextDay = new Date(entrada);
        nextDay.setDate(entrada.getDate() + 1);
        updated[index].fechasalida = nextDay.toISOString().split('T')[0];
      }
    }

    this.reservations.set(updated);
  }

  adjustGuests(index: number, increment: boolean): void {
    const updated = [...this.reservations()];
    const current = updated[index].huespedes;

    if (increment && current < 5) {
      updated[index].huespedes = current + 1;
    } else if (!increment && current > 1) {
      updated[index].huespedes = current - 1;
    }

    this.reservations.set(updated);
  }

  saveEdit(index: number): void {
    const updated = [...this.reservations()];
    const reserva = updated[index];
    if (!reserva.id) return;

    if (!this.validateReservation(reserva)) return;

    this.reservasService.actualizarReserva(reserva.id, reserva).subscribe({
      next: () => {
        this.editingIndex.set(null);
        this.loadReservations();
        Swal.fire('¡Actualizada!', 'La reservación fue modificada.', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar la reservación.', 'error')
    });
  }

  clearAll(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán todas las reservaciones.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9745D',
    }).then((result) => {
      if (result.isConfirmed) {
        const eliminaciones = this.reservations()
          .filter(r => r.id !== undefined)
          .map(r => this.reservasService.eliminarReserva(r.id!).toPromise());

        Promise.all(eliminaciones)
          .then(() => {
            this.reservations.set([]);
            Swal.fire('¡Eliminadas!', 'Todas las reservaciones fueron eliminadas.', 'success');
          })
          .catch(() => Swal.fire('Error', 'No se pudieron eliminar todas.', 'error'));
      }
    });
  }
}

