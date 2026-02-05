import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOutInventoryComponent } from './issue-out-inventory.component';

describe('IssueOutInventoryComponent', () => {
  let component: IssueOutInventoryComponent;
  let fixture: ComponentFixture<IssueOutInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueOutInventoryComponent]
    });
    fixture = TestBed.createComponent(IssueOutInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
