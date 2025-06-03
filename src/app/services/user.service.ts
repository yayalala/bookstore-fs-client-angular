import { Injectable } from '@angular/core';
import { UserUtils, User, UserDbFieldName, UsersDb, LoggedUser } from '../models/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { BookService } from './book.service';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  // private users: UsersDb = {
  //   keyOnLocalStorage: 'users',
  //   dbData:
  //   [
  //     { email: 'admin@example.com', username: 'admin', password: 'a123', cart: [], isAdmin: true },
  //     { email: 'user1@example.com', username: 'user1', password: 'u111', cart: [] , isAdmin: false },
  //     { email: 'user2@example.com', username: 'user2', password: 'u222', cart: [] , isAdmin: false },
  //     { email: 'user3@example.com', username: 'user3', password: 'u333', cart: [] , isAdmin: false },
  //     { email: 'user4@example.com', username: 'user4', password: 'u444', cart: [] , isAdmin: false },
  //     { email: 'user5@example.com', username: 'user5', password: 'u555', cart: [] , isAdmin: false }
  //   ]
  // };

  private users: UsersDb = {
    keyOnLocalStorage: 'users',
    dbData:
    [
      { username: 'admin', email: 'admin@example.com', password: 'a123', cart: [], isAdmin: true }
    ],
    mustBeUniqueFields : ['email', 'username']
  };



  // private loggedUser: BehaviorSubject<User | null>;

  private loggedUser: LoggedUser = {
    keyOnSessionStorage: 'currentUser',
    userSubject: new BehaviorSubject<User | null>(null)
  };

  public currentUser$: Observable<User | null>;

  constructor( private bookService: BookService ) {
    this.loadUsersFromLocalStorage();
    this.loadCurrentUserFromSessionStorage();
    this.currentUser$ = this.loggedUser.userSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.loggedUser.userSubject.value;
  }

  signup( signupFormData: { [key: string]: any } ): void {
    const user = this.createUserObjectFromFormData( signupFormData );
    this.users.dbData.push(user);
    this.saveUsersToLocalStorage();
    this.loggedUser.userSubject.next(user);
  }

  createUserObjectFromFormData( formData: { [key: string]: any } ): User {
    let user: User = { 
      username: '', 
      email: '', 
      password: '', 
      cart: [],
      isAdmin: false 
    };
    Object.entries( formData ).forEach( ([fieldName, fieldValue]) => {
      const dbFieldName: UserDbFieldName | null = UserUtils.getDbFieldNameFromFormInputName( fieldName );
      switch (dbFieldName) {
        case 'username':
        case 'email':
        case 'password':
          user[ dbFieldName ] = fieldValue;
          break;
      }
    } );
    return user;
  }

  getUniqueFieldsDuplicatedByForm( formData: any ): string[] {
    const uniqueFieldsWithValueDuplications: string[] = [];
    Object.entries( formData ).forEach( ([fieldName, fieldValue]) => {
      if (
        UserUtils.isUserDbFieldName(fieldName) && 
        this.users.mustBeUniqueFields.includes(fieldName) &&
        this.doesFieldValueExist( fieldName , fieldValue )
      ) {
        uniqueFieldsWithValueDuplications.push(fieldName);
      }
    });
    return uniqueFieldsWithValueDuplications;
  }

  doesFieldValueExist (fieldName: string, fieldValue: any) {
    return UserUtils.isUserDbFieldName( fieldName ) &&
      this.users.dbData.find(user => user[fieldName as keyof User] === fieldValue) ;
  }

  getNamesOfUniqueFields(){
    return ['userEmail', 'userName'];
  }

  login(username: string, password: string): boolean {
    const user = this.users.dbData.find(u => u.username === username && u.password === password);
    if (user) {
      this.loggedUser.userSubject.next(user);
      this.updateBooksOnCurrentUserCart();
      this.saveCurrentUserToSessionStorage();
      return true;
    }
    return false;
  }

  updateBooksOnCurrentUserCart(){
    const currentUser = this.getCurrentUser();
    const updatedBooksDbData = this.bookService.getBooksDb();
    if ( currentUser ) {
      currentUser.cart = currentUser.cart.map(outdatedCartItem => {
        // Find the corresponding updated book in the updatedArray
        let updatedCartItem: CartItem = outdatedCartItem;
        const updatedBook = updatedBooksDbData.find( updatedBookOnDb => 
          updatedBookOnDb.title === outdatedCartItem.book.title && updatedBookOnDb.author === outdatedCartItem.book.author
        );
        if ( updatedBook ) {
          updatedCartItem = { quantity: outdatedCartItem.quantity , book: updatedBook }
        }
        // If an updated book is found, replace the outdated one
        return updatedCartItem;
      });
    }
  }

  logout(): void {
    this.loggedUser.userSubject.next(null);
    this.saveCurrentUserToSessionStorage();
  }

  isLoggedIn(): boolean {
    return this.loggedUser.userSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.loggedUser.userSubject.value;
    return user ? user.isAdmin : false;
  }

  // New method: updateUser
  updateUser(userToUpdate: User, updatedUser: User): void {
    const userIndex = this.users.dbData.findIndex(user => user.username === userToUpdate.username);
    if (userIndex > -1) {
      updatedUser.isAdmin = userToUpdate.isAdmin;
      this.users.dbData[userIndex] = updatedUser;
      this.saveUsersToLocalStorage();
      // Update the current user if it's the same user
      if (this.getCurrentUser()?.username !== updatedUser.username) {
        this.loggedUser.userSubject.next(updatedUser);
        this.saveCurrentUserToSessionStorage();
      }
    }
  }

  deleteUser(userName: string) {
    const userIndex = this.users.dbData.findIndex(user => user.username === userName);
    if (userIndex > -1) {
      this.users.dbData.splice(userIndex, 1);
      // Clear the current user if it's the same user
      if (this.getCurrentUser()?.username === userName) {
        this.loggedUser.userSubject.next(null);
        this.saveCurrentUserToSessionStorage();
      }
      this.saveUsersToLocalStorage();
    }
  }

  getAllUsers(): User[] {
    return this.users.dbData;
  }

  autoGenUserNameFromEmail(newUser: User): string {
    return newUser.email.split('@')[0];
  }

  findUserByUsername(username: string): User | undefined {
    return this.users.dbData.find(user => user.username === username);
  }

  findUserByUserEmail(userEmail: string): User | undefined {
    return this.users.dbData.find(user => user.email === userEmail);
  }

  getUserCart(username: string): CartItem[] {
    const user = this.users.dbData.find(user => user.username === username);
    return user ? user.cart : [];
  }

  modifyCartItemQuantityByAmount( idOfModifiedItem: number, amountToModifyBy: number = 1 ) {
    const currentUser = this.getCurrentUser();
    if ( currentUser ) {
      const bookItemInCart = currentUser.cart.find( cartItem => cartItem.book.id === idOfModifiedItem );
      if ( bookItemInCart ) {
        if ( -amountToModifyBy < bookItemInCart.quantity ) {
          bookItemInCart.quantity += amountToModifyBy;
        }
        else if ( -amountToModifyBy === bookItemInCart.quantity ) {
          this.removeBookFromCart( idOfModifiedItem );
        }
      }
      else {
        currentUser.cart.push( { book: this.bookService.getBookItemById(idOfModifiedItem)!, quantity: 1 } );
      }
      this.saveCurrentUserToSessionStorage();
      this.saveUsersToLocalStorage();
    }
  }

  getCartItemQuantityInCart( bookId: number ): number {
    const currentUser = this.getCurrentUser();
    if ( currentUser ) {
      const bookItemInCart = currentUser.cart.find( cartItem => cartItem.book.id === bookId );
      if ( bookItemInCart ) {
        return bookItemInCart.quantity ;
      }
    }
    return 0;
  }

  addToCurrentUserCart( bookId: number ){
    this.modifyCartItemQuantityByAmount( bookId , 1 );
  }

  doesBookExistInCart( bookIdToFind : number ): boolean {
    const currentUser = this.getCurrentUser();
    if ( currentUser && currentUser.cart.find( cartItem => cartItem.book.id !== bookIdToFind ) ) {
      return true
    }
    return false
  }

  removeBookFromCart(idOfRemovedBook: number): void {
    const currentUser = this.getCurrentUser();
    if ( currentUser ) {
      currentUser.cart = currentUser.cart.filter( cartItem => cartItem.book.id !== idOfRemovedBook );
    }
  }

  get currentUserCartTotal(){
    const currentUser = this.getCurrentUser();
    let cartTotal = 0;
    if ( currentUser ) {
      cartTotal = currentUser?.cart.reduce( (totalPrice,cartItem) => 
        totalPrice + cartItem.quantity * this.bookService.getBookDiscountedPrice(cartItem.book), 0 );
      cartTotal = parseFloat( cartTotal?.toFixed(2) );
    }
    return cartTotal;
  }

  clearCurrentUserCart(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.cart = [];
    }
    this.saveCurrentUserToSessionStorage();
    this.saveUsersToLocalStorage();
  }

  // Save users to localStorage
  private saveUsersToLocalStorage(): void {
    localStorage.setItem(this.users.keyOnLocalStorage, JSON.stringify(this.users.dbData));
  }

  // Load users from localStorage
  private loadUsersFromLocalStorage(): void {
    const localStorageUsersAsString = localStorage.getItem(this.users.keyOnLocalStorage);
    if ( localStorageUsersAsString ) {
      const localStorageUsersDb: User[] = JSON.parse( localStorageUsersAsString );
      const missingUsersOnStorage = this.users.dbData.filter( serviceDbUser => 
        !localStorageUsersDb.some( localDbUser => localDbUser.email === serviceDbUser.email ) 
      );
      this.users.dbData = missingUsersOnStorage.concat( localStorageUsersDb );
    }
  }

  // Save current logged user to session storage
  private saveCurrentUserToSessionStorage(): void {
    sessionStorage.setItem(this.loggedUser.keyOnSessionStorage, JSON.stringify(this.loggedUser.userSubject.value));
  }

  // Load current logged user from session storage
  private loadCurrentUserFromSessionStorage(): void {
    const sessionStorageCurrentUserAsString = sessionStorage.getItem(this.loggedUser.keyOnSessionStorage);
    if ( sessionStorageCurrentUserAsString ) {
      this.loggedUser.userSubject.next( JSON.parse( sessionStorageCurrentUserAsString ) );
    }
  }

}
