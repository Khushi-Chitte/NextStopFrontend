import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusComponent } from './add-bus.component';

describe('AddBusComponent', () => {
  let component: AddBusComponent;
  let fixture: ComponentFixture<AddBusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
