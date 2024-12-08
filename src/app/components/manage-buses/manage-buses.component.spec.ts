import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBusesComponent } from './manage-buses.component';

describe('ManageBusesComponent', () => {
  let component: ManageBusesComponent;
  let fixture: ComponentFixture<ManageBusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBusesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageBusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
