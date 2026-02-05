import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignItManagerComponent } from './assign-it-manager.component';

describe('AssignItManagerComponent', () => {
  let component: AssignItManagerComponent;
  let fixture: ComponentFixture<AssignItManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignItManagerComponent]
    });
    fixture = TestBed.createComponent(AssignItManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
