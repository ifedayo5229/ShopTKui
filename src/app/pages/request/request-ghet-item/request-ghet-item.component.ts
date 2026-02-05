import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';
import { GhetItemRequest } from 'src/app/models/ghet-requestVm';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { StoreLocation } from 'src/app/models/store-location';
import { User } from 'src/app/models/user';
import { CategoryService } from 'src/app/services/category/category.service';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';

interface GiftItemForm {
  itemName: string;
  description: string;
  category: string;
  images: File[];
}

@Component({
  selector: 'app-request-ghet-item',
  templateUrl: './request-ghet-item.component.html',
  styleUrls: ['./request-ghet-item.component.scss']
})
export class RequestGhetItemComponent  {
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
  allGhetStores: StoreLocation[] = [];
  selectedStore!: StoreLocation;
  storeFunctionId: number = 0;
  storeInvMovts: InventoryMovement[] = [];
  allHoDs: User[] = [];

  allCategories: Category[] = [];
  filteredCategories: Category[] = [];
  searchInputCategory = new FormControl();

allGhetOptions = [
  { option: 'Internal' },
  { option: 'External' },
  { option: 'Mixed' }
];

  constructor(private fb: FormBuilder, private tokenService: TokenService, 
              private categoryService: CategoryService, private storeLocationService: StoreLocationService,
              private inventoryMovementService: InventoryMovementService, private toastr: ToastrService,
              private itemRequestService: ItemRequestService, private user: UserService) 
  {
    this.giftRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      function: ['', Validators.required],
      description: ['', Validators.required],
      justification: ['', Validators.required],
      ghet: ['', Validators.required],
      sourceStoreId: ['', Validators.required],
      department: ['', Validators.required],
      hodToApprove: ['', Validators.required],
      gifts: this.fb.array([this.createGiftItem()])
    });
  }

  ngOnInit(): void {
    this.getinfo();
    this.loadFormValues();
    this.getAllCategories();
    this.getAllGhetStores();
    this.getAllHoDs();
    this.giftRequestForm.get('sourceStoreId')?.valueChanges.subscribe(selectedStoreId => {
    this.onStoreChange(selectedStoreId); 
  });

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

        async getAllGhetStores() {
          let resGetAllGhetStores = await this.storeLocationService.getallGhetStores().toPromise();
          this.allGhetStores = <StoreLocation[]><unknown>resGetAllGhetStores?.responseData;
        }

        async getAllHoDs() {
          let resGetAllHoDs = await this.user.getAllHoDUsers().toPromise();
          this.allHoDs = <User[]><unknown>resGetAllHoDs?.responseData;
        }

        async getGhetItemsForStore(storeId: number) {
          const resGetMyMovts = await this.inventoryMovementService.getGhetInventoryMovementsByStoreId(storeId).toPromise();
          this.storeInvMovts = <InventoryMovement[]><unknown>resGetMyMovts?.responseData;
        }

    async onStoreChange(storeId: number): Promise<void> {

    let resGetSelectedStore = await this.storeLocationService.getStoreLocationById(storeId).toPromise();
    this.selectedStore = <StoreLocation>resGetSelectedStore?.responseData;

    this.storeFunctionId = this.selectedStore.functionId;

    this.giftRequestForm.patchValue({
      department: this.selectedStore.functionName
    });
  
    //Gets the inventories for selected store
    this.getGhetItemsForStore(storeId);

    // Clear only the selected items if the store changes.
    while (this.giftsArray.length !== 0) {
      this.giftsArray.removeAt(0);
    }
    this.giftsArray.push(this.createGiftItem());
  }   

  createGiftItem(): FormGroup {
    return this.fb.group({
      itemId: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }

  addGiftItem(): void {
    this.giftsArray.push(this.createGiftItem());
  }

  removeGiftItem(index: number): void {
    if (this.giftsArray.length > 1) {
      this.giftsArray.removeAt(index);
    }
  }

  onSubmit(): void {

    const formData = this.giftRequestForm.value;
    console.log('Form submitted:', formData);

    if (this.giftRequestForm.invalid) {
      this.giftRequestForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
  }

    if (this.isSubmitting  == true)  {
      return; 
    }

    let sourceStoreIdText = this.giftRequestForm.get('sourceStoreId')?.value || '';
    let convertedLocationId = this.convertToNumber(this.locationId);
    let convertedFunctionId = this.convertToNumber(this.functionId);
    let convertedStoreId = this.convertToNumber(sourceStoreIdText);


    this.isSubmitting = true;

    const ghetItemRequestVm: GhetItemRequest = {
      userId: this.userId,
      employeeEmail: this.email,
      employeeLocationId: convertedLocationId,
      description: this.giftRequestForm.get('description')?.value || '',
      sourceStoreId: convertedStoreId,
      storeFunctionId: this.storeFunctionId,
      employeeFunctionId: convertedFunctionId,
      justification: this.giftRequestForm.get('justification')?.value || '',
      ghet: this.giftRequestForm.get('ghet')?.value || '',
      hodToApprove: this.giftRequestForm.get('hodToApprove')?.value || '',
      requestItems: (this.giftRequestForm.get('gifts') as FormArray)?.value || []
    }

    console.log(ghetItemRequestVm);

    debugger;
      this.itemRequestService.createGhetItemRequest(ghetItemRequestVm).subscribe(
        {
          next: (data => {
            this.isSubmitting = false;
            if (data.responseCode == "00") {
              this.toastr.success('Request created successfully');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
            else {
              this.toastr.error(data.message);
              this.isSubmitting = false;
            }
          }),
          error: ((error: any) => {
            console.log(error);
            this.toastr.error('Oops! Something went wrong. \nIt\'s not you, it\'s us. \nPlease try again');
          }),
          complete: () => {
            this.isSubmitting = false; 
            this.resetForm();
          }
        }
      );

      this.isSubmitting = false; 
  }

  resetForm(): void {
    this.giftRequestForm.reset();
    
    // Clear the gifts array and add one default item
    while (this.giftsArray.length !== 0) {
      this.giftsArray.removeAt(0);
    }
    this.giftsArray.push(this.createGiftItem());
    this.loadFormValues();
    
    this.toastr.success('Form reset successfully');
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