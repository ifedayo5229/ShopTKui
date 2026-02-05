import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGhetItemRequestsComponent } from './my-ghet-item-requests.component';

describe('MyGhetItemRequestsComponent', () => {
  let component: MyGhetItemRequestsComponent;
  let fixture: ComponentFixture<MyGhetItemRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyGhetItemRequestsComponent]
    });
    fixture = TestBed.createComponent(MyGhetItemRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
