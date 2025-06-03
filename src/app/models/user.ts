import { BehaviorSubject, Observable } from "rxjs";
import { StringUtils } from "../core/utils/string-utils";
import { CartItem } from "./cart-item";

export interface User {
    username: string;
    email: string;
    password: string;
    cart: CartItem[];
    isAdmin: boolean;
}

export interface UsersDb {
    keyOnLocalStorage: string;
    dbData: User[];
    mustBeUniqueFields: string[];
}

export type UserDbFieldName =
| 'username'
| 'email'
| 'password'
| 'cart'
| 'isAdmin';

export interface LoggedUser {
    keyOnSessionStorage: string;
    userSubject: BehaviorSubject<User | null>;
    // setUserSubjectValue( userSubjectValue:User | null ): void;
    // getUserSubject(): BehaviorSubject<User | null>;
    // getUserAsObservable(): Observable<User | null>;
}

export class UserUtils {

    static isUserDbFieldName( fieldName: string ): boolean {
        return [
            'username', 
            'email', 
            'password', 
            'cart', 
            'isAdmin'
        ].includes(fieldName);
    }

    static getFormInputNameFromDbFieldName( dbFieldName: UserDbFieldName ): string { 
        if ( dbFieldName === 'username' ) {
            return dbFieldName;
        }
        return StringUtils.camelize( 'user ' + dbFieldName );
    }

    static getDbFieldNameFromFormInputName( formFieldName: string ): UserDbFieldName | null { 

        if ( formFieldName === 'username' ) {
            return formFieldName;
        }
        let dbFieldName: string = formFieldName.replace('user','');
        dbFieldName = dbFieldName[0].toLowerCase() + dbFieldName.slice(1);
        if ( this.isUserDbFieldName(dbFieldName) ) {
            return dbFieldName as UserDbFieldName;
        }
        else
            return null;
    }

    

}