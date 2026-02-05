import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItPendingRequestsComponent } from './it-pending-requests.component';

describe('ItPendingRequestsComponent', () => {
  let component: ItPendingRequestsComponent;
  let fixture: ComponentFixture<ItPendingRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItPendingRequestsComponent]
    });
    fixture = TestBed.createComponent(ItPendingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
