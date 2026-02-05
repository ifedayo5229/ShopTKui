import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueStoreRequestComponent } from './issue-store-request.component';

describe('IssueStoreRequestComponent', () => {
  let component: IssueStoreRequestComponent;
  let fixture: ComponentFixture<IssueStoreRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueStoreRequestComponent]
    });
    fixture = TestBed.createComponent(IssueStoreRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
