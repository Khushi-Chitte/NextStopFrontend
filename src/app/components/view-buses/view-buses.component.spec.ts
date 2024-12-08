import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBusesComponent } from './view-buses.component';

describe('ViewBusesComponent', () => {
  let component: ViewBusesComponent;
  let fixture: ComponentFixture<ViewBusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBusesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
