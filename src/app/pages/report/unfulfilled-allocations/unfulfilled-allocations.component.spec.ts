import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfulfilledAllocationsComponent } from './unfulfilled-allocations.component';

describe('UnfulfilledAllocationsComponent', () => {
  let component: UnfulfilledAllocationsComponent;
  let fixture: ComponentFixture<UnfulfilledAllocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnfulfilledAllocationsComponent]
    });
    fixture = TestBed.createComponent(UnfulfilledAllocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
