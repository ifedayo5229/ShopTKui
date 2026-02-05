import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';
import { GhetItem } from 'src/app/models/ghet-itemVm';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { CategoryService } from 'src/app/services/category/category.service';
import { ItemService } from 'src/app/services/item/item.service';
import { TokenService } from 'src/app/services/token/token.service';

interface GiftItemForm {
  itemName: string;
  description: string;
  categoryId: string;
  uploadFiles: File[];
}

@Component({
  selector: 'app-create-ghet-item',
  templateUrl: './create-ghet-item.component.html',
  styleUrls: ['./create-ghet-item.component.scss']
})
export class CreateGhetItemComponent {
  giftRequestForm: FormGroup;
  currentUser: any;
  firstName: string = '';
  lastName: string = '';
  fullname: string = '';
  email: string = '';
  department: string = '';
  location: string = '';
  locationId: string = '';
  function: string = '';
  functionId: string = '';
  userId: string = '';
  isSubmitting: boolean = false;

  allCategories: Category[] = [];
  filteredCategories: Category[] = [];
  searchInputCategory = new FormControl();
  
  categories = [
    'Electronics',
    'Clothing & Accessories',
    'Home & Garden',
    'Books & Education',
    'Sports & Recreation',
    'Toys & Games',
    'Health & Beauty',
    'Food & Beverages',
    'Art & Crafts',
    'Other'
  ];

  private selectedFiles: { [key: number]: File[] } = {};

  constructor(private fb: FormBuilder, private tokenService: TokenService, 
              private categoryService: CategoryService, private toastr: ToastrService, 
              private itemService: ItemService) 
  {
    this.giftRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      function: ['', Validators.required],
      gifts: this.fb.array([this.createGiftItem()])
    });
  }

  ngOnInit(): void {
    this.getinfo();
    this.loadFormValues();
    this.getAllCategories();
  }

  get giftsArray(): FormArray {
    return this.giftRequestForm.get('gifts') as FormArray;
  }

  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();

      this.currentUser = this.tokenService.getInfo(); 
      this.firstName = this.currentUser.profile.firstName;
      this.lastName = this.currentUser.profile.lastName;
      this.fullname =  this.lastName + ' ' + this.firstName;
      this.email = this.currentUser.profile.email;
      this.department = this.currentUser.profile.functionName;
      this.location = this.currentUser.profile.locationName;
      this.locationId = this.currentUser.profile.locationId;
      this.function = this.currentUser.profile.functionName;
      this.functionId = this.currentUser.profile.functionId;
      this.userId = this.currentUser.profile.id;
    }

    loadFormValues() {
      this.giftRequestForm.patchValue({
        email: this.email,
        function: this.department,
        location: this.location
      });
    }

    async getAllCategories() {
            let resGetAllCategories = await this.categoryService.getAllCategories().toPromise();
            debugger;
            this.allCategories = <Category[]><unknown>resGetAllCategories?.responseData;
            this.filteredCategories = this.allCategories;
            debugger;
        }
  

   //Filter starts here
    setupCategorySearch() {
      this.searchInputCategory.valueChanges.subscribe(value => {
        this.filterCagories(value);
      });
    }
  
    filterCagories(searchTerm: string) {
      if (!searchTerm) {
        this.filteredCategories = this.allCategories; // Reset to all stores if search term is empty
      } else {
        this.filteredCategories = this.allCategories.filter(category =>
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    //Filter ends here     

  createGiftItem(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      uploadFiles: [[]]
    });
  }

  addGiftItem(): void {
    this.giftsArray.push(this.createGiftItem());
  }

  removeGiftItem(index: number): void {
    if (this.giftsArray.length > 1) {
      this.giftsArray.removeAt(index);
      delete this.selectedFiles[index];
      // Reindex the remaining files
      const newSelectedFiles: { [key: number]: File[] } = {};
      Object.keys(this.selectedFiles).forEach(key => {
        const numKey = parseInt(key);
        if (numKey > index) {
          newSelectedFiles[numKey - 1] = this.selectedFiles[numKey];
        } else if (numKey < index) {
          newSelectedFiles[numKey] = this.selectedFiles[numKey];
        }
      });
      this.selectedFiles = newSelectedFiles;
    }
  }

  triggerFileInput(index: number): void {
    const fileInput = document.getElementById(`uploadFiles-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const filesArray = Array.from(target.files);
      this.selectedFiles[index] = filesArray;
      
      // Update the form control
      const giftControl = this.giftsArray.at(index);
      if (giftControl) {
        giftControl.patchValue({ uploadFiles: filesArray });
      }
    }
  }

  getSelectedFilesCount(index: number): number {
    return this.selectedFiles[index] ? this.selectedFiles[index].length : 0;
  }

  onSubmit(): void {

    const formData = this.giftRequestForm.value;
    console.log('Form submitted:', formData);

    if (this.giftRequestForm.invalid) {
      this.giftRequestForm.markAllAsTouched();
      return; 
    }

    if (this.isSubmitting  == true)  {
      return; 
    }

    this.isSubmitting = true;

    const items = (this.giftRequestForm.get('gifts') as FormArray)?.value || [];

      // Create FormData object
      const giftRequest = new FormData();

      giftRequest.append('CreatorEmail', this.email);
      giftRequest.append('CreatorFunctionId', this.functionId.toString());
      giftRequest.append('CreatorLocationId', this.locationId.toString());

      items.forEach((item: any, index: number) => {
        giftRequest.append(`Items[${index}].ItemName`, item.itemName);
        giftRequest.append(`Items[${index}].CategoryId`, item.categoryId.toString());
        giftRequest.append(`Items[${index}].Description`, item.description);

        if (this.selectedFiles[index]) {
          this.selectedFiles[index].forEach(file => {
            giftRequest.append(`Items[${index}].UploadFiles`, file);
          });
        }
      });

  
    // DEBUG — log FormData contents
    giftRequest.forEach((value, key) => {
      console.log(key, value);
    });

    console.log(giftRequest);

    debugger;
this.itemService.createGhetItems(giftRequest).subscribe({
  next: (data) => {
    this.isSubmitting = false;
    
    // Show success toast with API message
    this.toastr.success('Item created successfully');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  },
  error: (error: any) => {
    console.error(error);
    this.toastr.error('Oops! Something went wrong. \nIt\'s not you, it\'s us. \nPlease try again');

    setTimeout(() => {
      window.location.reload();
    }, 2500);
  },
  complete: () => {
    this.isSubmitting = false;
    this.giftRequestForm.reset();
  }
});




    
  }

  resetForm(): void {
    this.giftRequestForm.reset();
    this.selectedFiles = {};
    
    // Clear the gifts array and add one default item
    while (this.giftsArray.length !== 0) {
      this.giftsArray.removeAt(0);
    }
    this.giftsArray.push(this.createGiftItem());
    
    // Show reset message (you can implement a toast service here)
    alert('Form Reset Successfully!');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.giftRequestForm.controls).forEach(key => {
      const control = this.giftRequestForm.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormArray) {
          control.controls.forEach(nestedControl => {
            if (nestedControl instanceof FormGroup) {
              Object.keys(nestedControl.controls).forEach(nestedKey => {
                nestedControl.get(nestedKey)?.markAsTouched();
              });
            }
          });
        }
      }
    });
  }

  convertToNumber(value: string | null | undefined): number {
    if (value === null || value === undefined) {
      return 0; 
    }
    const parsedValue = Number(value);
    return parsedValue;
  }

}
