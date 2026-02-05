import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/models/department';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { LocationDto } from 'src/app/models/locations';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { RequestItems } from 'src/app/models/requestItemVm';
import { StoreLocation } from 'src/app/models/store-location';
import { DepartmentService } from 'src/app/services/department/department.service';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { LocationService } from 'src/app/services/location/location.service';
import { ValidationService } from 'src/app/services/shared/validation.service';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { TokenService } from 'src/app/services/token/token.service';

export function quantityValidator(availableQuantity: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const quantityValue = control.value;

    // Check if quantityValue is greater than availableQuantity
    if (quantityValue > availableQuantity) {
      return { quantityExceeded: true };
    }
    return null; // No error
  };
}

@Component({
  selector: 'app-request-items',
  templateUrl: './request-items.component.html',
  styleUrls: ['./request-items.component.scss']
})
export class RequestItemsComponent implements OnInit {

  itemRequestForm: FormGroup;
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

  displayedQuantities: (number | null)[] = [];
  selectedItemIds: number[] = [];

  allInventoryMovts: InventoryMovement[] = [];
  filteredInventoryMovts: InventoryMovement[] = [];

  getInvMovByStoreId: InventoryMovement[] = [];
  storeInvMovts: InventoryMovement[] = [];
  filteredItems: InventoryMovement[] = [];

  allLocations: LocationDto[] = [];
  filteredLocations: LocationDto[] = [];

  allStoreLocations: StoreLocation[] = [];
  filteredStoreLocations: StoreLocation[] = [];
  
  allDepartments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchInputDepartments = new FormControl();

  selectedLocation!: StoreLocation;
  storeFunctionId!: number;
  searchInputStores = new FormControl();
  searchInputItems  = new FormControl();

  constructor(private fb: FormBuilder, private validationService: ValidationService, private tokenService: TokenService, 
              private inventoryMovementService: InventoryMovementService, private locationService: LocationService, private departmentService: DepartmentService,
              private storeLocationService: StoreLocationService, private toastr: ToastrService, private itemRequestService: ItemRequestService
  ) 
  {
    this.itemRequestForm = this.fb.group({
      email: ['', Validators.required],
      department: ['', Validators.required],
      destinationLocation: ['', Validators.required],
      description: ['', Validators.required],
      sourceStoreId: ['', Validators.required],
      sourceDepartmentId: ['', Validators.required],
      items: this.fb.array([])
    });

  }


  ngOnInit(): void {
    
    this.loadResources();
  }

  getinfo(){
    debugger
    
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;

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

    async getAllInventoryItems() {
      let resGetAllInventoryMovts = await this.inventoryMovementService.getallInventoryMovements().toPromise();
      this.allInventoryMovts = <InventoryMovement[]><unknown>resGetAllInventoryMovts?.responseData;
      this.filteredInventoryMovts = this.allInventoryMovts;
    }

    async getInvMovtsByStoreId(id: number) {
      const resGetMyMovts = await this.inventoryMovementService.getInventoryMovementsByStoreId(id).toPromise();
      this.getInvMovByStoreId = <InventoryMovement[]><unknown>resGetMyMovts?.responseData;
      this.storeInvMovts = this.getInvMovByStoreId;
    }

    

    async getAllStoreLocations() {
      let resGetAllStoreLocations = await this.storeLocationService.getallStoreLocations().toPromise();
      this.allStoreLocations = <StoreLocation[]><unknown>resGetAllStoreLocations?.responseData;
      this.filteredStoreLocations = this.allStoreLocations;
    }

    async getAllDepartments() {
      let resGetAllDepartments = await this.departmentService.getallDepartments().toPromise();
      this.allDepartments = <Department[]><unknown>resGetAllDepartments?.responseData;
      this.filteredDepartments = this.allDepartments;
    }

    //I Put all fetched API calls here
    loadResources(){
      this.addItem(); 
      this.getinfo();
      this.loadFormValues();
      this.getAllInventoryItems();
      this.getAllStoreLocations();
      this.getAllDepartments();
      this.setupStoreSearch();
    }


    //I use this to initializes the form values
    loadFormValues() {
      this.itemRequestForm.patchValue({
        email: this.email,
        department: this.department,
        destinationLocation: this.location
      });
    }

  //I use this to get the values of the items form array
  get items(): FormArray {
    return this.itemRequestForm.get('items') as FormArray;
  }

  //Filters start here
  setupStoreSearch() {
    this.searchInputStores.valueChanges.subscribe(value => {
      this.filterStores(value);
    });
  }

  filterStores(searchTerm: string) {
    if (!searchTerm) {
      this.filteredStoreLocations = this.allStoreLocations; // Reset to all stores if search term is empty
    } else {
      this.filteredStoreLocations = this.allStoreLocations.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  //For item search
  setupItemSearch() {
    this.searchInputItems.valueChanges.subscribe(value => {
      this.filterItems(value);
    });
  }

  filterItems(searchTerm: string) {
    if (!searchTerm) {
      this.filteredItems = this.storeInvMovts; // Reset to all items if search term is empty
    } else {
      this.filteredItems = this.storeInvMovts.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  //End of filters

  async getItemsForStore(storeId: number) {
    const resGetMyMovts = await this.inventoryMovementService.getInventoryMovementsByStoreId(storeId).toPromise();
    this.getInvMovByStoreId = <InventoryMovement[]><unknown>resGetMyMovts?.responseData;
    this.storeInvMovts = this.getInvMovByStoreId;
    this.filteredItems = this.storeInvMovts; // Initialize filtered items
    this.setupItemSearch();
  }


  async onStoreChange(storeId: number): Promise<void> {

    let resGetAllStoreLocations = await this.storeLocationService.getStoreLocationById(storeId).toPromise();
    this.selectedLocation = <StoreLocation>resGetAllStoreLocations?.responseData;

    this.storeFunctionId = this.selectedLocation.functionId;

    this.itemRequestForm.patchValue({
      sourceDepartmentId: this.selectedLocation.functionName
    });
  
    //I replaced the former API call with this
    this.getItemsForStore(storeId);

    // Clear only the selected items if the store changes.
    this.items.controls.forEach((control, index) => {
      control.get('itemId')?.reset();
      this.displayedQuantities[index] = null; // Reset displayed quantities
    });
  }

  updateDisplayedQuantity(index: number): void {
    const itemId = this.items.at(index).get('itemId')?.value;
    const selectedItem = this.storeInvMovts.find(item => item.id === itemId);
    this.displayedQuantities[index] = selectedItem ? selectedItem.quantity : null;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      itemId: [null, [Validators.required]],
      quantity: [null, []] // Start with no validators
    });
  
  
    itemGroup.get('itemId')?.valueChanges.subscribe((value: number | null) => {
      if (value !== null) {
        const selectedItem = this.storeInvMovts.find(item => item.id === value);
        if (selectedItem) {
          const availableQuantity = selectedItem.quantity;
  
          itemGroup.get('quantity')?.setValidators([
            Validators.required,
            this.validationService.validatePositiveInteger(availableQuantity)
          ]);
          itemGroup.get('quantity')?.updateValueAndValidity(); 
        }
      }
     
      this.updateDisplayedQuantity(this.items.length - 1);
    });
  
    this.items.push(itemGroup);
    this.displayedQuantities.push(null); // Add a placeholder for the quantity display
  }

  removeItem(index: number): void {
    const itemId = this.items.at(index).get('itemId')?.value;
    if (itemId !== null) {
      this.selectedItemIds = this.selectedItemIds.filter(id => id !== itemId);
    }
    this.items.removeAt(index);
    this.displayedQuantities.splice(index, 1);
  }

  onSubmit(): void {

    if (this.itemRequestForm.invalid) {
      this.itemRequestForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
  }

    if (this.isSubmitting  == true)  {
      return; 
    }

    this.isSubmitting = true;

    let locationId = this.convertToNumber(this.locationId);
    let functionId = this.convertToNumber(this.functionId);

    let itemRequestVm: RequestItems = {
      userId: this.userId,
      employeeEmail: this.email,
      employeeLocationId: locationId, 
      employeeFunctionId: functionId,
      description: this.itemRequestForm.get('description')?.value || '',
      sourceStoreId: this.itemRequestForm.get('sourceStoreId')?.value || '',
      storeFunctionId: this.storeFunctionId,
      requestItems: (this.itemRequestForm.get('items') as FormArray)?.value || []
    }
  
      //console.log(itemRequestVm);
      debugger;
      this.itemRequestService.createRequestForItems(itemRequestVm).subscribe(
        {
          next: (data => {
            this.isSubmitting = false;
            if (data.responseCode == "00") {
              this.toastr.success('Request created successful');
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
            this.itemRequestForm.reset();
          }
        }
      );
    
  }

  cancel() {
    window.location.reload();  
  }

  clearItems(): void {
    // this.items.clear();
    this.clear();
    this.displayedQuantities = [];
  }
    clear() {
      const items = this.itemRequestForm.get('items') as FormArray;
      while (items.length > 1) {
        items.removeAt(items.length - 1);
      }
    }

     convertToNumber(value: string | null | undefined): number {
      if (value === null || value === undefined) {
        return 0; 
      }
      const parsedValue = Number(value);
      return parsedValue;
    }
}