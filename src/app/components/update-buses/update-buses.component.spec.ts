import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBusesComponent } from './update-buses.component';

describe('UpdateBusesComponent', () => {
  let component: UpdateBusesComponent;
  let fixture: ComponentFixture<UpdateBusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBusesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateBusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
