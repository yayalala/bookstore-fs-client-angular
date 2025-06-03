// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { HomeComponent } from './components/home/home.component';
// import { SearchComponent } from './components/search/search.component';
// import { BookDetailsComponent } from './components/book-details/book-details.component';
// import { CartComponent } from './components/cart/cart.component';
// import { AccountComponent } from './components/account/account.component';
// import { LoginComponent } from './components/admin/login/login.component';
// import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
// import { NotFoundComponent } from './components/not-found/not-found.component';
// import { FormsModule } from '@angular/forms';

// @NgModule({
//   declarations: [
//     AppComponent,
//     HomeComponent,
//     SearchComponent,
//     BookDetailsComponent,
//     CartComponent,
//     AccountComponent,
//     LoginComponent,
//     DashboardComponent,
//     NotFoundComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     FormsModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartComponent } from './components/cart/cart.component';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent as AdminLoginComponent } from './components/admin/login/login.component';
import { LoginComponent } from './components/login/login.component';

import { UserService } from './services/user.service';
import { CartService } from './services/cart.service';
import { BookService } from './services/book.service';
import { AuthGuard } from './guards/auth.guard';
import { BookComponent } from './components/book/book.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent as AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';
import { CustomFormComponent } from './components/custom-form/custom-form.component';

@NgModule({

  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    BookDetailsComponent,
    CartComponent,
    AccountComponent,
    AdminDashboardComponent,
    AdminLoginComponent,
    LoginComponent,
    BookComponent,
    SignupComponent,
    CustomFormComponent
  ],

  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],

  providers: [UserService, CartService, BookService, AuthGuard],

  bootstrap: [AppComponent]

})
export class AppModule { }
