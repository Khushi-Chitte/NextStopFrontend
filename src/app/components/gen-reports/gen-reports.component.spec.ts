import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenReportsComponent } from './gen-reports.component';

describe('GenReportsComponent', () => {
  let component: GenReportsComponent;
  let fixture: ComponentFixture<GenReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
