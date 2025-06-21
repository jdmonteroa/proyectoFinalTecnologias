import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

declare const paypal: any;

@Component({
  selector: 'app-form-reactivo',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatButtonModule, CommonModule],
  templateUrl: './form-reactivo.component.html',
  styleUrls: ['./form-reactivo.component.css']
})
export class FormReactivoComponent {
  roomTypes = ['Celestial Suite', 'Mystic Forest Suite', 'Golden Horizon Suite', 'Otro'];
  roomPrices: { [key: string]: number } = {
    'Celestial Suite': 500,
    'Mystic Forest Suite': 800,
    'Golden Horizon Suite': 1200,
  };

  today: Date = new Date();
  minCheckOutDate: Date = this.today;

  reservationForm: FormGroup;
  total: number = 0;

  constructor(private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/)
        ]
      ],
      guests: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ],
      roomType: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(Celestial Suite|Mystic Forest Suite|Golden Horizon Suite)$/)
        ]
      ],
      checkInDate: [
        null,
        [
          Validators.required,
          this.futureDateValidator,
          this.weekendValidator
        ]
      ],
      checkOutDate: [
        null,
        [
          Validators.required,
          this.laterThanCheckInValidator.bind(this)
        ]
      ],
      paymentMethod: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(efectivo|tarjeta|paypal)$/i)
        ]
      ]
    }, {
      validators: [this.minStayValidator.bind(this)]
    });

    this.reservationForm.get('checkInDate')?.valueChanges.subscribe((date: Date) => {
      if (date) {
        this.minCheckOutDate = date;
        const checkOut = this.reservationForm.get('checkOutDate')?.value;
        if (checkOut && checkOut <= date) {
          this.reservationForm.get('checkOutDate')?.setValue(null);
        }
      }
    });

    this.reservationForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.reservationForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.showPaypal = method === 'paypal';
  
      // Si elige PayPal, renderizar el botón nuevamente
      if (this.showPaypal) {
        setTimeout(() => this.loadPaypalButton(), 100); // Esperar a que el DOM esté listo
      }
    });
  }

  // ✅ Validación: fecha debe ser hoy o futura
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today ? { dateInPast: true } : null;
  }

  // ✅ Validación: no permitir check-in en fin de semana
  weekendValidator(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    const day = date.getDay();
    return (day === 0 || day === 6) ? { weekend: true } : null;
  }

  // ✅ Validación: check-out > check-in
  laterThanCheckInValidator(control: AbstractControl): ValidationErrors | null {
    const checkIn = this.reservationForm?.get('checkInDate')?.value;
    const checkOut = control.value;
    if (checkIn && checkOut) {
      return new Date(checkOut) <= new Date(checkIn)
        ? { checkOutBeforeCheckIn: true }
        : null;
    }
    return null;
  }

  // ✅ Validación: estancia mínima de 2 noches
  minStayValidator(group: AbstractControl): ValidationErrors | null {
    const checkIn = new Date(group.get('checkInDate')?.value);
    const checkOut = new Date(group.get('checkOutDate')?.value);
    if (!checkIn || !checkOut) return null;

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    return diffDays < 2 ? { minStay: true } : null;
  }

  getNumberOfNights(): number {
    const checkIn = new Date(this.reservationForm.get('checkInDate')?.value);
    const checkOut = new Date(this.reservationForm.get('checkOutDate')?.value);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : 0;
  }

  maxGuestsReached = false;
  minGuestsReached = true;

  increase(controlName: string): void {
    const control = this.reservationForm.get(controlName);
    if (control) {
      const current = control.value || 0;
      if (current < 5) {
        control.setValue(current + 1);
        control.markAsTouched();
        this.maxGuestsReached = false;
      } else {
        this.maxGuestsReached = true;
        setTimeout(() => this.maxGuestsReached = false, 3000);
      }
    }
  }

  decrease(controlName: string): void {
    const control = this.reservationForm.get(controlName);
    if (control) {
      const current = control.value || 0;
      if (current > 1) {
        control.setValue(current - 1);
        control.markAsTouched();
      } else {
        this.minGuestsReached = true;
        setTimeout(() => this.minGuestsReached = false, 3000);
      }
    }
  }

  calculateTotal(): void {
    const room = this.reservationForm.get('roomType')?.value;
    const nights = this.getNumberOfNights();
    const guests = this.reservationForm.get('guests')?.value || 1;

    const pricePerNight = this.roomPrices[room] || 0;
    this.total = pricePerNight * nights * guests;
  }

  showPaypal: boolean = false;

  ngAfterViewInit() {
    this.loadPaypalButton();
  }

  loadPaypalButton() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        const total = this.total.toString(); // Total en MXN
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: total
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          Swal.fire('Pago exitoso', `Gracias, ${details.payer.name.given_name}`, 'success');
          this.confirm(); // Guarda la reserva
        });
      },
      onError: (err: any) => {
        console.error('Error en el pago:', err);
        Swal.fire('Error', 'No se pudo procesar el pago.', 'error');
      }
    }).render('#paypal-button-container');
  }

  confirm(): void {
    if (this.reservationForm.valid) {
      const nuevaReserva = this.reservationForm.value;
      const reservasGuardadas = JSON.parse(localStorage.getItem('reservas') || '[]');
      reservasGuardadas.push(nuevaReserva);
      localStorage.setItem('reservas', JSON.stringify(reservasGuardadas));

      Swal.fire({
        title: '¡Reservación exitosa!',
        text: 'Tus datos han sido guardados.',
        icon: 'success',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#5B4C3A',
        confirmButtonColor: '#A9745D',
        confirmButtonText: 'Aceptar'
      });

      this.reservationForm.reset();
      this.reservationForm.patchValue({ guests: 1 });
      this.total = 0;
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos correctamente.',
        icon: 'error',
        background: '#fffaf3',
        color: '#5B4C3A',
        iconColor: '#B23B3B',
        confirmButtonColor: '#A9745D',
        confirmButtonText: 'Entendido'
      });
    }
  }
}







