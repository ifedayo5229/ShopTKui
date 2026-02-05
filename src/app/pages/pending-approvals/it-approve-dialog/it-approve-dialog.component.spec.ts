import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItApproveDialogComponent } from './it-approve-dialog.component';

describe('ItApproveDialogComponent', () => {
  let component: ItApproveDialogComponent;
  let fixture: ComponentFixture<ItApproveDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItApproveDialogComponent]
    });
    fixture = TestBed.createComponent(ItApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
