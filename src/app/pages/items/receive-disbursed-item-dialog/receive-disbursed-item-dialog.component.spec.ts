import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveDisbursedItemDialogComponent } from './receive-disbursed-item-dialog.component';

describe('ReceiveDisbursedItemDialogComponent', () => {
  let component: ReceiveDisbursedItemDialogComponent;
  let fixture: ComponentFixture<ReceiveDisbursedItemDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiveDisbursedItemDialogComponent]
    });
    fixture = TestBed.createComponent(ReceiveDisbursedItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
