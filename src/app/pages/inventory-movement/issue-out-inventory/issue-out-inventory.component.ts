import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { TitleStrategy } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Department } from 'src/app/models/department';
import { InventoryMovtVm } from 'src/app/models/inventory-movementVm';
import { Item } from 'src/app/models/item';
import { LocationDto } from 'src/app/models/locations';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { StoreLocation } from 'src/app/models/store-location';
import { DepartmentService } from 'src/app/services/department/department.service';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';
import { ItemService } from 'src/app/services/item/item.service';
import { LocationService } from 'src/app/services/location/location.service';
import { ValidationService } from 'src/app/services/shared/validation.service';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { TokenService } from 'src/app/services/token/token.service';
import { ToastrService } from 'ngx-toastr';
import { IssueOutInventoryVm } from 'src/app/models/issue-out-inventory';
import { InventoryMovement } from 'src/app/models/inventory-movement';

@Component({
  selector: 'app-issue-out-inventory',
  templateUrl: './issue-out-inventory.component.html',
  styleUrls: ['./issue-out-inventory.component.scss']
})
export class IssueOutInventoryComponent implements OnInit {

  inventoryMovementForm: FormGroup;
  currentUser: any;
  firstName: string = '';
  lastName: string = '';
  fullname: string = '';
  email: string = '';
  department: string = '';
  userId: string = '';
  isSubmitting: boolean = false;

  movementTypes: string[] = ['In', 'Out'];
  movementDate: Date | null = null;
  newMovementDate: Date | null = null;
  today: Date = new Date();

  allItems: InventoryMovement[] = [];
  filteredItems: InventoryMovement[] = [];
  searchInputItems = new FormControl();

  allLocations: LocationDto[] = [];
  filteredLocations: LocationDto[] = [];
  searchInputLocation = new FormControl();
  
  allDepartments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchInputDepartments = new FormControl();

  allStoreLocations: StoreLocation[] = [];
  filteredStoreLocations: StoreLocation[] = [];
  searchInputStoreLocations = new FormControl();

  constructor(private fb: FormBuilder, private validationService: ValidationService, private tokenService: TokenService, 
              private inventoryMovementService: InventoryMovementService, private locationService: LocationService, private departmentService: DepartmentService,
              private storeLocationsService: StoreLocationService, private inventorymovement: InventoryMovementService,
              private toastr: ToastrService
  ) 
  {
    this.movementDate = new Date();

    this.inventoryMovementForm = this.fb.group({
      storeLocationId: ['', Validators.required],
      movementType: ['Out', Validators.required],
      issuerEmail: ['', Validators.required],
      destinationStoreId: ['', Validators.required],
      destinationLocationId: ['', Validators.required],
      movementDate: [this.movementDate, Validators.required],
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
      this.userId = this.currentUser.profile.id;
    }

    //I use this to get the values of the items form array
    get items(): FormArray {
      return this.inventoryMovementForm.get('items') as FormArray;
    }

    addItem(): void {
      const itemGroup = this.fb.group({
        itemId: ['', Validators.required],
        quantity: ['', [Validators.required, this.validationService.validatePositiveInteger.bind(this.validationService)]]
      });
      this.items.push(itemGroup);
    }
  
    removeItem(index: number): void {
      this.items.removeAt(index);
    }

    clearItems() {
      const items = this.inventoryMovementForm.get('items') as FormArray;
      while (items.length > 1) {
        items.removeAt(items.length - 1);
      }
    }

    getDate(){
      this.inventoryMovementForm.get('movementDate')?.valueChanges.subscribe((date: any) => {
        if (date) {
          this.movementDate = new Date(date);
        } else {
          this.movementDate = null;
        }
      });
    }

      convertToNumber(){
      this.inventoryMovementForm.get('debitCreditQuantity')?.valueChanges.subscribe(value => {
        if (value !== null && value !== '') {
          const numericValue = Number(value);
          this.inventoryMovementForm.get('debitCreditQuantity')?.setValue(numericValue, { emitEvent: false });
        }
      });
    }

    loadFormValues() {
      debugger;
      this.inventoryMovementForm.patchValue({
        issuerEmail: this.fullname
      });
    }
  
    async getAllInventoryItems() {
      let resGetAllItems = await this.inventoryMovementService.getallInventoryMovements().toPromise();
      this.allItems = <InventoryMovement[]>resGetAllItems?.responseData;
      this.filteredItems = this.allItems;
    }

    async getAllLocations() {
      let resGetAllLocations = await this.locationService.getAllLocations().toPromise();
      this.allLocations = <LocationDto[]><unknown>resGetAllLocations?.responseData;
      this.filteredLocations = this.allLocations;
    }

    async getAllDepartments() {
      let resGetAllDepartments = await this.departmentService.getallDepartments().toPromise();
      this.allDepartments = <Department[]><unknown>resGetAllDepartments?.responseData;
      this.filteredDepartments = this.allDepartments;
    }

    async getAllStoreLocations() {
      let resGetAllStoreLocations = await this.storeLocationsService.getallStoreLocations().toPromise();
      this.allStoreLocations = <StoreLocation[]><unknown>resGetAllStoreLocations?.responseData;
      this.filteredStoreLocations = this.allStoreLocations;
    }

    //I Put all fetched API calls here
    loadResources(){
      this.addItem();
      this.getinfo();
      this.getAllInventoryItems();
      this.getAllLocations();
      this.getAllDepartments();
      this.getAllStoreLocations();
      this.getDate();
      this.loadFormValues();
      this.convertToNumber();
    }

    // I use this to subscribe to search input changes
    searchInputs(){
      this.searchInputItems.valueChanges
      .pipe(debounceTime(300)) // Add debounce time to avoid excessive filtering
      .subscribe(value => this.filterItems(value));
    }

  //Filters start here

  filterItems(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredItems = this.allItems; // If search term is empty, show all items
    } else {
      this.filteredItems = this.allItems.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) // Case-insensitive filtering
      );
    }
  }

  //End of filters


  onSubmit(): void {
    console.log(this.inventoryMovementForm.value);
    debugger;

    if (this.movementDate) {
      this.newMovementDate = new Date(this.movementDate);

      const currentTime = new Date();
      
      this.newMovementDate.setHours(currentTime.getHours());
      this.newMovementDate.setMinutes(currentTime.getMinutes());
      this.newMovementDate.setSeconds(currentTime.getSeconds());
    }

    let inventoryVm: IssueOutInventoryVm = {
      movementDate: this.newMovementDate,
      storeId: this.inventoryMovementForm.get('storeLocationId')?.value || '',
      movementType: this.inventoryMovementForm.get('movementType')?.value || '',
      sentBy: this.email,
      destinationStoreId: this.inventoryMovementForm.get('destinationStoreId')?.value || '',
      destinationLocationId: this.inventoryMovementForm.get('destinationLocationId')?.value || '',
      items: (this.inventoryMovementForm.get('items') as FormArray)?.value || []
    }

      console.log(inventoryVm);
      debugger;

      this.inventorymovement.createOutwardMovt(inventoryVm).subscribe(
        {
          next: (data => {
            if (data.responseCode == "00") {
              this.toastr.success('Issue Items successful');
              this.isSubmitting = false;
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
        }
      )
    
  }

  cancel() {
    this.inventoryMovementForm.reset();
    this.clearItems();    
  }

}