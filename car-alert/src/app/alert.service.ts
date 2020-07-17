import { Injectable } from '@angular/core';
import { Alert } from './alert.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) { }

  create(alert: Alert): Observable<Alert> {
    return this.http.post<Alert>('/api/alert', alert)
    .pipe(
      catchError(this.handleError)
    );
  }

  findAll(): Observable<Alert[]> {
    return this.http.get<Alert[]>('/api/alerts')
    .pipe(
      catchError(this.handleError)
    );
  }

  findById(id: string): Observable<Alert> {
    return this.http.get<Alert>('/api/alert/' + id).pipe(
      catchError(this.handleError)
    );
  }

  update(user: Alert, id: string) {
    return this.http.put<Alert>('/api/alert/' + id, user, {observe: 'response'})
    .pipe(
      catchError(this.handleError)
    );
  }

  remove(id: string) {
    return this.http.delete<Alert>('/api/alert/' + id).pipe(
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
