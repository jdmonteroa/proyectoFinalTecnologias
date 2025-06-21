import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-accessibility-widget',
  imports: [],
  templateUrl: './accessibility-widget.component.html',
  styleUrl: './accessibility-widget.component.css'
})
export class AccessibilityWidgetComponent {
  @Output() fontChanged = new EventEmitter<string>();
  @Output() contrastToggled = new EventEmitter<boolean>();
  @Output() largeTextToggled = new EventEmitter<boolean>();

  selectedFont: string = 'Arial';
  contrastOn: boolean = false;
  isLarge: boolean = false;

  synth = window.speechSynthesis;
  utterance = new SpeechSynthesisUtterance();
  private isReading = false;

  menuOpen = false;

  onFontChange(event: Event) {
    const font = (event.target as HTMLSelectElement).value;
    this.fontChanged.emit(font);
  }

  toggleContrast() {
    this.contrastOn = !this.contrastOn;
    this.contrastToggled.emit(this.contrastOn);
  }

  fontSizePx: number = 16;

  toggleLargeText() {
    this.isLarge = !this.isLarge;
    this.largeTextToggled.emit(this.isLarge);
  }


  readContent() {
    setTimeout(() => {
    const main = document.querySelector('app-root') || document.querySelector('body');
    const text = main?.textContent?.trim();

    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('No se encontró texto en el <main>');
    }
  }, 500); // Espera medio segundo
  }

  pauseReading() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isReading = false;
    }
  }

  resumeReading() {
    if (this.synth.paused) {
      this.synth.resume();
      this.isReading = true;
    }
  }

  stopReading() {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isReading = false;
    }
  }
}

