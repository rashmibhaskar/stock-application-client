import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, Event, ActivatedRoute, ParamMap, Params, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ApiService } from '../../api.service';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StockdataService } from '../../stockdata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  tickerval: any;
  companydesc: any;
  stockprice: any;
  isStarSelected = false;
  isLoading = false;
  isError = false;
  invalidTicker = false;
  today = new Date();
  marketStatus: any;
  s_time: any;
  showSell = false;
  walletmoney = JSON.parse(localStorage.getItem('walletmoney') || '[]');
  quantity: number = 0;
  quantitySell!: number;
  count = 0;
  portfolioQuantity = 0;

  subscription!: Subscription;
  inStateTiicker: any;

  private _success = new Subject<string>();
  private _tickersuccess = new Subject<string>();
  private _failure = new Subject<string>();
  private _watchlist = new Subject<string>();
  private _removewatchlist = new Subject<string>();
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert!: NgbAlert;
  @ViewChild('tickerselfClosingAlert', { static: false }) tickerselfClosingAlert!: NgbAlert;
  @ViewChild('closingAlert', { static: false }) closingAlert!: NgbAlert;
  @ViewChild('watchlistAlert', { static: false }) watchlistAlert!: NgbAlert;
  @ViewChild('removewatchlistAlert', { static: false }) removewatchlistAlert!: NgbAlert;

  successMessage = '';
  tickersuccessMessage = '';
  failureMessage = '';
  watchlistMessage = '';
  removewatchlistMessage = '';
  myDate: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ApiService: ApiService,
    private stockdata: StockdataService
  ) {
  }

  onSell(ticker: any, name: any, quant: any, total: any) {
    this.walletmoney = this.walletmoney + total
    localStorage.setItem('walletmoney', this.walletmoney)
    var portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    var newData = {}
    if (portfolio) {
      for (var i = 0; i < portfolio.length; i++) {
        if (portfolio[i].ticker == ticker) {
          newData = {
            "ticker": ticker,
            "name": name,
            "quantity": portfolio[i].quantity - quant,
            "total": portfolio[i].total - total
          }
          this.quantitySell = portfolio[i].quantity - quant;
          this.portfolioQuantity = this.quantitySell;
          var newportfolio = portfolio.filter((ele: any) => ele.ticker !== ticker)
          if (this.quantitySell > 0) {
            newportfolio.push(newData)
            localStorage.setItem('portfolio', JSON.stringify(newportfolio))
            this._failure.next(ticker + " sold successfully");
          }
          else {
            this.showSell = false
            localStorage.setItem('portfolio', JSON.stringify(newportfolio))
            this._failure.next(ticker + " sold successfully");
          }
          break;
        }
      }
    }
  }

  onBuy(ticker: any, name: any, quantity: any, total: any) {
    this.showSell = true
    this.walletmoney = this.walletmoney - total
    localStorage.setItem('walletmoney', this.walletmoney)
    var portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    var newData = {}
    var flag = 0
    if (portfolio) {
      for (var i = 0; i < portfolio.length; i++) {
        if (portfolio[i].ticker == ticker) {
          newData = {
            "ticker": ticker,
            "name": name,
            "quantity": portfolio[i].quantity + quantity,
            "total": portfolio[i].total + total
          }
          flag = 1
          this.portfolioQuantity = portfolio[i].quantity + quantity;
        }
      }
      if (flag == 1) {
        var newportfolio = portfolio.filter((ele: any) => ele.ticker !== ticker)
        newportfolio.push(newData)
        localStorage.setItem('portfolio', JSON.stringify(newportfolio))
        this._success.next(ticker + " bought successfully");
      }
      else {
        var newstock = {
          "ticker": ticker,
          "name": name,
          "quantity": quantity,
          "total": total
        }
        portfolio.push(newstock)
        localStorage.setItem('portfolio', JSON.stringify(portfolio))
        this._success.next(ticker + " bought successfully");
        this.portfolioQuantity = quantity;
      }
    }
    else {
      var portfolioData = {
        "ticker": ticker,
        "name": name,
        "quantity": quantity,
        "total": total
      }
      localStorage.setItem('portfolio', JSON.stringify([portfolioData]))
      this._success.next(ticker + " bought successfully");
      this.portfolioQuantity = quantity;
    }
  }

  checkWatchlist() {
    this.isStarSelected = !this.isStarSelected;
    var filterData = [];
    if (this.isStarSelected) {
      var data = [this.companydesc.ticker, this.companydesc.name, this.stockprice.c, this.stockprice.d, this.stockprice.dp];
      var watchlistData = JSON.parse(localStorage.getItem('watchlist') || '[]');
      watchlistData.push(data);
      localStorage.setItem('watchlist', JSON.stringify(watchlistData));
      this._watchlist.next(this.companydesc.ticker + " added to Watchlist");
    }
    else {
      var watchlistData = JSON.parse(localStorage.getItem('watchlist') || '[]');
      var updatedwatchlistData = watchlistData.filter((ele: any) =>
        ele[0] !== this.companydesc.ticker)
      localStorage.setItem('watchlist', JSON.stringify(updatedwatchlistData));
      this._removewatchlist.next(this.companydesc.ticker + " removed from Watchlist");
    }
  }

  callCompanyDescription() {
    this.subscription = this.stockdata.getCompanydescription().subscribe(
      res => {
        if (res) {
          this.inStateTiicker = res.ticker;
          this.companydesc = res.data;
        }
      });
    if (this.inStateTiicker === this.tickerval) {
      this.isLoading = false
    }
    else {
      this.isLoading = true
      this.ApiService.fetchCompanyDescription(this.tickerval)
        .subscribe((data: any) => {
          if (data && data.status == '429') {
            this.isError = true
            this.isLoading = false
            this.invalidTicker = false
            this.stockdata.setRatelimit(true);
          }
          else if (Object.keys(data).length === 0 || JSON.stringify(data) === '{}') {
            this.isLoading = false
            this.isError = false
            this.invalidTicker = true
            this._tickersuccess.next("Please enter a valid ticker.");
          }
          else {
            this.companydesc = data
            this.isLoading = false
            this.isError = false
            this.invalidTicker = false
            this.stockdata.setRatelimit(false);
            var newData = {
              ticker: this.tickerval,
              data: this.companydesc
            }
            this.stockdata.setCompanydescription(newData)
          }
        });
    }
  }

  callStockPrice() {
    this.subscription = this.stockdata.getStockprice().subscribe(
      res => {
        if (res) {
          this.inStateTiicker = res.ticker;
          this.stockprice = res.data;
        }
      });
    if (this.inStateTiicker === this.tickerval) {
    }
    else {
      this.ApiService.fetchCompanyStockPrice(this.tickerval)
        .subscribe((data: any) => {
          this.stockprice = data;
          this.s_time = new Date(this.stockprice.t * 1000);
          var dif = (this.today.getTime() - this.s_time.getTime()) / 1000
          dif /= 60
          if (dif < 5) {
            this.marketStatus = true;
          }
          else {
            this.marketStatus = false;
          }
          var newData = {
            ticker: this.tickerval,
            data: this.stockprice
          }
          this.stockdata.setStockprice(newData)
        });
    }
  }

  makeCalls() {
    var portfolioVal = JSON.parse(localStorage.getItem('portfolio') || '[]');
    this.showSell = false
    if (portfolioVal) {
      portfolioVal.map((ele: any) => {
        if (ele.ticker === this.tickerval && ele.quantity >= 1) {
          this.showSell = true;
          this.portfolioQuantity = ele.quantity;
        }
      }
      )
    }
    this.callCompanyDescription()
    this.callStockPrice()

    let currentWatchList = localStorage.getItem('watchlist');
    if (!currentWatchList) {
      this.isStarSelected = false;
    }
    else {
      let data = JSON.parse(localStorage.getItem('watchlist') || '[]');
      this.isStarSelected = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i][0].toLowerCase() == this.tickerval.toLowerCase()) {
          this.isStarSelected = true;
          break;
        }
      }
    }

  }

  getUpdatedData() {
    if (this.marketStatus) {
      this.ApiService.fetchCompanyStockPrice(this.tickerval)
        .subscribe((data: any) => {
          this.stockprice = data;
          this.s_time = new Date(this.stockprice.t * 1000);
          var dif = (this.today.getTime() - this.s_time.getTime()) / 1000
          dif /= 60
          if (dif < 5) {
            this.marketStatus = true;
          }
          else {
            this.marketStatus = false;
          }
          var newData = {
            ticker: this.tickerval,
            data: this.stockprice
          }
          this.stockdata.setStockprice(newData)
        });
    }

  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.tickerval = params['ticker']
        this.makeCalls()
      }
    )


    setInterval(() => {
      this.count++
      this.getUpdatedData()
    }, 15000);

    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    this._tickersuccess.subscribe(message => this.tickersuccessMessage = message);
    this._tickersuccess.pipe(debounceTime(5000)).subscribe(() => {
      if (this.tickerselfClosingAlert) {
        this.tickerselfClosingAlert.close();
      }
    });

    this._failure.subscribe(message => this.failureMessage = message);
    this._failure.pipe(debounceTime(5000)).subscribe(() => {
      if (this.closingAlert) {
        this.closingAlert.close();
      }
    });

    this._watchlist.subscribe(message => this.watchlistMessage = message);
    this._watchlist.pipe(debounceTime(5000)).subscribe(() => {
      if (this.watchlistAlert) {
        this.watchlistAlert.close();
      }
    });

    this._removewatchlist.subscribe(message => this.removewatchlistMessage = message);
    this._removewatchlist.pipe(debounceTime(5000)).subscribe(() => {
      if (this.removewatchlistAlert) {
        this.removewatchlistAlert.close();
      }
    });
  }
}
