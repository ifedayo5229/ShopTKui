import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRequestDialogComponent } from './approve-request-dialog.component';

describe('ApproveRequestDialogComponent', () => {
  let component: ApproveRequestDialogComponent;
  let fixture: ComponentFixture<ApproveRequestDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveRequestDialogComponent]
    });
    fixture = TestBed.createComponent(ApproveRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
