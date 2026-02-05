import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhetPendingRequestsComponent } from './ghet-pending-requests.component';

describe('GhetPendingRequestsComponent', () => {
  let component: GhetPendingRequestsComponent;
  let fixture: ComponentFixture<GhetPendingRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GhetPendingRequestsComponent]
    });
    fixture = TestBed.createComponent(GhetPendingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
