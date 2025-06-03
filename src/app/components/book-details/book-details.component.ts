import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book | null | undefined = null;;
  currentUser: User | null | undefined = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBookById(bookId).subscribe(book => {
      this.book = book;
    });
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
