import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { UserService } from '../../services/user.service';
import { Book } from '../../models/book';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  books: Book[] = [];
  searchQuery: string = '';
  currentUser: User | null | undefined = null;
  currentPage: number = 1;
  pageSize: number = 6;

  constructor(private bookService: BookService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadBooks();
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadBooks(): void {
    this.bookService.books$.subscribe((updatedBooks) => {
      this.books = updatedBooks;
    });
  }

  searchBooks(): void {
    if (this.searchQuery) {
      this.bookService.searchBooks(this.searchQuery).subscribe((data: any) => {
        this.books = data;
      });
    } else {
      this.loadBooks();
    }
  }

  addToCart( bookId: number ) {
    this.userService.addToCurrentUserCart( bookId );
  }

  decreaseQuantityInCart( bookId: number ){
    this.userService.modifyCartItemQuantityByAmount( bookId, -1 );
  }

  removeFromCart( bookId: number ){
    this.userService.removeBookFromCart( bookId );
  }

  getItemQuantityInCart( bookId: number ){
    return this.userService.getCartItemQuantityInCart( bookId );
  }

  doesBookExistInCart( bookId: number ){
    const bookQuanityInCart = this.getItemQuantityInCart( bookId );
    return bookQuanityInCart > 0;
  }

  get currentPageBooks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.books.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page > 0 && page <= this.totalPages ) {
      this.currentPage = page;
    }
  }

  get totalPages() {
    let totalPages = Math.ceil(this.books.length / this.pageSize) ;
    if ( totalPages === 0 ) {
      totalPages = 1;
    }
    return totalPages ;
  }

}
