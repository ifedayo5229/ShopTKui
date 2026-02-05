import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEquipmentFormsComponent } from './all-equipment-forms.component';

describe('AllEquipmentFormsComponent', () => {
  let component: AllEquipmentFormsComponent;
  let fixture: ComponentFixture<AllEquipmentFormsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllEquipmentFormsComponent]
    });
    fixture = TestBed.createComponent(AllEquipmentFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
