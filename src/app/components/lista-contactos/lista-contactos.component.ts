import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { Contacto, ContactoService } from '../../../services/contacto.service';

@Component({
  selector: 'app-lista-contactos',
  standalone: true,
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
export class ListaContactosComponent implements OnInit {
  contacts = signal<Contacto[]>([]);
  displayedColumns: string[] = ['nombre', 'apellidos', 'correo', 'Mensaje', 'actions'];
  editingIndex = signal<number | null>(null);

  constructor(private contactoService: ContactoService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactoService.obtenerContactos().subscribe({
      next: (data) => this.contacts.set(data),
      error: () => Swal.fire('Error', 'No se pudieron cargar los contactos', 'error')
    });
  }

  deleteContact(index: number): void {
    const contacto = this.contacts()[index];
    if (!contacto.id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.contactoService.eliminarContacto(contacto.id!).subscribe({
          next: () => {
            const nuevos = [...this.contacts()];
            nuevos.splice(index, 1);
            this.contacts.set(nuevos);
            Swal.fire('¡Eliminado!', 'El contacto ha sido eliminado.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el contacto.', 'error')
        });
      }
    });
  }

  clearAll(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará todos los contactos de la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const eliminaciones = this.contacts().map(c =>
          c.id ? this.contactoService.eliminarContacto(c.id).toPromise() : null
        );

        Promise.all(eliminaciones)
          .then(() => {
            this.contacts.set([]);
            Swal.fire('¡Eliminados!', 'Todos los contactos han sido eliminados.', 'success');
          })
          .catch(() => Swal.fire('Error', 'Hubo un problema eliminando todos los contactos.', 'error'));
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
    const contactoOriginal = this.contacts()[index];
    if (!contactoOriginal.id) return;

    // Clonar contacto para evitar problemas de referencia
    const nuevoContacto: Contacto = {
      id: contactoOriginal.id,
      nombre: contactoOriginal.nombre,
      apellidos: contactoOriginal.apellidos,
      correo: contactoOriginal.correo,
      Mensaje: contactoOriginal.Mensaje
    };

    this.contactoService.actualizarContacto(contactoOriginal.id, nuevoContacto).subscribe({
      next: () => {
        const nuevos = [...this.contacts()];
        nuevos[index] = nuevoContacto;
        this.contacts.set(nuevos);
        this.editingIndex.set(null);
        Swal.fire('¡Actualizado!', 'El contacto fue modificado correctamente.', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el contacto.', 'error')
    });
  }
}

