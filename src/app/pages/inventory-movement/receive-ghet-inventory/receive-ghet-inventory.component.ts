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
import { environment } from 'src/app/environments/environment.prod';


@Component({
  selector: 'app-receive-ghet-inventory',
  templateUrl: './receive-ghet-inventory.component.html',
  styleUrls: ['./receive-ghet-inventory.component.scss']
})
export class ReceiveGhetInventoryComponent implements OnInit {

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

  hoveredItemId: number | null = null;
  hoveredImageUrl: string | null = null;
  modalImageUrl: string | null = null;
  previewX = 0;
  previewY = 0;

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
      let resGetAllItems = await this.itemService.getallGhetItems().toPromise();
      this.allItems = <Item[]><unknown>resGetAllItems?.responseData;
      this.filteredItems = this.allItems;
      console.log(this.allItems);
      debugger;
    }

    async getAllGhetStores() {
      let resGetAllStoreLocations = await this.storeLocationService.getallGhetStores().toPromise();
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
      this.getAllGhetStores();
      this.getDate();
      this.loadFormValues();
      this.convertToNumber();
      this.setupSearch();
      this.setupStoreSearch();
    }

// keep Angular from re-rendering options unnecessarily
trackById = (_: number, x: any) => x.id;

getItemName(id: number | null | undefined): string {
  if (id == null) return '';
  const found = this.filteredItems?.find(f => f.id === id);
  return found?.itemName ?? '';
}

private buildImageUrl(item: any): string {
  const filePath: string | undefined = item?.uploadFiles?.[0]?.filePath;
  if (!filePath) return '';
  // normalize separators and extract final segment
  const normalized = filePath.replace(/\\/g, '/');
  const fileName = normalized.substring(normalized.lastIndexOf('/') + 1);
  return `${environment.docApiUrl}/uploads/${fileName}`;
}


showPreview(item: any, event: MouseEvent) {
  const url = this.buildImageUrl(item);
  if (!url) return;
  this.hoveredImageUrl = url;
  setTimeout(() => {
    const previewEl = document.querySelector('.preview-image') as HTMLElement;
    if (previewEl) {
      previewEl.classList.remove('fade-out');
    }
  });
  this.movePreview(event); // position immediately
}


movePreview(event: MouseEvent) {
  const offsetX = 10;   // closer to cursor
  const above = 10;     // closer vertically
  const margin = 1;

  let x = event.clientX + offsetX;
  let y = event.clientY - above;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const estW = 100; 
  const estH = 130;

  if (x + estW > vw - margin) x = vw - estW - margin;
  if (y < margin) y = event.clientY + 6; // flip below if too near top
  if (y + estH > vh - margin) y = vh - estH - margin;

  this.previewX = x;
  this.previewY = y;
}


hidePreview() {
  const previewEl = document.querySelector('.preview-image') as HTMLElement;
  if (previewEl) {
    previewEl.classList.add('fade-out');
    setTimeout(() => {
      this.hoveredImageUrl = null;
    }, 200); // match transition duration in CSS
  } else {
    this.hoveredImageUrl = null;
  }
}

openImage(item: any, event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  const url = this.buildImageUrl(item);
  if (!url) return;
  this.modalImageUrl = url;
}

closeModal() {
  this.modalImageUrl = null;
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

      this.inventorymovement.createGhetInventoryMovt(inventoryVm).subscribe(
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