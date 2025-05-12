import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaContactosComponent } from './lista-contactos.component';

describe('ListaContactosComponent', () => {
  let component: ListaContactosComponent;
  let fixture: ComponentFixture<ListaContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaContactosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
