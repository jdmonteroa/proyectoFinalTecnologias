import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

interface Reservation {
  fullName: string;
  guests: number;
  roomType: string;
  checkInDate: Date | string;
  checkOutDate: Date | string;
  paymentMethod: string;
}

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
    DatePipe
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations = signal<Reservation[]>([]);
  displayedColumns: string[] = ['fullName', 'guests', 'roomType', 'dates', 'paymentMethod', 'actions'];
  editingIndex = signal<number | null>(null);
  roomTypes = ['Celestial Suite', 'Mystic Forest Suite', 'Golden Horizon Suite', 'Otro'];
  paymentMethods = ['tarjeta', 'efectivo'];
  today = new Date();

  ngOnInit(): void {
    this.loadReservations();
    window.addEventListener('storage', () => this.loadReservations());
  }

  loadReservations(): void {
    const savedReservations = localStorage.getItem('reservas');
    const parsedReservations = savedReservations ? JSON.parse(savedReservations) : [];

    const formattedReservations = parsedReservations.map((res: any) => ({
      ...res,
      checkInDate: new Date(res.checkInDate),
      checkOutDate: new Date(res.checkOutDate)
    }));

    this.reservations.set(formattedReservations);
  }

  isValidName(name: string) {
    return name && name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name);
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

  validateReservation(reservation: Reservation): boolean {
    if (!this.isValidName(reservation.fullName)) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre debe tener al menos 3 letras y solo contener caracteres válidos',
        icon: 'error',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#B23B3B',
        confirmButtonColor: '#A9745D'
      });
      return false;
    }

    if (reservation.guests < 1 || reservation.guests > 5) {
      Swal.fire({
        title: 'Error',
        text: 'El número de huéspedes debe ser entre 1 y 5',
        icon: 'error',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#B23B3B',
        confirmButtonColor: '#A9745D'
      });
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkIn = new Date(reservation.checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    
    const checkOut = new Date(reservation.checkOutDate);
    checkOut.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha de llegada no puede ser anterior a hoy',
        icon: 'error',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#B23B3B',
        confirmButtonColor: '#A9745D'
      });
      return false;
    }

    if (this.isCheckOutBeforeCheckIn(checkIn, checkOut)) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha de salida debe ser posterior a la de llegada',
        icon: 'error',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#B23B3B',
        confirmButtonColor: '#A9745D'
      });
      return false;
    }

    if (!this.roomTypes.includes(reservation.roomType)) {
      Swal.fire({
        title: 'Error',
        text: 'Selecciona un tipo de habitación válido',
        icon: 'error',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#B23B3B',
        confirmButtonColor: '#A9745D'
      });
      return false;
    }

    if (!this.paymentMethods.includes(reservation.paymentMethod)) {
      Swal.fire({
        title: 'Error',
        text: 'Selecciona un método de pago válido',
        icon: 'error',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#B23B3B',
        confirmButtonColor: '#A9745D'
      });
      return false;
    }

    return true;
  }

  deleteReservation(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#5B4C3A',
      confirmButtonColor: '#A9745D',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedReservations = [...this.reservations()];
        updatedReservations.splice(index, 1);
        localStorage.setItem('reservas', JSON.stringify(updatedReservations));
        this.reservations.set(updatedReservations);

        Swal.fire({
          title: '¡Eliminado!',
          text: 'La reservacion ha sido eliminado.',
          icon: 'success',
          background: '#fffaf3',
          color: '#5B4C3A',
          iconColor: '#5B4C3A',
          confirmButtonColor: '#A9745D'
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
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  startEdit(index: number): void {
    this.editingIndex.set(index);
  }

  cancelEdit(): void {
    this.editingIndex.set(null);
    this.loadReservations();
  }

  onDateChange(index: number, field: 'checkInDate' | 'checkOutDate', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const updated = [...this.reservations()];
    updated[index][field] = value;
    
    if (field === 'checkInDate') {
      const checkIn = new Date(value);
      const checkOut = new Date(updated[index].checkOutDate);
      if (this.isCheckOutBeforeCheckIn(checkIn, checkOut)) {
        const nextDay = new Date(checkIn);
        nextDay.setDate(checkIn.getDate() + 1);
        updated[index].checkOutDate = nextDay.toISOString().split('T')[0];
      }
    }
    
    this.reservations.set(updated);
  }

  adjustGuests(index: number, increment: boolean): void {
    const updated = [...this.reservations()];
    const current = updated[index].guests;
    
    if (increment && current < 5) {
      updated[index].guests = current + 1;
    } else if (!increment && current > 1) {
      updated[index].guests = current - 1;
    }
    
    this.reservations.set(updated);
  }

  saveEdit(index: number): void {
    const updated = [...this.reservations()];
    const reservation = updated[index];
    
    if (!this.validateReservation(reservation)) {
      return;
    }
    
    localStorage.setItem('reservas', JSON.stringify(updated));
    this.reservations.set(updated);
    this.editingIndex.set(null);
    
    Swal.fire({
      title: '¡Actualizada!',
      text: 'La reservacion fue modificada correctamente.',
      icon: 'success',
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#5B4C3A',
      confirmButtonColor: '#A9745D'
    });
  }

  clearAll(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Se eliminarán todas las reservaciones!",
      icon: 'warning',
      showCancelButton: true,
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#5B4C3A',
      confirmButtonColor: '#A9745D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('reservas');
        this.reservations.set([]);
        Swal.fire({
          title: '¡Eliminados!',
          text: 'Todas las reservaciones han sido eliminados.',
          icon: 'success',
          background: '#fffaf3',
          color: '#5B4C3A',
          iconColor: '#5B4C3A',
          confirmButtonColor: '#A9745D'
        });
      }
    });
  }
}