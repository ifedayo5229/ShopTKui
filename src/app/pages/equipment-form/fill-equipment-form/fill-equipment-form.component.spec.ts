import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillEquipmentFormComponent } from './fill-equipment-form.component';

describe('FillEquipmentFormComponent', () => {
  let component: FillEquipmentFormComponent;
  let fixture: ComponentFixture<FillEquipmentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FillEquipmentFormComponent]
    });
    fixture = TestBed.createComponent(FillEquipmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
