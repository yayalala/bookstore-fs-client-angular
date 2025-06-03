import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private cart: any[] = [];

  constructor() { }

  getCart(): any[] {
    return this.cart;
  }

  addToCart(book: any): void {
    this.cart.push(book);
  }

  removeFromCart(bookId: number): void {
    this.cart = this.cart.filter(book => book.id !== bookId);
  }

  clearCart(): void {
    this.cart = [];
  }
  
}
