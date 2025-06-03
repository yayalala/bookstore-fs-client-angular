// src/app/routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
// import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
//   { path: 'books', component: BookListComponent },
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'cart', component: CartComponent }
];
