import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScheduleComponent } from './update-schedule.component';

describe('UpdateScheduleComponent', () => {
  let component: UpdateScheduleComponent;
  let fixture: ComponentFixture<UpdateScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
