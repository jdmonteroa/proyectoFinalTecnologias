import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasReservasComponent } from './estadisticas-reservas.component';

describe('EstadisticasReservasComponent', () => {
  let component: EstadisticasReservasComponent;
  let fixture: ComponentFixture<EstadisticasReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasReservasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
