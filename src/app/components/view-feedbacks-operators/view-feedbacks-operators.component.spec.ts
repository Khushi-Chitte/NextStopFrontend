import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeedbacksOperatorsComponent } from './view-feedbacks-operators.component';

describe('ViewFeedbacksOperatorsComponent', () => {
  let component: ViewFeedbacksOperatorsComponent;
  let fixture: ComponentFixture<ViewFeedbacksOperatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFeedbacksOperatorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewFeedbacksOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
