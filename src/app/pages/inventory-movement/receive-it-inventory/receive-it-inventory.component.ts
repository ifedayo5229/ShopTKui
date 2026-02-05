import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { InventoryMovtVm } from 'src/app/models/inventory-movementVm';
import { Item } from 'src/app/models/item';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { InventoryMovementService } from 'src/app/services/inventoryMovement/inventory-movement.service';
import { ItemService } from 'src/app/services/item/item.service';
import { ValidationService } from 'src/app/services/shared/validation.service';
import { TokenService } from 'src/app/services/token/token.service';
import { ToastrService } from 'ngx-toastr';
import { InventoryMovement } from 'src/app/models/inventory-movement';
import { StoreLocation } from 'src/app/models/store-location';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';

@Component({
  selector: 'app-receive-it-inventory',
  templateUrl: './receive-it-inventory.component.html',
  styleUrls: ['./receive-it-inventory.component.scss']
})
export class ReceiveItInventoryComponent implements OnInit {

  inventoryMovementForm: FormGroup;
  currentUser: any;
  firstName: string = '';
  lastName: string = '';
  fullname: string = '';
  email: string = '';
  department: string = '';
  userId: string = '';
  storeName: string = '';
  storeId!: number;
  isSubmitting: boolean = false;

  movementTypes: string[] = ['In', 'Out'];
  movementDate: Date | null = null;
  newMovementDate: Date | null = null;
  today: Date = new Date();

  allItems: Item[] = [];
  filteredItems: Item[] = [];
  searchInputItems = new FormControl();
  searchInputStores = new FormControl();

  getInvMovByStoreId: InventoryMovement[] = [];
  storeInvMovts: InventoryMovement[] = [];

  displayedQuantities: (number | null)[] = [];
  selectedItemIds: number[] = [];

  allStoreLocations: StoreLocation[] = [];
  filteredStoreLocations: StoreLocation[] = [];



  constructor(private fb: FormBuilder, private validationService: ValidationService, private tokenService: TokenService, 
              private itemService: ItemService, private inventorymovement: InventoryMovementService, 
              private toastr: ToastrService, private storeLocationService: StoreLocationService
  ) 
  {
    this.movementDate = new Date();

    this.inventoryMovementForm = this.fb.group({
      storeLocationId: ['', Validators.required],
      movementType: ['In', Validators.required],
      receiverIssuerEmail: ['', Validators.required],
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
      
      this.currentUser = this.tokenService.getInfo(); 
      this.firstName = this.currentUser.profile.firstName;
      this.lastName = this.currentUser.profile.lastName;
      this.fullname =  this.lastName + ' ' + this.firstName;
      this.email = this.currentUser.profile.email;
      this.department = this.currentUser.profile.functionName;
      this.userId = this.currentUser.profile.id;

      var roles = this.currentUser.roles;
      
    }
  

    //I use this to get the values of the items form array
    get items(): FormArray {
      return this.inventoryMovementForm.get('items') as FormArray;
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
        receiverIssuerEmail: this.fullname,
        storeLocationId: this.storeName
      });
    }
      

    async getAllItems() {
      debugger;
      let resGetAllItems = await this.itemService.getallITItems().toPromise();
      this.allItems = <Item[]><unknown>resGetAllItems?.responseData;
      this.filteredItems = this.allItems;
      debugger;
    }

    async getAllStoreLocations() {
      let resGetAllStoreLocations = await this.storeLocationService.getallITStores().toPromise();
      this.allStoreLocations = <StoreLocation[]><unknown>resGetAllStoreLocations?.responseData;
      this.filteredStoreLocations = this.allStoreLocations;
    }

    setupStoreSearch() {
    this.searchInputStores.valueChanges.subscribe(value => {
      this.filteredStoreLocations;
    });
  }

    setupSearch() {
      this.searchInputItems.valueChanges.subscribe(value => {
        this.filterItems(value);
      });
    }
  
    filterItems(searchTerm: string) {
      if (!searchTerm) {
        this.filteredItems = this.allItems; // Reset to all items if search term is empty
      } else {
        this.filteredItems = this.allItems.filter(item =>
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    filterStoreLocations(searchTerm: string) {
      if (!searchTerm) {
        this.filteredStoreLocations = this.allStoreLocations; // Reset to all items if search term is empty
      } else {
        this.filteredStoreLocations = this.allStoreLocations.filter(store =>
          store.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }


    addItem(): void {
      const itemGroup = this.fb.group({
          itemId: [null, [Validators.required]],
          quantity: ['', [Validators.required, this.validationService.validateJustPositiveInteger()]] 
      });
      this.items.push(itemGroup);
    }

  
    removeItem(index: number): void {
      this.items.removeAt(index);
    }
    
    //I Put all Init calls here
    loadResources(){
      this.addItem();
      this.getinfo();
      this.getAllItems();
      this.getAllStoreLocations();
      this.getDate();
      this.loadFormValues();
      this.convertToNumber();
      this.setupSearch();
      this.setupStoreSearch();
    }


  onSubmit(): void {
    debugger;
      if (this.inventoryMovementForm.invalid) {
        this.inventoryMovementForm.markAllAsTouched();
        return; 
    }

    if (this.isSubmitting  == true)  {
      return; 
    }
  
    this.isSubmitting = true;

    debugger;

    if (this.movementDate) {
      this.newMovementDate = new Date(this.movementDate);

      const currentTime = new Date();
      
      this.newMovementDate.setHours(currentTime.getHours());
      this.newMovementDate.setMinutes(currentTime.getMinutes());
      this.newMovementDate.setSeconds(currentTime.getSeconds());
    }


    let inventoryVm: InventoryMovtVm = {
      movementDate: this.newMovementDate,
      storeId: this.inventoryMovementForm.get('storeLocationId')?.value || 0,
      receivedBy: this.email,
      movementType: this.inventoryMovementForm.get('movementType')?.value || '',
      items: (this.inventoryMovementForm.get('items') as FormArray)?.value || []
    }

      console.log(inventoryVm);
      debugger;

      this.inventorymovement.createITInventoryMovt(inventoryVm).subscribe(
        {
          next: (data => {
            this.isSubmitting = false;
            if (data.responseCode == "00") {
              this.toastr.success('Inventory movement successful');
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
            this.inventoryMovementForm.reset();
          }
        }
      )
    
  }

  cancel() {
    window.location.reload();    
  }

}