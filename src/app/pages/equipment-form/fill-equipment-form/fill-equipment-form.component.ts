import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { RequestItems } from 'src/app/models/requestItemVm';
import { StoreLocation } from 'src/app/models/store-location';
import { ItemRequestService } from 'src/app/services/item-request/item-request.service';
import { StoreLocationService } from 'src/app/services/store-location/store-location.service';
import { TokenService } from 'src/app/services/token/token.service';
import { EquipmentForm } from 'src/app/models/fill-equipmentVm';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-fill-equipment-form',
  templateUrl: './fill-equipment-form.component.html',
  styleUrls: ['./fill-equipment-form.component.scss']
})
export class FillEquipmentFormComponent implements OnInit {

  equipmentForm: FormGroup;
  currentUser: any;
  firstName: string = '';
  lastName: string = '';
  fullname: string = '';
  email: string = '';
  department: string = '';
  location: string = '';
  employeeId: string = '';
  managerName: string = '';
  userId: string = '';
  isSubmitting: boolean = false;

  showOtherInput = false;
  showManufacturerOtherInput = false;
  items = ['Laptop Bag', 'Power Cord', 'Network Card/Adapter', 'Mouse', 'Docking station', 'Others (Specify)'];

  allStoreLocations: StoreLocation[] = [];
  filteredStoreLocations: StoreLocation[] = [];

  selectedLocation!: StoreLocation;
  storeFunctionId!: number;
  searchInputStores = new FormControl();
  issueId!: number;

  constructor(private fb: FormBuilder, private tokenService: TokenService, private storeLocationService: StoreLocationService, 
              private toastr: ToastrService, private itemRequestService: ItemRequestService, 
              private route: ActivatedRoute) 
  {
    this.equipmentForm = this.fb.group({
      email: ['', Validators.required],
      employeeName: ['', Validators.required],
      idOrPhoneNumber: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      managerName: ['', Validators.required],
      managerAlignment: [true, this.requiredCheckboxValidator],
      type: ['', Validators.required],
      otherType: [''],

      manufacturer: ['', Validators.required],
      manufacturerType: [''],

      model: ['', Validators.required],
      hostname: ['', Validators.required],
      serialNumber: ['', Validators.required],

      laptopBag: [false],
      powerCord: [false],
      networkCard: [false],
      mouse: [false],
      dockingStation: [false],
      others: [false],
      otherItem: [''],

      returnSysHostname: [''],
      comment: [''],
      policySignature: [true, this.requiredCheckboxValidator],

      items: this.fb.array([])
    }, { validators: this.atLeastOneCheckboxRequired }); // Custom validator for items checkboxes

  }


  ngOnInit(): void {
    this.loadResources();
    this.route.queryParams.subscribe(params => {
      this.issueId = +params['issueId']; 
    });
  }

  getinfo(){
  
      const loginResponse: LoginResponseData = this.tokenService.getInfo();
      var datas = loginResponse.permission;

      this.currentUser = this.tokenService.getInfo(); 
      this.firstName = this.currentUser.profile.firstName;
      this.lastName = this.currentUser.profile.lastName;
      this.fullname =  this.lastName + ' ' + this.firstName;
      this.email = this.currentUser.profile.email;
      this.department = this.currentUser.profile.functionName;
      this.location = this.currentUser.profile.locationName;
      this.managerName = this.currentUser.profile.lineManager;
      this.employeeId = this.currentUser.profile.employeeId;
      this.userId = this.currentUser.profile.id;

    }


    

    async getAllStoreLocations() {
      let resGetAllStoreLocations = await this.storeLocationService.getallStoreLocations().toPromise();
      this.allStoreLocations = <StoreLocation[]><unknown>resGetAllStoreLocations?.responseData;
      this.filteredStoreLocations = this.allStoreLocations;
    }

    //I Put all fetched API calls here
    loadResources(){
      this.getinfo();
      this.loadFormValues();
      this.getAllStoreLocations();
      this.setupStoreSearch();
    }

    //I use this to initialize the form values
    loadFormValues() {
      this.equipmentForm.patchValue({
        email: this.email,
        employeeName: this.fullname,
        idOrPhoneNumber: this.employeeId,
        department: this.department,
        location: this.location,
        managerName: this.managerName
      });
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
  
 onTypeChange(value: string) {
    this.showOtherInput = value === 'Other';
    const otherTypeControl = this.equipmentForm.get('otherType');

    if (this.showOtherInput) {
      otherTypeControl?.setValidators(Validators.required);
    } else {
      otherTypeControl?.clearValidators();
      otherTypeControl?.reset();
    }

    otherTypeControl?.updateValueAndValidity();
  }

  onManufacturerChange(value: string) {

    this.showManufacturerOtherInput = value === 'OtherManufacturer';
    const manufacturerTypeControl = this.equipmentForm.get('manufacturerType');

    if (this.showManufacturerOtherInput) {
      manufacturerTypeControl?.setValidators(Validators.required);
    } else {
      manufacturerTypeControl?.clearValidators();
      manufacturerTypeControl?.reset();
    }

    manufacturerTypeControl?.updateValueAndValidity();
  }

  //For multiple checkboxes
  onOthersChange(event: any) {
    if (!event.checked) {
      this.equipmentForm.get('otherItem')?.setValue('');
    }
  }

  onSubmit(): void {

    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
  }

    if (this.isSubmitting  == true)  {
      return; 
    }
    // For multiple checkboxes
      const formValues = this.equipmentForm.value;
      const selectedItems = [];

      // Collect selected items
      if (formValues.laptopBag) selectedItems.push('Laptop Bag');
      if (formValues.powerCord) selectedItems.push('Power Cord');
      if (formValues.networkCard) selectedItems.push('Network Card/Adapter');
      if (formValues.mouse) selectedItems.push('Mouse');
      if (formValues.dockingStation) selectedItems.push('Docking Station');
      if (formValues.others && formValues.otherItem) selectedItems.push(formValues.otherItem);

      // console.log('Selected Items:', selectedItems);
      // console.log('Forms: ', this.equipmentForm.value)
      debugger;
    this.isSubmitting = true;

    let equipmentForm: EquipmentForm ={
      issueId: this.issueId,
      emailAddress: this.equipmentForm.get('email')?.value || '',
      employeeName: this.equipmentForm.get('employeeName')?.value || '',
      employeeIdOrPhoneNumber: this.equipmentForm.get('idOrPhoneNumber')?.value || '',
      department: this.equipmentForm.get('department')?.value || '',
      location: this.equipmentForm.get('location')?.value || '',
      managerName: this.equipmentForm.get('managerName')?.value || '',
      managerAlignedConfirmation: this.equipmentForm.get('managerAlignment')?.value || false,
      equipmentType: this.equipmentForm.get('type')?.value || this.equipmentForm.get('otherType')?.value,
      manufacturer: this.equipmentForm.get('manufacturer')?.value,
      model: this.equipmentForm.get('model')?.value,
      serialOrPartNumber: this.equipmentForm.get('serialNumber')?.value,
      policyAcknowledged: this.equipmentForm.get('policySignature')?.value || false,
      computerHostName: this.equipmentForm.get('hostname')?.value || '',
      // isEquipmentReturned: false,
      additionalComment: this.equipmentForm.get('comment')?.value || '',
      oldSystemHostNameReturned: this.equipmentForm.get('returnSysHostname')?.value || '',
      items: selectedItems
    }
  
      console.log(equipmentForm);

      debugger;
      this.itemRequestService.fillEquimentForm(equipmentForm).subscribe(
        {
          next: (data => {
            this.isSubmitting = false;
            if (data.responseCode == "00") {
              this.toastr.success('Submit successful');
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
            this.equipmentForm.reset();
          }
        }
      );
    
  }

  cancel() {
    window.location.reload();  
  }


  requiredCheckboxValidator(control: any) {
    return control.value ? null : { required: true };
  }

  atLeastOneCheckboxRequired(control: FormGroup) {
    const { laptopBag, powerCord, networkCard, mouse, dockingStation, others } = control.value;
    if (!laptopBag && !powerCord && !networkCard && !mouse && !dockingStation && !others) {
      return { atLeastOneRequired: true };
    }
    return null;
  }

     convertToNumber(value: string | null | undefined): number {
      if (value === null || value === undefined) {
        return 0; 
      }
      const parsedValue = Number(value);
      return parsedValue;
    }
}