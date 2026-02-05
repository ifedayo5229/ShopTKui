import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardMovementsComponent } from './outward-movements.component';

describe('OutwardMovementsComponent', () => {
  let component: OutwardMovementsComponent;
  let fixture: ComponentFixture<OutwardMovementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutwardMovementsComponent]
    });
    fixture = TestBed.createComponent(OutwardMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
