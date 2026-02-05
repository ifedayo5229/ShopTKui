import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRouteComponent } from './set-route.component';

describe('SetRouteComponent', () => {
  let component: SetRouteComponent;
  let fixture: ComponentFixture<SetRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetRouteComponent]
    });
    fixture = TestBed.createComponent(SetRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
