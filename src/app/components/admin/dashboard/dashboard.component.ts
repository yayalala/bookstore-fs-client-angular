import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { User, UserUtils } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { Book, BookUtils } from '../../../models/book';
import { BookService } from '../../../services/book.service';
import { createCustomFormInputObject, FormBuildingInstructions } from '../../../models/custom-types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core/utils/custom-validators';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  currentAdmin: User | null = null;
  dbSearchQuery: string = '';
  // currentUser: User | null = null;
  updatedAdmin: User | null = null;
  isInAdminEditMode: boolean = false;
  editForm: FormGroup | null = null;
  userEditFormBuildingInstructions!: FormBuildingInstructions;
  bookEditFormBuildingInstructions!: FormBuildingInstructions;
  addNewBookFormBuildingInstructions!: FormBuildingInstructions;

  books: Book[] = [];
  availableBooks: Book[] = [];
  bookForEdit!: Book;
  isInBookEditMode: boolean = false;
  isInBookAddingMode: boolean = false;
  generalErrors: string[] = [];

  constructor(
    private userService: UserService, 
    private bookService: BookService, 
    private router: Router
    ) {}

  // ngOnInit(): void {
  //   this.existingBooks = this.bookService.getBooksDb();
  // }

  

  // showForm = false;

  uniqueValuesErrors: string[] = [];

  // constructor( private userService: UserService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {

    this.userService.currentUser$.subscribe(user => {
      this.currentAdmin = user;
    });

    this.updatedAdmin = { 
      username: this.currentAdmin!.username, 
      email: this.currentAdmin!.email, 
      password: this.currentAdmin!.username, 
      cart: this.currentAdmin!.cart, 
      isAdmin: this.currentAdmin!.isAdmin 
    };

    this.userEditFormBuildingInstructions = {
      inputs: [
        createCustomFormInputObject( 'email', 'email', this.currentAdmin?.email , [Validators.required, CustomValidators.validEmail()] ),
        createCustomFormInputObject( 'username', 'text', this.currentAdmin?.username , [Validators.required] ),
        createCustomFormInputObject( 'password', 'password', '', [Validators.required], ['passwordConfirm'] ),
        createCustomFormInputObject( 'passwordConfirm', 'password', '', [Validators.required, CustomValidators.passwordsMatch()] ),
      ],
      formHeader: 'Admin Edit',
      buttonsNames: {
        submitButtonName: 'Confirm Changes',
        resetButtonName: 'Clear Details',
        cancelButtonName: 'Cancel Edit'
      },
      styleClasses: ['default-theme']
    }

    this.loadBooks();

    this.availableBooks = [... this.books];

  }

  updateAccount(): void {
    this.userService.updateUser(this.currentAdmin!, this.updatedAdmin!);
    this.isInAdminEditMode = false;
  }

  logoutFromAccount(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  onSearch(){
    this.availableBooks = this.books;

    // // For search with no trailing spaces
    // let searchQuery = this.dbSearchQuery.trim().toLocaleLowerCase();

    // For search query with trailing spaces
    let searchQuery = this.dbSearchQuery.toLocaleLowerCase();

    if (searchQuery) {
      this.availableBooks = this.books.filter( book =>
        book.title.toLowerCase().includes(searchQuery) || 
        book.author.toLowerCase().includes(searchQuery)
      )
    }
  }


  toggleAdminEditForm(){
    this.isInAdminEditMode = ! this.isInAdminEditMode;
  }

  validateUserUniqueFields( formData:any ){
    this.uniqueValuesErrors = [];
    const mustBeUniqueFields = this.userService.getNamesOfUniqueFields();
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
      this.updatedAdmin = this.userService.createUserObjectFromFormData(formData);
      this.updateAdminAccount();
    }
  }

  updateAdminAccount(): void {
    this.userService.updateUser(this.currentAdmin!, this.updatedAdmin!);
    this.isInAdminEditMode = false;
  }

  // onSubmit() {
  //   if (this.editForm!.valid) {
  //     const formData = this.editForm!.value;
  //     console.log(formData);
  //     this.userService.addUser( 
  //       { username: formData.username, email: '', password: formData.password, cart: [] , isAdmin: false }
  //     )
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }

  loadBooks(): void {
    this.bookService.books$.subscribe((updatedBooks) => {
      this.books = updatedBooks;
    });
  }

  
  toggleBookAddForm(){
    if ( this.isInBookAddingMode ) {
      this.generalErrors = [];
    }
    else {
      this.bookEditFormBuildingInstructions = {
        inputs: [
          createCustomFormInputObject( 'title', 'text', '', [Validators.required] ),
          createCustomFormInputObject( 'author', 'text', '', [Validators.required] ),
          createCustomFormInputObject( 'details', 'text' ),
          createCustomFormInputObject( 'price', 'number', '', [Validators.required, CustomValidators.greaterThan('price', 0)] ),
          createCustomFormInputObject( 'discountPercentage', 'number', '', [CustomValidators.inRangeOf('discount', 0, 100, true)] ),
          createCustomFormInputObject( 'imageUrl', 'url', '', [] )
        ],
        formHeader: 'Add New Book',
        buttonsNames: {
          submitButtonName: 'Add Book To DB',
          resetButtonName: 'Clear Book Details',
          cancelButtonName: 'Cancel Book Addition'
        },
        styleClasses: ['default-theme']
      }
    }
    this.isInBookAddingMode = ! this.isInBookAddingMode;
  }

  toggleBookEditForm( bookForEdit: Book ){
    if ( this.isInBookEditMode ) {
      this.generalErrors = [];
    }
    else {
      this.bookEditFormBuildingInstructions = {
        inputs: [
          createCustomFormInputObject( 'title', 'text', bookForEdit.title, [Validators.required] ),
          createCustomFormInputObject( 'author', 'text', bookForEdit.author, [Validators.required] ),
          createCustomFormInputObject( 'details', 'text',bookForEdit.details ),
          createCustomFormInputObject( 'price', 'number', `${bookForEdit.price}`, [Validators.required, CustomValidators.greaterThan('price', 0)] ),
          createCustomFormInputObject( 'discountPercentage', 'number', `${bookForEdit.discountPercentage}`, [CustomValidators.inRangeOf('discount', 0, 100, true)] ),
          createCustomFormInputObject( 'imageUrl', 'url', bookForEdit.imageUrl )
        ],
        formHeader: 'Edit Book Details',
        buttonsNames: {
          submitButtonName: 'Confirm Changes',
          resetButtonName: 'Clear Details',
          cancelButtonName: 'Cancel Edit'
        },
        styleClasses: ['default-theme']
      }
      this.bookForEdit = bookForEdit;
    }
    this.isInBookEditMode = ! this.isInBookEditMode;
  }

  onAddNewBookSubmit( formData: any ) {
    const uniqueFieldsDuplicatedByForm = this.bookService.getUniqueFieldsDuplicatedByForm( formData );
    if ( uniqueFieldsDuplicatedByForm.length > 0 ) {
      this.uniqueValuesErrors = uniqueFieldsDuplicatedByForm;
    }
    else{
      const newBook: Book = this.bookService.createBookObjectFromFormData( formData );
      this.bookService.addNewBookToDb( newBook );
      this.isInBookAddingMode = false;
    } 
  }

  onBookEditSubmit( formData: any ) {
    this.generalErrors = [];
    const editedBook: Book = this.bookService.createBookObjectFromFormData( formData );
    // const uniqueFieldsDuplicatedByForm = this.bookService.getUniqueFieldsDuplicatedByForm( formData );
    if ( 
      !this.bookService.areTheSameBook( this.bookForEdit, editedBook ) && 
      this.bookService.doesBookExist( editedBook ) 
    ) {
      const editedBookAlreadyExistsError = `
        Book edits cant be applied .
        There's already another book with the same title and author . 
        Please select either another titke or another author for book edits .
      `;
      this.generalErrors.push(editedBookAlreadyExistsError);
    }
    else{
      const editedBook: Book = this.bookService.createBookObjectFromFormData( formData );
      editedBook.id = this.bookForEdit.id;
      this.bookService.updateBook( this.bookForEdit, editedBook );
      this.availableBooks = this.books;
      if (this.dbSearchQuery) {
        this.onSearch();
      }
      this.isInBookEditMode = false;
    } 
  }
  // validateBookUniqueFields( formData:any ){}


  deleteBook( bookId: number ): void {
    this.bookService.removeBook( bookId );
  }



}
