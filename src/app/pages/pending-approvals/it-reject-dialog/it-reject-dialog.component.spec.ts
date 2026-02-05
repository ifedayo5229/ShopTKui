import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItRejectDialogComponent } from './it-reject-dialog.component';

describe('ItRejectDialogComponent', () => {
  let component: ItRejectDialogComponent;
  let fixture: ComponentFixture<ItRejectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItRejectDialogComponent]
    });
    fixture = TestBed.createComponent(ItRejectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
