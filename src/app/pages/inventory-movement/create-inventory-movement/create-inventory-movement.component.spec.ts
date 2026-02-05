import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInventoryMovementComponent } from './create-inventory-movement.component';

describe('CreateInventoryMovementComponent', () => {
  let component: CreateInventoryMovementComponent;
  let fixture: ComponentFixture<CreateInventoryMovementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateInventoryMovementComponent]
    });
    fixture = TestBed.createComponent(CreateInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
