import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';
import { CreateItem } from 'src/app/models/createItemVm';
import { Department } from 'src/app/models/department';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { StoreLocation } from 'src/app/models/store-location';
import { CategoryService } from 'src/app/services/category/category.service';
import { DepartmentService } from 'src/app/services/department/department.service';
import { ItemService } from 'src/app/services/item/item.service';
import { ValidationService } from 'src/app/services/shared/validation.service';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { TokenService } from 'src/app/services/token/token.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';


@Component({
  selector: 'app-create-it-item',
  templateUrl: './create-it-item.component.html',
  styleUrls: ['./create-it-item.component.scss']
})
export class CreateItItemComponent implements OnInit {

  createItemForm: FormGroup;
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

  allStoreLocations: StoreLocation[] = [];
  filteredStoreLocations: StoreLocation[] = [];
  searchInputStoreLocation = new FormControl();
  
  allDepartments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchInputDepartments = new FormControl();

  constructor(private fb: FormBuilder, private validationService: ValidationService, private tokenService: TokenService, 
              private itemService: ItemService, private categoryService: CategoryService, private departmentService: DepartmentService,
              private storeLocationService: StoreLocationService, private toastr: ToastrService, private dialog: MatDialog
  ) 
  {
    this.createItemForm = this.fb.group({
      creatorEmail: ['', Validators.required],
      creatorDepartment: ['', Validators.required],
      creatorLocation: ['', Validators.required],
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
    
    async getAllStoreLocations() {
      let resGetAllStoreLocations = await this.storeLocationService.getallStoreLocations().toPromise();
      this.allStoreLocations = <StoreLocation[]><unknown>resGetAllStoreLocations?.responseData;
      this.filteredStoreLocations = this.allStoreLocations;
    }

    async getAllCategories() {
      let resGetAllCategories = await this.categoryService.getAllCategories().toPromise();
      debugger;
      this.allCategories = <Category[]><unknown>resGetAllCategories?.responseData;
      this.filteredCategories = this.allCategories;
      debugger;
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
      this.getAllCategories();
      this.getAllStoreLocations();
      this.getAllDepartments();
      this.setupCategorySearch();
    }

    //I use this to initializes the form values
    loadFormValues() {
      this.createItemForm.patchValue({
        creatorEmail: this.email,
        creatorDepartment: this.department,
        creatorLocation: this.location
      });
    }

    createCategory () {
      debugger
      const dialogConfig = new MatDialogConfig();
      const dialogRef = this.dialog.open(CreateCategoryDialogComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          window.location.reload();
        }
      });
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


    //I use this to get the values of the items form array
    get items(): FormArray {
      return this.createItemForm.get('items') as FormArray;
    }

    addItem(): void {
      const itemGroup = this.fb.group({
        categoryId: ['', Validators.required],
        description: ['', Validators.required],
        itemName: ['', Validators.required]
      });
      this.items.push(itemGroup);
    }
  
    removeItem(index: number): void {
      this.items.removeAt(index);
    }

    clearItems() {
      const items = this.createItemForm.get('items') as FormArray;
      while (items.length > 1) {
        items.removeAt(items.length - 1);
      }
    }



  onSubmit(): void {

    if (this.createItemForm.invalid) {
      this.createItemForm.markAllAsTouched();
      return; 
  }

  if (this.isSubmitting  == true)  {
    return; 
  }

  this.isSubmitting = true;

    let functionId = this.convertToNumber(this.functionId);
    let locationId = this.convertToNumber(this.locationId);

    let createItemRequestVm: CreateItem = {
      creatorEmail: this.createItemForm.get('creatorEmail')?.value || '',
      creatorFunctionId: functionId,
      creatorLocationid: locationId,
      items: (this.createItemForm.get('items') as FormArray)?.value || []
    }
  
      console.log(createItemRequestVm);
      debugger;
      this.itemService.createITItems(createItemRequestVm).subscribe(
        {
          next: (data => {
            this.isSubmitting = false;
            if (data.responseCode == "00") {
              this.toastr.success('Item created successfully');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
            else {
              this.isSubmitting = false;
              this.toastr.error(data.message);
              setTimeout(() => {
                window.location.reload();
            }, 2500);
            }
          }),
          error: ((error: any) => {
            console.log(error);
            this.toastr.error('Oops! Something went wrong. \nIt\'s not you, it\'s us. \nPlease try again');
          }),
          complete: () => {
            this.isSubmitting = false; 
            this.createItemForm.reset();
          }
        }
      )
    
  }

  cancel() {
    window.location.reload(); 
}

     convertToNumber(value: string | null | undefined): number {
      if (value === null || value === undefined) {
        return 0; 
      }
      const parsedValue = Number(value);
      return parsedValue;
    }
}