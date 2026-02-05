import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Department } from 'src/app/models/department';
import { DisburseItems } from 'src/app/models/disburse-items';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { LocationDto } from 'src/app/models/locations';
import { LoginResponseData } from 'src/app/models/login-response-data';
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
  selector: 'app-it-store-request',
  templateUrl: './it-store-request.component.html',
  styleUrls: ['./it-store-request.component.scss']
})
export class ItStoreRequestComponent implements OnInit {

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
  storeName: string = '';
  storeId!: number;
  isSubmitting: boolean = false;

  displayedQuantities: (number | null)[] = [];
  selectedItemIds: number[] = [];

  getInvMovByStoreId: InventoryMovement[] = [];
  storeInvMovts: InventoryMovement[] = [];
  filteredStoreInvMovts: InventoryMovement[] = [];

  allLocations: LocationDto[] = [];
  filteredLocations: LocationDto[] = [];
  searchInputLocation = new FormControl();

  allStoreLocations: StoreLocation[] = [];
  firstFilteredStoreLocations: StoreLocation[] = [];
  filteredStoreLocations: StoreLocation[] = [];
  searchInputStoreLocation = new FormControl();
  
  allDepartments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchInputDepartments = new FormControl();

  selectedStoreLocation!: StoreLocation;
  storeFunctionId!: number;
  searchInputStores = new FormControl();
  searchInvItems  = new FormControl();
  selectedStoreId!: number;

  constructor(private fb: FormBuilder, private validationService: ValidationService, private tokenService: TokenService, 
              private inventoryMovementService: InventoryMovementService, private locationService: LocationService, private departmentService: DepartmentService,
              private storeLocationService: StoreLocationService, private toastr: ToastrService, private itemRequestService: ItemRequestService
  ) 
  {
    this.itemRequestForm = this.fb.group({
      email: ['', Validators.required],
      department: ['', Validators.required],
      requesterStoreName: ['', Validators.required],
      description: ['', Validators.required],
      sourceStoreId: ['', Validators.required],
      sourceDepartment: ['', Validators.required],
      storeManagerEmail: ['', Validators.required],
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

      var roles = this.currentUser.roles;
      this.setStoreDetails(roles);
    }

      //This gets the store name and store Id from array of roles objects
      setStoreDetails(data: any[]) {
        const storeDetails = data.find(item => item.roleName === "Store Manager");
    
        if (storeDetails) {
          this.storeName = storeDetails.storeName;
          this.storeId = storeDetails.storeId;
        } else {
          console.error("Store Manager role not found.");
        }
      }

    async getInvMovtsByStoreId(id: number) {
      const resGetMyMovts = await this.inventoryMovementService.getITInventoryByStoreId(id).toPromise();
      this.getInvMovByStoreId = <InventoryMovement[]><unknown>resGetMyMovts?.responseData;
      this.storeInvMovts = this.getInvMovByStoreId;
      this.filteredStoreInvMovts = this.storeInvMovts;
    }

    

    async getAllStoreLocations() {
      let resGetAllStoreLocations = await this.storeLocationService.getallITStores().toPromise();
      this.allStoreLocations = <StoreLocation[]><unknown>resGetAllStoreLocations?.responseData;
      this.firstFilteredStoreLocations = this.allStoreLocations.filter(location => location.name !== this.storeName);
      this.filteredStoreLocations = this.firstFilteredStoreLocations;
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
      this.getInvMovtsByStoreId(this.storeId);
      this.getAllStoreLocations();
      this.getAllDepartments();
      this.setupStoreSearch();
      this.setupInvItemSearch();
      this.getInvMovtsByStoreId(this.storeId);
    }

    //I use this to initializes the form values
    loadFormValues() {
      this.itemRequestForm.patchValue({
        email: this.email,
        department: this.department,
        requesterStoreName: this.storeName
      });
    }

  //I use this to get the values of the items form array
  get items(): FormArray {
    return this.itemRequestForm.get('items') as FormArray;
  }

  //Filters start here

  filterStores(searchTerm: string) {
    if (!searchTerm) {
      this.filteredStoreLocations = this.firstFilteredStoreLocations; // Reset to all stores if search term is empty
    } else {
      this.filteredStoreLocations = this.firstFilteredStoreLocations.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  setupStoreSearch() {
    this.searchInputStores.valueChanges.subscribe(value => {
      this.filterStores(value);
    });
  }

  setupInvItemSearch() {
    this.searchInvItems.valueChanges
      .pipe(debounceTime(300)) // Add debounce time to avoid excessive filtering
      .subscribe(value => this.filterInvItems(value));
  }

  filterInvItems(searchTerm: string) {
    if (!searchTerm) {
      this.filteredStoreInvMovts = this.storeInvMovts; // Reset to all items if search term is empty
    } else {
      this.filteredStoreInvMovts = this.storeInvMovts.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  //End of filters

  async onStoreChange(storeId: number): Promise<void> {
    debugger;
    let resGetSelectedStore = await this.storeLocationService.getStoreLocationById(storeId).toPromise();
    this.selectedStoreLocation = <StoreLocation>resGetSelectedStore?.responseData;

    this.storeFunctionId = this.selectedStoreLocation.functionId;
    this.selectedStoreId = this.selectedStoreLocation.id;


    this.itemRequestForm.patchValue({
      sourceDepartment: this.selectedStoreLocation.functionName,
      storeManagerEmail: this.selectedStoreLocation.storeManagerEmail
    });
   
    // this.getInvMovtsByStoreId(this.selectedStoreId);

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
    debugger;

    if (this.itemRequestForm.invalid) {
      this.itemRequestForm.markAllAsTouched();
      return; 
  }

    if (this.isSubmitting  == true)  {
      return; 
    }
  
    this.isSubmitting = true;

    let locationId = this.convertToNumber(this.locationId);
    let functionId = this.convertToNumber(this.functionId);

    let itemdisburseVm: DisburseItems = {
      userId: this.userId,
      employeeEmail: this.email,
      employeeLocationId: locationId, 
      employeeFunctionId: functionId,
      description: this.itemRequestForm.get('description')?.value || '',
      destinationStoreId: this.itemRequestForm.get('sourceStoreId')?.value || '',
      storeFunctionId: this.storeFunctionId,
      sourceStoreId : this.storeId,
      disburseItems: (this.itemRequestForm.get('items') as FormArray)?.value || []
    }
  
      console.log(itemdisburseVm);
      debugger;
      this.inventoryMovementService.DisburseItem(itemdisburseVm).subscribe(
        {
          next: (data => {
            this.isSubmitting = false;
            if (data.responseCode == "00") {
              this.toastr.success('item(s) Disbursed successfully');
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