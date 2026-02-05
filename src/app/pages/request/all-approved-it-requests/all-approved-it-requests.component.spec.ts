import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllApprovedItRequestsComponent } from './all-approved-it-requests.component';

describe('AllApprovedItRequestsComponent', () => {
  let component: AllApprovedItRequestsComponent;
  let fixture: ComponentFixture<AllApprovedItRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllApprovedItRequestsComponent]
    });
    fixture = TestBed.createComponent(AllApprovedItRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
