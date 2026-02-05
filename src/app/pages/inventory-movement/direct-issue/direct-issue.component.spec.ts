import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectIssueComponent } from './direct-issue.component';

describe('DirectIssueComponent', () => {
  let component: DirectIssueComponent;
  let fixture: ComponentFixture<DirectIssueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectIssueComponent]
    });
    fixture = TestBed.createComponent(DirectIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
