import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasHabitacionesComponent } from './estadisticas-habitaciones.component';

describe('EstadisticasHabitacionesComponent', () => {
  let component: EstadisticasHabitacionesComponent;
  let fixture: ComponentFixture<EstadisticasHabitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasHabitacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasHabitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
