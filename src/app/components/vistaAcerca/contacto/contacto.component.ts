import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  imports: [RouterModule, FormsModule, NgClass, NgStyle],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  datos: any = {
    nombre: '',
    apellido: '',
    correo: '',
    mensaje: ''
  };

  camposTexto = [
    { nombre: 'nombre', etiqueta: 'Nombre' },
    { nombre: 'apellido', etiqueta: 'Apellido' }
  ];

  enviarFormulario(formulario: NgForm) {
    if (formulario.valid) {
      const existentes = JSON.parse(localStorage.getItem('formularios') || '[]');
      existentes.push(this.datos);
      localStorage.setItem('formularios', JSON.stringify(existentes));

      Swal.fire({
            title: '¡Enviado con éxito!',
            text: 'Tus datos han sido guardados y enviados correctamente.',
            icon: 'success',
            background: '#fffaf3',
            color: '#5B4C3A',
            iconColor: '#5B4C3A',
            confirmButtonColor: '#A9745D',
            confirmButtonText: 'Aceptar'
          });
      formulario.resetForm();
    } else {
      Swal.fire('Error', 'Por favor completa todos los campos correctamente', 'error');
    }
  }
}
