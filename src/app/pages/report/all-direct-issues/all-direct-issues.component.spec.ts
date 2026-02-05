import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDirectIssuesComponent } from './all-direct-issues.component';

describe('AllDirectIssuesComponent', () => {
  let component: AllDirectIssuesComponent;
  let fixture: ComponentFixture<AllDirectIssuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllDirectIssuesComponent]
    });
    fixture = TestBed.createComponent(AllDirectIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
