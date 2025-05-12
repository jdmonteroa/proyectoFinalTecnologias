import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReactivoComponent } from './form-reactivo.component';

describe('FormReactivoComponent', () => {
  let component: FormReactivoComponent;
  let fixture: ComponentFixture<FormReactivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormReactivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormReactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
