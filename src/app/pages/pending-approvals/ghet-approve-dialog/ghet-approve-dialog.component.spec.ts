import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhetApproveDialogComponent } from './ghet-approve-dialog.component';

describe('GhetApproveDialogComponent', () => {
  let component: GhetApproveDialogComponent;
  let fixture: ComponentFixture<GhetApproveDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GhetApproveDialogComponent]
    });
    fixture = TestBed.createComponent(GhetApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
