import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItStoresComponent } from './view-it-stores.component';

describe('ViewItStoresComponent', () => {
  let component: ViewItStoresComponent;
  let fixture: ComponentFixture<ViewItStoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewItStoresComponent]
    });
    fixture = TestBed.createComponent(ViewItStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
