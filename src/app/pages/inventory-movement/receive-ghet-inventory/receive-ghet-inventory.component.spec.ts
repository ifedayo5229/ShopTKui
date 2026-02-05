import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveGhetInventoryComponent } from './receive-ghet-inventory.component';

describe('ReceiveGhetInventoryComponent', () => {
  let component: ReceiveGhetInventoryComponent;
  let fixture: ComponentFixture<ReceiveGhetInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiveGhetInventoryComponent]
    });
    fixture = TestBed.createComponent(ReceiveGhetInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
