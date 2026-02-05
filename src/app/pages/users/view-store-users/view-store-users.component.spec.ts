import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStoreUsersComponent } from './view-store-users.component';

describe('ViewStoreUsersComponent', () => {
  let component: ViewStoreUsersComponent;
  let fixture: ComponentFixture<ViewStoreUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStoreUsersComponent]
    });
    fixture = TestBed.createComponent(ViewStoreUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
