import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CorreoService } from '../../../../services/correo.service';
import { Contacto, ContactoService } from '../../../../services/contacto.service';
import { QrVisualizadorComponent } from '../qr-visualizador/qr-visualizador.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterModule, FormsModule, NgClass, NgStyle, QrVisualizadorComponent],
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

  qrDisponible: boolean = false;
  ultimoContacto: Contacto | null = null;

  constructor(
    private correoService: CorreoService,
    private contactoService: ContactoService,  // <-- nuevo servicio agregado
    private http: HttpClient
  ) { }


  enviarFormulario(formulario: NgForm) {
    if (formulario.valid) {
      const contacto = {
        nombre: this.datos.nombre,
        apellidos: this.datos.apellido,   // Firestore espera "apellidos"
        correo: this.datos.correo,
        Mensaje: this.datos.mensaje       // Firestore espera "Mensaje"
      };


      this.contactoService.guardarContacto(contacto).subscribe({
        next: (res) => {
          const idRecienCreado = res.id;

          this.http.get<Contacto>(`https://proyectofinalnodejs.onrender.com/api/qr/${idRecienCreado}`).subscribe({
            next: (contacto) => {
              this.ultimoContacto = contacto;
              this.qrDisponible = true;
            },
            error: (err) => {
              console.error('Error al obtener el contacto desde la API QR', err);
            }
          });

          // Luego de guardar en la BD, envía el correo
          this.correoService.enviarCorreo(this.datos).subscribe({
            next: () => {
              Swal.fire({
                title: '¡Enviado con éxito!',
                text: 'Tus datos han sido guardados y el correo fue enviado correctamente.',
                icon: 'success',
                background: '#fffaf3',
                color: '#5B4C3A',
                iconColor: '#5B4C3A',
                confirmButtonColor: '#A9745D',
                confirmButtonText: 'Aceptar'
              });
              formulario.resetForm();
            },
            error: (err) => {
              console.error('Error al enviar el correo:', err);
              Swal.fire('Error', 'Se guardaron los datos, pero falló el envío de correo.', 'error');
            }
          });
        },
        error: (err) => {
          console.error('Error al guardar contacto:', err);
          Swal.fire('Error', 'No se pudo guardar tu información. Intenta más tarde.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Por favor completa todos los campos correctamente', 'error');
    }
  }
}
