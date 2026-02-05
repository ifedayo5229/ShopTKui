import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhetRejectDialogComponent } from './ghet-reject-dialog.component';

describe('GhetRejectDialogComponent', () => {
  let component: GhetRejectDialogComponent;
  let fixture: ComponentFixture<GhetRejectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GhetRejectDialogComponent]
    });
    fixture = TestBed.createComponent(GhetRejectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
