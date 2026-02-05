import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveItInventoryComponent } from './receive-it-inventory.component';

describe('ReceiveItInventoryComponent', () => {
  let component: ReceiveItInventoryComponent;
  let fixture: ComponentFixture<ReceiveItInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiveItInventoryComponent]
    });
    fixture = TestBed.createComponent(ReceiveItInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
