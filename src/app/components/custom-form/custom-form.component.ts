import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBuildingInstructions, FormButtonsNames, FormInput } from '../../models/custom-types';
import { StringUtils } from '../../core/utils/string-utils';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.css'],
})

export class CustomFormComponent implements OnInit {

  @Input() customFormBuildingInstructions!: FormBuildingInstructions;
  @Input() uniqueValuesErrorsFromParent: string[] = [];
  @Input() generalErrorsFromParent: string[] = [];
  @Input() buttonsNamesFromParent: FormButtonsNames = {
    submitButtonName: 'Submit',
    resetButtonName: 'Reset',
    cancelButtonName: 'Cancel'
  };

  customForm!: FormGroup;

  @Output() closeForm = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    const formBuilderInputsObject: any = {};
    for (const inputField of this.customFormBuildingInstructions.inputs) {
      formBuilderInputsObject[inputField.nameInCamelCase] = 
      [inputField.defaultValue, inputField.validators]
    }

    // if ( !this.customFormBuildingInstructions.styleClasses ) {
    //   this.customFormBuildingInstructions.styleClasses = ['default'];
    // }

    this.customForm = this.fb.group(formBuilderInputsObject);
    for (const inputField of this.customFormBuildingInstructions.inputs) {
      this.setCrossValidationsForInput( inputField )
    }

  }

  setCrossValidationsForInput( customFormInput: FormInput ){
      for (const effectedInput of customFormInput.effectedInputs ) {
        this.customForm.get(customFormInput.nameInCamelCase)?.valueChanges.subscribe( () => {
          this.customForm.get(effectedInput)?.updateValueAndValidity();
      } )
    }
  }

  getControlErrorMessages(controlName: string): string[] {
    const errors = this.customForm.get(controlName)?.errors;
    const errorMessages: string[] = [];
    if (errors) {
      for (const errorName in errors) {
        if (errors.hasOwnProperty(errorName)) {
          switch (errorName) {
            case 'required':
              errorMessages.push(`${StringUtils.camelCaseToTitleCase(controlName)} is required.`);
              break;
            default:
              errorMessages.push(`${errors[errorName]}`);
          }
        }
      }
    }
    return errorMessages;
  }

  resetValidatorsValues(){
    // console.log('validators reseted');
    // Object.keys(this.customForm.controls).forEach((controlName) => {
    //   this.customForm.get(controlName)?.setErrors(null); // Clear errors for each control
    //   this.customForm.get(controlName)?.updateValueAndValidity(); // Update validity for each control
    // });
    this.uniqueValuesErrorsFromParent = [];
  }

  resetGeneralFormErrors(){
    this.generalErrorsFromParent = [];
  }

  close() {
    this.generalErrorsFromParent = [];
    this.closeForm.emit();
  }

  onSubmit(){
    // this.generalErrors = this.generalErrorsFromParent;
    if (this.customForm.valid) {
      this.formSubmitted.emit(this.customForm.value);
    }
    
  }

}
