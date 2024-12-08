import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoutesComponent } from './update-routes.component';

describe('UpdateRoutesComponent', () => {
  let component: UpdateRoutesComponent;
  let fixture: ComponentFixture<UpdateRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRoutesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
