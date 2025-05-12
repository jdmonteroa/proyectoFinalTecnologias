import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';


interface Contact {
  nombre: string;
  apellido: string;
  correo: string;
  mensaje: string;
}

@Component({
  selector: 'app-lista-contactos',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './lista-contactos.component.html',
  styleUrl: './lista-contactos.component.css'
})
export class ListaContactosComponent {
  contacts = signal<Contact[]>([]);
  displayedColumns: string[] = ['nombre', 'apellido', 'correo', 'mensaje', 'actions'];
  editingIndex = signal<number | null>(null);

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    const savedContacts = localStorage.getItem('formularios');
    this.contacts.set(savedContacts ? JSON.parse(savedContacts) : []);
  }

  deleteContact(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      background: '#fffaf3',         // Fondo claro
      color: '#5B4C3A',              // Texto café
      iconColor: '#5B4C3A',          // Ícono verde estilo café
      confirmButtonColor: '#A9745D', // Botón café fuerte
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedContacts = [...this.contacts()];
        updatedContacts.splice(index, 1);
        this.updateContacts(updatedContacts);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El contacto ha sido eliminado.',
          icon: 'success',
          background: '#fffaf3',
          color: '#5B4C3A',
          iconColor: '#5B4C3A',
          confirmButtonColor: '#A9745D',
          
        });
      }
    });
  }

  clearAll(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Se eliminarán todos los contactos!",
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
        localStorage.removeItem('formularios');
        this.contacts.set([]);
        Swal.fire({
          title: '¡Eliminados!',
          text: 'Todos los contactos han sido eliminados.',
          icon: 'success',
          background: '#fffaf3',
          color: '#5B4C3A',
          iconColor: '#5B4C3A',
          confirmButtonColor: '#A9745D'
        });
      }
    });
  }

  startEdit(index: number): void {
    this.editingIndex.set(index);
  }

  cancelEdit(): void {
    this.editingIndex.set(null);
    this.loadContacts();
  }

  saveEdit(index: number): void {
    const updated = [...this.contacts()];
    this.updateContacts(updated);
    this.editingIndex.set(null);
    Swal.fire({
      title: '¡Actualizado!',
      text: 'El contacto fue modificado correctamente.',
      icon: 'success',
      background: '#fffaf3',
      color: '#5B4C3A',
      iconColor: '#5B4C3A',
      confirmButtonColor: '#A9745D'
    });
  }

  private updateContacts(updated: any[]): void {
    localStorage.setItem('formularios', JSON.stringify(updated));
    this.contacts.set(updated);
  }
}