import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllGhetRequestsComponent } from './view-all-ghet-requests.component';

describe('ViewAllGhetRequestsComponent', () => {
  let component: ViewAllGhetRequestsComponent;
  let fixture: ComponentFixture<ViewAllGhetRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAllGhetRequestsComponent]
    });
    fixture = TestBed.createComponent(ViewAllGhetRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
