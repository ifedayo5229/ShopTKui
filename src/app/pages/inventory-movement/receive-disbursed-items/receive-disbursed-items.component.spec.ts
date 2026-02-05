import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveDisbursedItemsComponent } from './receive-disbursed-items.component';

describe('ReceiveDisbursedItemsComponent', () => {
  let component: ReceiveDisbursedItemsComponent;
  let fixture: ComponentFixture<ReceiveDisbursedItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiveDisbursedItemsComponent]
    });
    fixture = TestBed.createComponent(ReceiveDisbursedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
