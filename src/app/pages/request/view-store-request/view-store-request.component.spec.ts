import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStoreRequestComponent } from './view-store-request.component';

describe('ViewStoreRequestComponent', () => {
  let component: ViewStoreRequestComponent;
  let fixture: ComponentFixture<ViewStoreRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStoreRequestComponent]
    });
    fixture = TestBed.createComponent(ViewStoreRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
