import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBookingComponent } from './confirm-booking.component';

describe('ConfirmBookingComponent', () => {
  let component: ConfirmBookingComponent;
  let fixture: ComponentFixture<ConfirmBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
