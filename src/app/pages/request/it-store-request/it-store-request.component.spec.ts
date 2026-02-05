import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItStoreRequestComponent } from './it-store-request.component';

describe('ItStoreRequestComponent', () => {
  let component: ItStoreRequestComponent;
  let fixture: ComponentFixture<ItStoreRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItStoreRequestComponent]
    });
    fixture = TestBed.createComponent(ItStoreRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
