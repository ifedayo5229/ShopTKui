import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItItemComponent } from './create-it-item.component';

describe('CreateItItemComponent', () => {
  let component: CreateItItemComponent;
  let fixture: ComponentFixture<CreateItItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateItItemComponent]
    });
    fixture = TestBed.createComponent(CreateItItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
