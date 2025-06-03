import { Component, Input } from '@angular/core';
import { Book, BookCardView } from '../../models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  @Input() book!: Book;
  @Input() bookCardView!: BookCardView;
  @Input() isDetailsPage: boolean = false;

  constructor( private bookService: BookService){
  }

  get bookDiscountedPrice(){
    return this.bookService.getBookDiscountedPrice( this.book );
  }

  get isBookOnDiscount(){
    return this.book.discountPercentage > 0;
  }

}
