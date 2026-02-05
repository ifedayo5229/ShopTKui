import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateCategoryVM } from 'src/app/models/createCategoryVM';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-create-category-dialog',
  templateUrl: './create-category-dialog.component.html',
  styleUrls: ['./create-category-dialog.component.scss']
})
export class CreateCategoryDialogComponent implements OnInit {
  createCategoryForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateCategoryDialogComponent>,
  ) {
    this.createCategoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['', Validators.required] 
    });

    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

 

  createCategory() {

    if (this.createCategoryForm.invalid) {
      this.createCategoryForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
  }

    if (this.isSubmitting  == true)  {
      return; 
    }
  
    this.isSubmitting = true;

    if (this.createCategoryForm.valid) {
      this.isSubmitting = true;

      const createCategoryRequest: CreateCategoryVM = {
        categoryName: this.createCategoryForm.get('categoryName')?.value || '',
        description: this.createCategoryForm.get('description')?.value || ''
      };

      console.log(createCategoryRequest);
      debugger;

      this.categoryService.createCategory(createCategoryRequest).subscribe(
        {
          next: (data => {
            this.isSubmitting = false;
            if (data.responseCode == "00") {
              this.toastr.success('Category created successfully');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
            else {
              this.isSubmitting = false;
              this.toastr.error(data.message);
            }
          }),
          error: ((error: any) => {
            console.log(error);
            this.toastr.error('Oops! Something went wrong. \nIt\'s not you, it\'s us. \nPlease try again');
          }),
          complete: () => {
            this.isSubmitting = false; 
            this.createCategoryForm.reset();
          }
        }
      );
    }
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }
}