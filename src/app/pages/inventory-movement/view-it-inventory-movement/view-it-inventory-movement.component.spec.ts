import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItInventoryMovementComponent } from './view-it-inventory-movement.component';

describe('ViewItInventoryMovementComponent', () => {
  let component: ViewItInventoryMovementComponent;
  let fixture: ComponentFixture<ViewItInventoryMovementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewItInventoryMovementComponent]
    });
    fixture = TestBed.createComponent(ViewItInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
