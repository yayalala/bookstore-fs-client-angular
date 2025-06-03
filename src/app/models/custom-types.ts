import { ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { StringUtils } from "../core/utils/string-utils";

export type FormInputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export type customFormThemes = 
| 'default-theme'
| 'ocean-theme';  

export type ValidatorsReturnType = ValidationErrors | null;

export type GeneralValidatorFn = ValidatorFn | ValidatorsReturnType;

export interface FormInput {
  nameInCamelCase: string;
  label: string;
  type: FormInputType;
  defaultValue: string;
  validators:  ValidatorsReturnType[];
  effectedInputs: string[]
}

export function createCustomFormInputObject( 
  givenInputNameInCamelCase: string, 
  givenInputType: FormInputType = 'text',
  givenDefaultValue: string = '',
  validatorsList: ValidatorsReturnType[] = [],
  effectedInputsList: string[] = []
): FormInput {
  return {
    nameInCamelCase: givenInputNameInCamelCase,
    label: StringUtils.camelCaseToTitleCase(givenInputNameInCamelCase),
    type: givenInputType,
    defaultValue: givenDefaultValue,
    validators: validatorsList,
    effectedInputs: effectedInputsList
  }
}


export interface FormButtonsNames {
  submitButtonName: string;
  resetButtonName: string;
  cancelButtonName: string;
}


export interface FormBuildingInstructions {
  inputs: FormInput[];
  formHeader: string;
  buttonsNames: FormButtonsNames;
  styleClasses: string[];
}

export function createCustomFormBuildingInstructions( 
  providedFormInputs: FormInput[],
  providedFormHeader: string = 'Custom Form',
  providedButtonsNames: FormButtonsNames = {
    submitButtonName: 'Submit',
    resetButtonName: 'Reset',
    cancelButtonName: 'Cancel'
  },
  providedStyleClasses: string[] = ['default-theme']
): FormBuildingInstructions {
  return {
    formHeader: providedFormHeader,
    inputs: providedFormInputs,
    buttonsNames: providedButtonsNames,
    styleClasses: providedStyleClasses
  }
}
