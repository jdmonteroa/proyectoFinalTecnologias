import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  checkInDate: Date;
  checkOutDate: Date;
  paymentMethod: string;
}

@Component({
  selector: 'app-reservations',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent {
  reservations = signal<Reservation[]>([]);
  displayedColumns: string[] = ['fullName', 'guests', 'roomType', 'dates', 'paymentMethod', 'actions'];
  editingIndex = signal<number | null>(null);

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

  deleteReservation(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#fffaf3',         // Fondo claro
      color: '#5B4C3A',              // Texto café
      iconColor: '#5B4C3A',          // Ícono verde estilo café
      confirmButtonColor: '#A9745D', // Botón café fuerte
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

  getNightsCount(checkIn: Date, checkOut: Date): number {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : 0;
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
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
    this.loadReservations(); // Restaurar los valores originales
  }
  
  saveEdit(index: number): void {
    const updated = [...this.reservations()];
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
      background: '#fffaf3',         // Fondo claro
      color: '#5B4C3A',              // Texto café
      iconColor: '#5B4C3A',          // Ícono verde estilo café
      confirmButtonColor: '#A9745D', // Botón café fuerte
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