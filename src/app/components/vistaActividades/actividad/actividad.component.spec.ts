import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadComponent } from './actividad.component';

describe('ActividadComponent', () => {
  let component: ActividadComponent;
  let fixture: ComponentFixture<ActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
