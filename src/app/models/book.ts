import { BehaviorSubject } from "rxjs";
import { StringUtils } from "../core/utils/string-utils";

export type BookCardView =
| 'portrait'
| 'landscape'
| 'dbTableRow';

export interface Book { 
    id: number,
    title: string, 
    author: string, 
    details: string, 
    price: number,
    discountPercentage: number,
    imageUrl: string
}

export interface BooksDb {
    keyOnLocalStorage: string;
    dbData: BehaviorSubject<Book[]>;
    mustBeUniqueFields: string[];
}

export type BookDbFieldName = keyof Book;

export class BookUtils {

    static genDefaultBookObj():Book{
        return {id: 0, title: '', author: '', details: '', price: 0, discountPercentage: 0, imageUrl: '' };
    }

    static isBookDbFieldName( fieldName: string ): fieldName is BookDbFieldName {
        return ( fieldName in this.genDefaultBookObj() );
    }

    static getFormInputNameFromDbFieldName( dbFieldName: BookDbFieldName ): string { 
        return StringUtils.camelize( 'book ' + dbFieldName );
    }

    static getDbFieldNameFromFormInputName( formFieldName: string ): BookDbFieldName | null { 

        let dbFieldName: string = formFieldName.replace('book ','');
        dbFieldName = dbFieldName[0].toLowerCase() + dbFieldName.slice(1);
        if ( this.isBookDbFieldName(dbFieldName) ) {
            return dbFieldName as BookDbFieldName;
        }
        else
            return null;
    }

    

}
