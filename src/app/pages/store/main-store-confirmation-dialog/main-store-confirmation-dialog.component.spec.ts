import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainStoreConfirmationDialogComponent } from './main-store-confirmation-dialog.component';

describe('MainStoreConfirmationDialogComponent', () => {
  let component: MainStoreConfirmationDialogComponent;
  let fixture: ComponentFixture<MainStoreConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainStoreConfirmationDialogComponent]
    });
    fixture = TestBed.createComponent(MainStoreConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
