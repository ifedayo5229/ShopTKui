import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestsComponent } from './pending-requests.component';

describe('PendingRequestsComponent', () => {
  let component: PendingRequestsComponent;
  let fixture: ComponentFixture<PendingRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingRequestsComponent]
    });
    fixture = TestBed.createComponent(PendingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
