import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllItItemComponent } from './all-it-item.component';

describe('AllItItemComponent', () => {
  let component: AllItItemComponent;
  let fixture: ComponentFixture<AllItItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllItItemComponent]
    });
    fixture = TestBed.createComponent(AllItItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
