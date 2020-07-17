import { Injectable } from '@angular/core';
import { User } from './User';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, shareReplay, tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  create(user: User): Observable<User> {
    return this.http.post<User>('/api/register', user)
    .pipe(
      catchError(this.handleError)
    );
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users')
    .pipe(
      catchError(this.handleError)
    );
  }

  findById(id: string): Observable<User> {
    return this.http.get<User>('/api/user/' + id).pipe(
      catchError(this.handleError)
    );
  }

  update(user: User, id: string) {
    return this.http.put<User>('/api/user/' + id, user, {observe: 'response'})
    .pipe(
      catchError(this.handleError)
    );
  }

  remove(id: string) {
    return this.http.delete<User>('/api/user/' + id).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error.message}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    error.error.message);
  }
}
