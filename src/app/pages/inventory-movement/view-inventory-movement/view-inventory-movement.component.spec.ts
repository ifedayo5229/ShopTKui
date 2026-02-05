import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventoryMovementComponent } from './view-inventory-movement.component';

describe('ViewInventoryMovementComponent', () => {
  let component: ViewInventoryMovementComponent;
  let fixture: ComponentFixture<ViewInventoryMovementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewInventoryMovementComponent]
    });
    fixture = TestBed.createComponent(ViewInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
