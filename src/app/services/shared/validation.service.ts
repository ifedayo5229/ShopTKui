import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

      public validatePositiveInteger(availableQuantity: number | null) {
        debugger
        return (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
      
          if (value == null || value === '') {
            return { required: 'Quantity is required' };
          }
      
          if (!Number.isInteger(value) || value < 0) {
            return { invalidQuantity: 'Please enter a valid quantity' };
          }
      
          if (value === 0) {
            return { zeroQuantity: 'Quantity cannot be zero' };
          }
      
          if (availableQuantity !== null && value > availableQuantity) {
            return { quantityExceeded: `Please input ${availableQuantity} or less` };
          }
      
          return null; // No errors
        };
      }

      public validateCurrency() {
          return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (value == null || value === '') {
              return null;
            }

            const num = Number(value);

            if (isNaN(num)) {
              return { invalidCost: 'Please enter a valid cost' };
            }

            if (num < 0) {
              return { negativeCost: 'Cost cannot be negative' };
            }

            if (num === 0) {
              return { zeroCost: 'Cost cannot be zero' };
            }

            const currencyRegex = /^\d+(\.\d{1,2})?$/;
            if (!currencyRegex.test(value.toString())) {
              return { invalidFormat: 'Please limit to 2 decimal places' };
            }

            return null; 
          };
      }

      public validateJustPositiveInteger() {
        return (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
      
          if (value == null || value === '') {
            return { required: 'Quantity is required' };
          }
      
          if (!Number.isInteger(value) || value < 0) {
            return { invalidQuantity: 'Please enter a valid quantity' };
          }
      
          if (value === 0) {
            return { zeroQuantity: 'Quantity cannot be zero' };
          }  
      
          return null; // No errors
        };
    }

    public validatePhoneNumber() {
      return (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;

          if (!/^\d+$/.test(value)) {
            return { invalidFormat: 'Phone number must contain only digits.' };
        }
  
          if (value == null || value === '') {
              return { required: 'Phone number is required.' };
          }
  
          if (!value.startsWith('0')) {
              return { invalidStart: 'Phone number must start with 0.' };
          }
  
          if (value.length !== 11) {
              return { invalidLength: 'Phone number must be exactly 11 digits long.' };
          }
  
          return null; // No errors
      };
  }
  
}
