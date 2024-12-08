import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoutesComponent } from './manage-routes.component';

describe('ManageRoutesComponent', () => {
  let component: ManageRoutesComponent;
  let fixture: ComponentFixture<ManageRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoutesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
