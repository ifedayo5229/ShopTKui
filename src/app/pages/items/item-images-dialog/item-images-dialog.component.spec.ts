import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemImagesDialogComponent } from './item-images-dialog.component';

describe('ItemImagesDialogComponent', () => {
  let component: ItemImagesDialogComponent;
  let fixture: ComponentFixture<ItemImagesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemImagesDialogComponent]
    });
    fixture = TestBed.createComponent(ItemImagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
