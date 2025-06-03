import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Book, BookDbFieldName, BooksDb, BookUtils } from '../models/book';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  public bookDetailsPlaceHolder: string = `
    Book details should go here, such as 'Best book ever written !!! Lorem ipsum bla bla bla !!!
    In this book you'll learn to write perfect code in your favorite programing language like never before !!!
    ( some more BS that meant to sell your book and help potential readers to understand what to expect from your book )'...
    `;

  // Array to initialize with some books
  private demoBooksDbData: Book[] = [
    { id: 1, title: 'Basic C#', author: 'C# master', details: this.bookDetailsPlaceHolder, price: 9.99, discountPercentage: 0, imageUrl: 'assets/images/Csharp_book.jfif' },
    { id: 2, title: 'Basic Web Dev with HTML', author: 'Web master', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/HTML_book.jfif' },
    { id: 3, title: 'Basic Web Dev with CSS', author: 'Web master', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/CSS_book.jfif' },
    { id: 4, title: 'Basic Web Dev with JS', author: 'Web master', details: this.bookDetailsPlaceHolder, price: 9.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 5, title: 'From JS to TS', author: 'Web wizard', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 6, title: 'Advanced frontend with HTML', author: 'Web wizard', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 7, title: 'Advanced frontend with CSS', author: 'Web wizard', details: this.bookDetailsPlaceHolder, price: 9.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 8, title: 'Advanced frontend with JS', author: 'Web wizard', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 9, title: 'Advanced frontend with TS', author: 'Web wizard', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 10, title: 'The Angular framework', author: 'Front Wizard', details: this.bookDetailsPlaceHolder, price: 9.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 11, title: 'Front end with Angular', author: 'Front Wizard', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 12, title: 'Advanced Angular', author: 'Front Wizard', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 13, title: 'Advanced C#', author: 'C# master', details: this.bookDetailsPlaceHolder, price: 9.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 14, title: 'The Dotnet framework', author: 'Backend Wizard', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 15, title: 'Backend with dotnet', author: 'Backend Wizard', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 16, title: 'The React framework', author: 'Front Wizard', details: this.bookDetailsPlaceHolder, price: 9.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 17, title: 'Frontend with React', author: 'Front Wizard', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 18, title: 'Backend with Node JS', author: 'Backend Wizard', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 19, title: 'Basic C', author: 'Low leveler', details: this.bookDetailsPlaceHolder, price: 9.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 20, title: 'Advanced C', author: 'Low leveler', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 21, title: 'Basic C++', author: 'Low leveler', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 22, title: 'Advanced C++', author: 'Low leveler', details: this.bookDetailsPlaceHolder, price: 9.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 23, title: 'Java', author: 'Mobile master', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 24, title: 'Java for Android', author: 'Mobile master', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 25, title: 'Kotlin', author: 'Mobile master', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 26, title: 'Kotlin for Android', author: 'Mobile master', details: this.bookDetailsPlaceHolder, price: 19.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 27, title: 'Swift', author: 'Mobile master', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' },
    { id: 28, title: 'Swift for iOS', author: 'Mobile master', details: this.bookDetailsPlaceHolder, price: 14.99, discountPercentage: 0, imageUrl: 'assets/images/icon-book-closed.png' }
    
  ];

  private booksDb: BooksDb = {
    keyOnLocalStorage: 'books',
    dbData:
    new BehaviorSubject<Book[]>(this.demoBooksDbData),
    mustBeUniqueFields : ['title']
  };

  // Initialize BehaviorSubject with the initialBooks array
  books$ = this.booksDb.dbData.asObservable();

  constructor() { 
    this.loadBooksFromLocalStorage();
  }

  getBooksDb(): Book[] {
    return this.booksDb.dbData.getValue();
  }

  setBooksDb(books: Book[]) {
    this.booksDb.dbData.next(books); // Emit new book list
    this.saveBooksToLocalStorage();
  }

    // Save books to localStorage
    private saveBooksToLocalStorage(): void {
      localStorage.setItem(this.booksDb.keyOnLocalStorage, JSON.stringify(this.getBooksDb()));
    }
  
    // Load books from localStorage
    private loadBooksFromLocalStorage(): void {
      const localStorageBooksAsString = localStorage.getItem(this.booksDb.keyOnLocalStorage);
      if ( localStorageBooksAsString ) {
        const localStorageBooksDbData: Book[] = JSON.parse( localStorageBooksAsString );

        // // --- appending complementary local storage data to demo data ---
        // const missingBooksFromLocalStorage = localStorageBooksDbData.filter( localStorageBook => 
        //   !this.doesBookExistsOnBooksDb( localStorageBook , this.demoBooksDbData )
        // );
        // this.booksDb.dbData.next( this.demoBooksDbData.concat( missingBooksFromLocalStorage ) );

        // --- update demo data based on local storage data
        const updatedDemoData = this.updateOutdatedBooks( this.demoBooksDbData , localStorageBooksDbData );

        // --- appending complementary local storage data to updated demo data ---
        const missingBooksFromLocalStorage = localStorageBooksDbData.filter( localStorageBook => 
          !this.doesBookExistsOnBooksDb( localStorageBook , this.demoBooksDbData )
        );

        this.booksDb.dbData.next( updatedDemoData.concat( missingBooksFromLocalStorage ) );
        // this.booksDb.dbData.next( this.demoBooksDbData );
      }
    }
  
    updateOutdatedBooks(outdatedArray: Book[], updatedArray: Book[]): Book[] {
      return outdatedArray.map(outdatedBook => {
        // Find the corresponding updated book in the updatedArray
        const updatedBook = updatedArray.find(updated => 
          updated.title === outdatedBook.title && updated.author === outdatedBook.author
        );
        // If an updated book is found, replace the outdated one
        return updatedBook ? updatedBook : outdatedBook;
      });
    }

  getBookItemById(id: number): Book | undefined {
    const book = this.getBooksDb().find(b => b.id === id);
    return book;
  }

  getBookById(bookId: number): Observable<Book | undefined> {
    return this.books$.pipe(
      map(books => books.find(book => book.id === bookId)) // Find the specific book
    );
  }

  getBookByTitleAndAuthor( title: string, author: string ): Book | undefined {
    const bookInDb = this.getBooksDb().find( book => book.title === title && book.author === author );
    return bookInDb;
  }

  areTheSameBook( book1: Book, book2: Book ){
    return book1.title === book2.title && book1.author === book2.author
  }

  doesBookExistsOnBooksDb( givenBook: Book, booksDbData: Book[] = this.getBooksDb() ): boolean {
    return booksDbData.some( dbDataBook => this.areTheSameBook( dbDataBook , givenBook ) );
  }

  searchBooks(query: string): Observable<Book[]> {
    const lowerQuery = query.toLowerCase();
    const filteredBooks = this.getBooksDb().filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery)
    );
    return of(filteredBooks);
  }

  getBookDiscountedPrice( book: Book ): number {
    const discountedPrice = book.price * ( 1 - book.discountPercentage/100 );
    return parseFloat( discountedPrice.toFixed(2) )
  }
  
  addNewBookToDb(newBook: Book): void {
    const currentBooks = this.getBooksDb();
    newBook.id = currentBooks.length + 1;
    const updatedBooks = [...currentBooks, newBook];
    this.setBooksDb(updatedBooks); // Emit the updated book list
  }

  updateBook(bookToUpdate: Book, updatedBook: Book): void {
    const currentBooks = this.getBooksDb();
    // const index = currentBooks.findIndex( bookToUpdate.title, bookToUpdate.author );
    if (bookToUpdate.id > 0 && bookToUpdate.id <= currentBooks.length ) {
      // console.log( 'original book ');
      // console.log( bookToUpdate );
      // console.log( 'edited book ');
      // console.log( updatedBook );
      // console.log( 'total books in store : ');
      console.log(currentBooks.length);
      updatedBook.id = bookToUpdate.id;
      const indexForUpdate = this.getBooksDb().findIndex(book => book.id === bookToUpdate.id);
      currentBooks[indexForUpdate] = updatedBook;
      this.setBooksDb([...currentBooks]); // Emit the updated book list
    }
  }

  removeBook(bookId: number) {
    const currentBooks = this.getBooksDb();
    const updatedBooks = currentBooks.filter((book) => book.id !== bookId);
    this.setBooksDb(updatedBooks); // Emit the updated book list
  }

  createBookObjectFromFormData( formData: { [key: string]: any } ): Book {
    let book: Book = BookUtils.genDefaultBookObj();
    Object.entries( formData ).forEach( ([fieldName, fieldValue]) => {
      const dbFieldName: BookDbFieldName | null = BookUtils.getDbFieldNameFromFormInputName( fieldName );
      switch (dbFieldName) {
        case 'title':
        case 'author':
        case 'details':
          book[ dbFieldName ] = fieldValue;
          break;
        case 'imageUrl':
          book[ dbFieldName ] = fieldValue === '' ? 'assets/images/icon-book-closed.png' : fieldValue ;
          break;
        case 'price':
        case 'discountPercentage':
          book[ dbFieldName ] = fieldValue;
          break;
      }
    } );
    return book;
  }

  getUniqueFieldsDuplicatedByForm( formData: any ): string[] {
    const uniqueFieldsWithValueDuplications: string[] = [];
    Object.entries( formData ).forEach( ([fieldName, fieldValue]) => {
      if (
        BookUtils.isBookDbFieldName(fieldName) && 
        this.booksDb.mustBeUniqueFields.includes(fieldName) &&
        this.doesFieldValueExist( fieldName , fieldValue )
      ) {
        uniqueFieldsWithValueDuplications.push(fieldName);
      }
    });
    return uniqueFieldsWithValueDuplications;
  }

  doesFieldValueExist (fieldName: string, fieldValue: any) {
    return BookUtils.isBookDbFieldName( fieldName ) &&
      this.booksDb.dbData.getValue().find(book => book[fieldName as keyof Book] === fieldValue) ;
  }

  doesBookExist( book: Book ) {
    return this.doesBookExistsOnBooksDb( book , this.getBooksDb() );
  }

}
