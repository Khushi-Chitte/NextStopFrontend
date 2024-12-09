import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSchedulesComponent } from './view-schedules.component';

describe('ViewSchedulesComponent', () => {
  let component: ViewSchedulesComponent;
  let fixture: ComponentFixture<ViewSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSchedulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
