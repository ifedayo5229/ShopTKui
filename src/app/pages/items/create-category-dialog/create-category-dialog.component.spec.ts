import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryDialogComponent } from './create-category-dialog.component';

describe('CreateCategoryDialogComponent', () => {
  let component: CreateCategoryDialogComponent;
  let fixture: ComponentFixture<CreateCategoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCategoryDialogComponent]
    });
    fixture = TestBed.createComponent(CreateCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
