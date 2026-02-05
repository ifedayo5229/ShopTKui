import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGhetItemComponent } from './request-ghet-item.component';

describe('RequestGhetItemComponent', () => {
  let component: RequestGhetItemComponent;
  let fixture: ComponentFixture<RequestGhetItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestGhetItemComponent]
    });
    fixture = TestBed.createComponent(RequestGhetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
