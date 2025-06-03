import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BookService } from '../../services/book.service';
import { CartItem } from '../../models/cart-item';
import { User } from '../../models/user';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

  currentUser: User | null | undefined ;
  checkoutClicked: boolean = false;
  checkoutConfirmed: boolean = false;
  checkoutMessage: string = `
    We'll do our best to provide your delivery in 1 week, 
    but it could also take thousand years, 
    miliion phone calls, 
    n billion emails 
  `;

  constructor(private userService: UserService, private bookService: BookService) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  increaseQuantityByOne( bookId : number ){
    this.userService.modifyCartItemQuantityByAmount( bookId , 1 );
  }

  decreaseQuantityByOne( bookId : number ){
    this.userService.modifyCartItemQuantityByAmount( bookId , -1 );
  }

  removeFromCart(bookId: number): void {
    this.userService.removeBookFromCart(bookId);
  }

  clearCart(): void {
    this.userService.clearCurrentUserCart();
  }

  getCartItemDiscountedPrice( cartItem: CartItem ){
    return this.bookService.getBookDiscountedPrice( cartItem.book );
  }

  get cartTotal(){
    return this.userService.currentUserCartTotal;
  }

  checkout(): void {
    this.checkoutClicked = true;
    this.checkoutMessage = `
    Are you sure you're done and want to checkout ?
  `;
  }

  cancelCheckout(): void {
    this.checkoutClicked = false;
  }

  confirmCheckout(): void {
    this.checkoutConfirmed = true;
    this.checkoutMessage = `
      We'll do our best to provide your delivery in 1 week, 
      but it could also take thousand years, 
      miliion phone calls, 
      n billion emails 
    `;
  }

  acceptCheckoutMessage(){
    this.checkoutClicked = false;
    this.checkoutConfirmed = false;
    this.clearCart();
  }
  
}
