import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidatorsReturnType } from '../../models/custom-types';

export class CustomValidators {

  // Custom validator to check if passwords match
  static passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidatorsReturnType => {
      const password = control.parent?.get('password')?.value;
      const passwordConfirm = control.value;
      return password === passwordConfirm
        ? null 
        : { passwordsMismatchError: 
          'Passwords dont match' };
    }
  }

  static validEmail(): ValidatorFn {
    return (control: AbstractControl): ValidatorsReturnType => {
      const validEmailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return ( control.value === "" || validEmailregex.test(control.value) )
        ? null 
        : { invalidEmailError: 
          `Invalid email address.` };
    };
  }

  static mustBeNumber(controlLabel: string): ValidatorFn {
    return (control: AbstractControl): ValidatorsReturnType => {
      return !Number.isNaN(+(control.value))
        ? null 
        : { mustBeNumberError: 
          `${controlLabel} must be a number` };
    };
  }

  static greaterThan(
    controlLabel: string, 
    minValue: number, 
    includeMinVal: boolean = false
  ): ValidatorFn {
    return (control: AbstractControl): ValidatorsReturnType => {
      return control.value === '' || 
      Number.isNaN(+(control.value)) || 
      ( includeMinVal ?  control.value >= minValue : control.value > minValue )
        ? null 
        : { greaterThanError: 
          `${controlLabel} must be greater than ${includeMinVal ? 'or equal to' : ''} ${minValue}` };
    };
  }

  static smallerThan(
    controlLabel: string, 
    maxValue: number, 
    includeMaxVal: boolean = false
  ): ValidatorFn {
    return (control: AbstractControl): ValidatorsReturnType => {
      return control.value === '' || 
      Number.isNaN(+(control.value)) || 
      ( includeMaxVal ?  control.value <= maxValue : control.value < maxValue )
        ? null 
        : { smallerThanError: 
          `${controlLabel} must be smaller than ${includeMaxVal ? 'or equal to' : ''} ${maxValue}` };
    };
  }

  static inRangeOf(
    controlLabel: string, 
    minValue: number, 
    maxValue: number, 
    includeMinVal: boolean = false,
    includeMaxVal: boolean = false
  ): ValidatorFn {
    return (control: AbstractControl): ValidatorsReturnType => {
      if ( control.value === '' || control.value === null ||  control.value === undefined ) {
        return null;
      }
      return Number.isNaN(+(control.value)) || 
        ( includeMinVal ?  control.value >= minValue : control.value > minValue ) &&
        ( includeMaxVal ?  control.value <= maxValue : control.value < maxValue )
        ? null 
        : { outOfRangeError: 
          `${controlLabel} must be greater than ${includeMinVal ? 'or equal to' : ''} ${minValue} and
           smaller than ${includeMaxVal ? 'or equal to' : ''} ${maxValue}` };
    };
  }

}
