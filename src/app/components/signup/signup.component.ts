import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
// import validator from 'validator';
import { UserService } from '../../services/user.service';
import { CustomValidators } from '../../core/utils/custom-validators';
import { createCustomFormInputObject, FormBuildingInstructions } from '../../models/custom-types';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {

  // signupForm!: FormGroup;
  uniqueValuesErrors: string[] = [];
  buildingInstructionsForUserSignupForm: FormBuildingInstructions = {
    inputs: [
      createCustomFormInputObject( 'email', 'email', '', [Validators.required, CustomValidators.validEmail()] ),
      createCustomFormInputObject( 'username', 'text', '', [Validators.required] ),
      createCustomFormInputObject( 'password', 'password', '', [Validators.required], ['passwordConfirm'] ),
      createCustomFormInputObject( 'passwordConfirm', 'password', '', [Validators.required, CustomValidators.passwordsMatch()] ),
    ],
    formHeader: 'User Signup',
    buttonsNames: {
      submitButtonName: 'Signup',
      resetButtonName: 'Clear Details',
      cancelButtonName: 'Cancel'
    },
    styleClasses: ['ocean-theme']
  }

  constructor(private userService: UserService, private router: Router) {}

  // ngOnInit() {
    // this.signupForm = this.fb.group({
    //   email: this.fb.control('', [Validators.required, Validators.email]),
    //   password: this.fb.control('', [Validators.required]),
    //   repeatPassword: this.fb.control('', [Validators.required, CustomValidators.passwordsMatch()])
    // });
  // }

  // get username(){
  //   return this.signupForm.get('username');
  // }

  // get password(){
  //   return this.signupForm.get('password');
  // }

  // get repeatPassword(){
  //   return this.signupForm.get('repeatPassword');
  // }

  // Custom validator to check if passwords match
  // passwordsMatchValidator() {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     // console.log( this.signupForm );
  //     const password = control.parent?.get('password')?.value;
  //     const repeatPassword = control.value;
      
  //     return password === repeatPassword
  //       ? null 
  //       : { passwordsMismatchError: 'Passwords dont match' };
  //   }
  // }

  onSubmit( formData: any ) {
    const uniqueFieldsDuplicatedByForm = this.userService.getUniqueFieldsDuplicatedByForm( formData );
    if ( uniqueFieldsDuplicatedByForm.length > 0 ) {
      this.uniqueValuesErrors = uniqueFieldsDuplicatedByForm;
    }
    else{
      this.userService.signup( formData );
      this.router.navigate(['/']);
    } 

  }

}