import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDeleteFeedbackComponent } from './update-delete-feedback.component';

describe('UpdateDeleteFeedbackComponent', () => {
  let component: UpdateDeleteFeedbackComponent;
  let fixture: ComponentFixture<UpdateDeleteFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDeleteFeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDeleteFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
