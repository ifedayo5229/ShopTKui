import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDisbursementsComponent } from './all-disbursements.component';

describe('AllDisbursementsComponent', () => {
  let component: AllDisbursementsComponent;
  let fixture: ComponentFixture<AllDisbursementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllDisbursementsComponent]
    });
    fixture = TestBed.createComponent(AllDisbursementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
