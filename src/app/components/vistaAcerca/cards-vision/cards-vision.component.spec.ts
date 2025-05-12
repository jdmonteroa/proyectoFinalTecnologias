import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsVisionComponent } from './cards-vision.component';

describe('CardsVisionComponent', () => {
  let component: CardsVisionComponent;
  let fixture: ComponentFixture<CardsVisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsVisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsVisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
