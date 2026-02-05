import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGhetItemsComponent } from './all-ghet-items.component';

describe('AllGhetItemsComponent', () => {
  let component: AllGhetItemsComponent;
  let fixture: ComponentFixture<AllGhetItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllGhetItemsComponent]
    });
    fixture = TestBed.createComponent(AllGhetItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
