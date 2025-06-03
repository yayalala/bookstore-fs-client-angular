import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  searchQuery: string = '';
  books: Book[] = [];
  currentPage: number = 1;
  pageSize: number = 2;
  currentUser: User | null | undefined = null;

  constructor(private route: ActivatedRoute, private bookService: BookService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.performSearch();
    });
  }

  performSearch(): void {
    if (this.searchQuery === "") {
      this.books = this.bookService.getBooksDb();
    }
    if (this.searchQuery.trim() !== '') {
      this.bookService.searchBooks(this.searchQuery.trim()).subscribe((results: any[]) => {
        this.books = results;
      });
    }
    this.currentPage = 1;
  }

  get currentPageBooks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.books.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  get totalPages() {
    let totalPages = Math.ceil(this.books.length / this.pageSize) ;
    if ( totalPages === 0 ) {
      totalPages = 1;
    }
    return totalPages ;
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

}
