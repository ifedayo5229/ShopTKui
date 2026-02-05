import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGhetInventoriesComponent } from './view-ghet-inventories.component';

describe('ViewGhetInventoriesComponent', () => {
  let component: ViewGhetInventoriesComponent;
  let fixture: ComponentFixture<ViewGhetInventoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewGhetInventoriesComponent]
    });
    fixture = TestBed.createComponent(ViewGhetInventoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
