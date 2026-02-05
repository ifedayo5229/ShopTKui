import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhetRequestsForCpasdComponent } from './ghet-requests-for-cpasd.component';

describe('GhetRequestsForCpasdComponent', () => {
  let component: GhetRequestsForCpasdComponent;
  let fixture: ComponentFixture<GhetRequestsForCpasdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GhetRequestsForCpasdComponent]
    });
    fixture = TestBed.createComponent(GhetRequestsForCpasdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
