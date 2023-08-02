
import { Host, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  baseURL="https://stock-frontend-1609.wl.r.appspot.com"
  constructor(private http: HttpClient) {}


  fetchSearchutil(ticker:any){
    return this.http.get(`${this.baseURL}/autocomplete/${ticker}`).pipe(
      catchError(this.handleError('fetch', [])) // then handle the error
    );
  }

  fetchCompanyDescription(ticker:any){
    return this.http.get(`${this.baseURL}/company-description/${ticker}`).pipe(
        catchError(this.handleError('fetch', [])) // then handle the error
      );
  }

  fetchCompanyStockPrice(ticker:any){
    return this.http.get(`${this.baseURL}/company-stock-price/${ticker}`).pipe(
        catchError(this.handleError('fetch', [])) // then handle the error
      );
  }
  
  fetchCompanyPeers(ticker:any){
    return this.http.get(`${this.baseURL}/company-peers/${ticker}`).pipe(
        catchError(this.handleError('fetch', [])) // then handle the error
      );
  }

  fetchCompanyNews(ticker:any){
    return this.http.get(`${this.baseURL}/company-news/${ticker}`).pipe(
        catchError(this.handleError('fetch', [])) // then handle the error
      );
  }

  fetchSocialSentiment(ticker:any){
    return this.http.get(`${this.baseURL}/company-social-sentiment/${ticker}`).pipe(
        catchError(this.handleError('fetch', [])) // then handle the error
      );
  }

  fetchRecommendationTrends(ticker:any){
    return this.http.get(`${this.baseURL}/company-recommendation/${ticker}`).pipe(
        catchError(this.handleError('fetch', [])) // then handle the error
      );
  }

  fetchEarnings(ticker:any){
    return this.http.get(`${this.baseURL}/company-earnings/${ticker}`).pipe(
        catchError(this.handleError('fetchSearchutil', [])) // then handle the error
      );
  }

  fetchCompanyHistory(ticker:any,resolution:any,from:any,to:any,ctype:any){
    return this.http.get(`${this.baseURL}/company-history/${ticker}/${resolution}/${from}/${to}/${ctype}`).pipe(
        catchError(this.handleError('fetchSearchutil', [])) // then handle the error
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
