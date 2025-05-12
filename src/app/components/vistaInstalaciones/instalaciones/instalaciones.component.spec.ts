import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstalacionesComponent } from './instalaciones.component';

describe('InstalacionesComponent', () => {
  let component: InstalacionesComponent;
  let fixture: ComponentFixture<InstalacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstalacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstalacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
