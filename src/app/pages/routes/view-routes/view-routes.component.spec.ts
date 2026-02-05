import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoutesComponent } from './view-routes.component';

describe('ViewRoutesComponent', () => {
  let component: ViewRoutesComponent;
  let fixture: ComponentFixture<ViewRoutesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRoutesComponent]
    });
    fixture = TestBed.createComponent(ViewRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
