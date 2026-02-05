import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStoreRequestsComponent } from './pending-store-requests.component';

describe('PendingStoreRequestsComponent', () => {
  let component: PendingStoreRequestsComponent;
  let fixture: ComponentFixture<PendingStoreRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingStoreRequestsComponent]
    });
    fixture = TestBed.createComponent(PendingStoreRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
