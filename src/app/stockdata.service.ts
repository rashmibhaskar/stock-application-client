import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockdataService {

  constructor() { }

  private ticker = '';
  private news!:any;
  private companydescription!:any;
  private stockprice!:any;
  private companypeers!:any;
  private summarycompanyhistory!:any;
  private chartcompanyhistory!:any;
  private recommendation!:any;
  private socialsentiment!:any;
  private earnings!:any;
  private ratelimit!:any;

  private tickerTracker = new BehaviorSubject<string>(this.ticker);
  private newsTracker = new BehaviorSubject<any>(this.news);
  private companydescriptionTracker = new BehaviorSubject<any>(this.companydescription);
  private stockpriceTracker = new BehaviorSubject<any>(this.stockprice);
  private companypeersTracker = new BehaviorSubject<any>(this.companypeers);
  private summarycompanyhistoryTracker = new BehaviorSubject<any>(this.summarycompanyhistory);
  private chartcompanyhistoryTracker = new BehaviorSubject<any>(this.chartcompanyhistory);
  private recommendationTracker = new BehaviorSubject<any>(this.recommendation);
  private socialsentimentTracker = new BehaviorSubject<any>(this.socialsentiment);
  private earningsTracker = new BehaviorSubject<any>(this.earnings);
  private ratelimitTracker = new BehaviorSubject<any>(this.ratelimit);

  /** Allows subscription to the behavior subject as an observable */
  getTicker(): Observable<string> {
    return this.tickerTracker.asObservable();
  }
  setTicker(data: string): void {
    this.tickerTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getNews(): Observable<any> {
    return this.newsTracker.asObservable();
  }
  setNews(data: any): void {
    this.newsTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getCompanydescription(): Observable<any> {
    return this.companydescriptionTracker.asObservable();
  }
  setCompanydescription(data: any): void {
    this.companydescriptionTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getStockprice(): Observable<any> {
    return this.stockpriceTracker.asObservable();
  }
  setStockprice(data: any): void {
    this.stockpriceTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getCompanypeers(): Observable<any> {
    return this.companypeersTracker.asObservable();
  }
  setCompanypeers(data: any): void {
    this.companypeersTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getSummarycompanyhistory(): Observable<any> {
    return this.summarycompanyhistoryTracker.asObservable();
  }
  setSummarycompanyhistory(data: any): void {
    this.summarycompanyhistoryTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getChartcompanyhistory(): Observable<any> {
    return this.chartcompanyhistoryTracker.asObservable();
  }
  setChartcompanyhistory(data: any): void {
    this.chartcompanyhistoryTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getRecommendation(): Observable<any> {
    return this.recommendationTracker.asObservable();
  }
  setRecommendation(data: any): void {
    this.recommendationTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getSocialsentiment(): Observable<any> {
    return this.socialsentimentTracker.asObservable();
  }
  setSocialsentiment(data: any): void {
    this.socialsentimentTracker.next(data);
  }

  /** Allows subscription to the behavior subject as an observable */
  getEarnings(): Observable<any> {
    return this.earningsTracker.asObservable();
  }
  setEarnings(data: any): void {
    this.earningsTracker.next(data);
  }

    /** Allows subscription to the behavior subject as an observable */
    getRatelimit(): Observable<any> {
      return this.ratelimitTracker.asObservable();
    }
    setRatelimit(data: any): void {
      this.ratelimitTracker.next(data);
    }


}