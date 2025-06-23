import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrVisualizadorComponent } from './qr-visualizador.component';

describe('QrVisualizadorComponent', () => {
  let component: QrVisualizadorComponent;
  let fixture: ComponentFixture<QrVisualizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrVisualizadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrVisualizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
