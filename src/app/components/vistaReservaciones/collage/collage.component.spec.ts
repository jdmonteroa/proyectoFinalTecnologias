import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollageComponent } from './collage.component';

describe('CollageComponent', () => {
  let component: CollageComponent;
  let fixture: ComponentFixture<CollageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
