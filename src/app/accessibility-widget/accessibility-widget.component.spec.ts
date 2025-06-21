import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityWidgetComponent } from './accessibility-widget.component';

describe('AccessibilityWidgetComponent', () => {
  let component: AccessibilityWidgetComponent;
  let fixture: ComponentFixture<AccessibilityWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessibilityWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessibilityWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
