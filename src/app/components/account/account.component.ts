import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User, UserUtils } from '../../models/user';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { createCustomFormInputObject, FormBuildingInstructions } from '../../models/custom-types';
import { CustomValidators } from '../../core/utils/custom-validators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {

  currentUser: User | null = null;
  updatedUser: User | null = null;
  isInEditMode: boolean = false;
  editForm: FormGroup | null = null;
  userFormBuildingInstructions!: FormBuildingInstructions;

  uniqueValuesErrors: string[] = [];

  

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {

    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.updatedUser = { 
      username: this.currentUser!.username, 
      email: this.currentUser!.email, 
      password: this.currentUser!.username, 
      cart: this.currentUser!.cart, 
      isAdmin: this.currentUser!.isAdmin 
    };

    this.userFormBuildingInstructions = {
      inputs: [
        createCustomFormInputObject( 'userEmail', 'email', this.currentUser?.email, [Validators.required, CustomValidators.validEmail()] ),
        createCustomFormInputObject( 'username', 'text', this.currentUser?.username, [Validators.required] ),
        createCustomFormInputObject( 'password', 'password', '', [Validators.required], ['passwordConfirm'] ),
        createCustomFormInputObject( 'passwordConfirm', 'password', '', [Validators.required, CustomValidators.passwordsMatch()] ),
      ],
      formHeader: 'User Edit',
      buttonsNames: {
        submitButtonName: 'Confirm Changes',
        resetButtonName: 'Clear Details',
        cancelButtonName: 'Cancel Edit'
      },
      styleClasses: ['default-theme']
    }
    
  }

  logoutFromAccount(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  deleteAccount(): void {
    const currentUser = this.userService.getCurrentUser();
    this.userService.deleteUser(currentUser!.username);
    this.router.navigate(['/']);
  }


  toggleForm(){
    this.isInEditMode = ! this.isInEditMode;
  }

  validateUniqueFields( formData:any ){
    this.uniqueValuesErrors = [];
    const mustBeUniqueFields = this.userService.getNamesOfUniqueFields();
    console.log(mustBeUniqueFields);
    Object.entries( formData ).forEach( ([key,value]) => {
      if ( 
        UserUtils.isUserDbFieldName(key) && 
        mustBeUniqueFields.includes(key) &&
        this.userService.doesFieldValueExist( key as keyof User , value )
      ) {
        this.uniqueValuesErrors.push(key);
      }
    });
    if (this.uniqueValuesErrors.length === 0) {
      this.updatedUser = this.userService.createUserObjectFromFormData(formData);
      this.updateAccount();
    }
  }

  updateAccount(): void {
    this.userService.updateUser(this.currentUser!, this.updatedUser!);
    this.isInEditMode = false;
  }

}
