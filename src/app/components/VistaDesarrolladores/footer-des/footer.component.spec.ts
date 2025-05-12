import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponentDes } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponentDes;
  let fixture: ComponentFixture<FooterComponentDes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponentDes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponentDes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
