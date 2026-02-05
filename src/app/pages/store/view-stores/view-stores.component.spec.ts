import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStoresComponent } from './view-stores.component';

describe('ViewStoresComponent', () => {
  let component: ViewStoresComponent;
  let fixture: ComponentFixture<ViewStoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStoresComponent]
    });
    fixture = TestBed.createComponent(ViewStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
