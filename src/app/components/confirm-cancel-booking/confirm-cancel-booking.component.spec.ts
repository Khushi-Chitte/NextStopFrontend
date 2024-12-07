import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelBookingComponent } from './confirm-cancel-booking.component';

describe('ConfirmCancelBookingComponent', () => {
  let component: ConfirmCancelBookingComponent;
  let fixture: ComponentFixture<ConfirmCancelBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCancelBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmCancelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
