import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeedbackDialogComponent } from './create-feedback-dialog.component';

describe('CreateFeedbackDialogComponent', () => {
  let component: CreateFeedbackDialogComponent;
  let fixture: ComponentFixture<CreateFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFeedbackDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
