import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsDialogComponent } from './bookings-dialog.component';

describe('BookingsDialogComponent', () => {
  let component: BookingsDialogComponent;
  let fixture: ComponentFixture<BookingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
