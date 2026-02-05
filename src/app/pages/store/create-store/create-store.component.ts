import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CreateStoreVm } from 'src/app/models/createStore';
import { Department } from 'src/app/models/department';
import { LocationDto } from 'src/app/models/locations';
import { DepartmentService } from 'src/app/services/department/department.service';
import { LocationService } from 'src/app/services/location/location.service';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { MainStoreConfirmationDialogComponent } from '../main-store-confirmation-dialog/main-store-confirmation-dialog.component';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})
export class CreateStoreComponent implements OnInit {

  createStoreForm: FormGroup;
  isSubmitting: boolean = false;

  allLocations: LocationDto[] = [];
  filteredLocations: LocationDto[] = [];
  searchInputLocation = new FormControl();
  
  allDepartments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchInputDepartment = new FormControl();

  constructor(private fb: FormBuilder, private locationService: LocationService, private departmentService: DepartmentService,
              private storeLocationsService: StoreLocationService, private toastr: ToastrService,
              private dialog: MatDialog
  ) 
  {

    this.createStoreForm = this.fb.group({
      storeName: ['', Validators.required],
      descriptions: ['', Validators.required],
      departmentId: ['', Validators.required],
      locationId: ['', Validators.required],
      isMainStore: [false]
    });

  }


  ngOnInit(): void {
    this.loadResources();
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

    //I Put all fetched API calls here
    loadResources(){
      this.getAllLocations();
      this.getAllDepartments();
      this.setupDepartmentSearch();
      this.setupLocationSearch();
    }


    //Search filters start

    setupLocationSearch() {
      this.searchInputLocation.valueChanges.subscribe(value => {
        this.filterLocation(value);
      });
    }
  
    filterLocation(searchTerm: string) {
      if (!searchTerm) {
        this.filteredLocations = this.allLocations; // Reset to all stores if search term is empty
      } else {
        this.filteredLocations = this.allLocations.filter(location =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    setupDepartmentSearch() {
      this.searchInputDepartment.valueChanges.subscribe(value => {
        this.filterDepartments(value);
      });
    }
  
    filterDepartments(searchTerm: string) {
      if (!searchTerm) {
        this.filteredDepartments = this.allDepartments; // Reset to all stores if search term is empty
      } else {
        this.filteredDepartments = this.allDepartments.filter(department =>
          department.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    //Search filters end


    onSubmit(): void {
      if (this.createStoreForm.invalid) {
          this.createStoreForm.markAllAsTouched();
          return; // Exit the function if the form is invalid
      }
  
      this.isSubmitting = true; // Prevent further clicks
  
      const dialogRef = this.dialog.open(MainStoreConfirmationDialogComponent);
  
      dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
              this.createStoreForm.patchValue({ isMainStore: result });
  
              let createStoreVm: CreateStoreVm = {
                  name: this.createStoreForm.get('storeName')?.value || '',
                  description: this.createStoreForm.get('descriptions')?.value || '',
                  functionId: this.createStoreForm.get('departmentId')?.value || '',
                  locationId: this.createStoreForm.get('locationId')?.value || '',
                  isMainStore: this.createStoreForm.get('isMainStore')?.value || false
              };
  
              this.storeLocationsService.createStore(createStoreVm).subscribe({
                  next: (data => {
                      this.isSubmitting = false; // Reset flag
                      if (data.responseCode == "00") {
                          this.toastr.success('Store created successfully');
                          setTimeout(() => {
                              window.location.reload();
                          }, 1000);
                      } else {
                          this.toastr.error(data.message);
                      }
                  }),
                  error: ((error: any) => {
                      this.isSubmitting = false; // Reset flag
                      this.toastr.error('Oops! Something went wrong. \nIt\'s not you, it\'s us. \nPlease try again');
                  }),
              });
          } else {
              this.isSubmitting = false; // Reset flag if dialog is closed without action
          }
      });
  }

  cancel() {
    this.createStoreForm.reset();    
  }

}