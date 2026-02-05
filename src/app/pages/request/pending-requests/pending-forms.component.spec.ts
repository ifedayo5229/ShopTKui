import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFormsComponent } from './pending-forms.component';

describe('PendingFormsComponent', () => {
  let component: PendingFormsComponent;
  let fixture: ComponentFixture<PendingFormsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingFormsComponent]
    });
    fixture = TestBed.createComponent(PendingFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
