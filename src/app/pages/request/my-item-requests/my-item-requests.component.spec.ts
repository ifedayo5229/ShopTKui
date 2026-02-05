import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyItemRequestsComponent } from './my-item-requests.component';

describe('MyItemRequestsComponent', () => {
  let component: MyItemRequestsComponent;
  let fixture: ComponentFixture<MyItemRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyItemRequestsComponent]
    });
    fixture = TestBed.createComponent(MyItemRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
