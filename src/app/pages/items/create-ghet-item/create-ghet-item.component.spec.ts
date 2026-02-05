import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGhetItemComponent } from './create-ghet-item.component';

describe('CreateGhetItemComponent', () => {
  let component: CreateGhetItemComponent;
  let fixture: ComponentFixture<CreateGhetItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateGhetItemComponent]
    });
    fixture = TestBed.createComponent(CreateGhetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
