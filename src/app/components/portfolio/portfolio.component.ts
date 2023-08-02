import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { forkJoin } from "rxjs";
import { PortfolioInfo } from './portfolioInfo';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StockdataService } from '../../stockdata.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  portfolio: any;
  showAlert: any;
  stockprice: any;
  finaldata: any;
  quantity: number = 0;
  walletmoney = JSON.parse(localStorage.getItem('walletmoney') || '[]');
  buyAlert: any;
  sellAlert: any;
  modeldata!: any;
  ApiError = false;
  subscription!: Subscription;
  isError = false;

  private _success = new Subject<string>();
  private _failure = new Subject<string>();
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert!: NgbAlert;
  @ViewChild('closingAlert', { static: false }) closingAlert!: NgbAlert;

  successMessage = '';
  failureMessage = ''
  inStateTiicker: any;
  constructor(
    private ApiService: ApiService,
    private modalService: NgbModal,
    private stockdata: StockdataService,
    private router: Router,
  ) { }

  openModal(content: any, data: any) {
    this.modeldata = data
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  gotodetailspage(ticker: any) {
    this.router.navigateByUrl('/search/' + ticker.toUpperCase())
  }

  onBuy(ticker: any, name: any, quant: any, total: any) {
    this.quantity = 0
    this.buyAlert = false;
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
            "quantity": portfolio[i].quantity + quant,
            "total": portfolio[i].total + total
          }
          flag = 1
        }
      }
      if (flag == 1) {
        var newportfolio = portfolio.filter((ele: any) => ele.ticker !== ticker)
        newportfolio.push(newData)
        localStorage.setItem('portfolio', JSON.stringify(newportfolio))
        this._success.next(ticker + " bought successfully");
        this.buyAlert = true;
        this.makecalls()
      }
      else {
        var newstock = {
          "ticker": ticker,
          "name": name,
          "quantity": quant,
          "total": total
        }
        portfolio.push(newstock)
        localStorage.setItem('portfolio', JSON.stringify(portfolio))
        this._success.next(ticker + " bought successfully");
        this.buyAlert = true;
        this.makecalls()
      }
    }
    else {
      var portfolioData = {
        "ticker": ticker,
        "name": name,
        "quantity": quant,
        "total": total
      }
      localStorage.setItem('portfolio', JSON.stringify([portfolioData]))
      this._success.next(ticker + " bought successfully");
      this.buyAlert = true;
      this.makecalls()
    }
  }

  onSell(ticker: any, name: any, quant: any, total: any) {
    this.quantity = 0
    this.sellAlert = false;
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
          this.quantity = portfolio[i].quantity - quant;
          var newportfolio = portfolio.filter((ele: any) => ele.ticker !== ticker)
          if (this.quantity > 0) {
            newportfolio.push(newData)
            localStorage.setItem('portfolio', JSON.stringify(newportfolio))
            this._failure.next(ticker + " sold successfully");
            this.makecalls()
            this.sellAlert = true;
          }
          else {
            localStorage.setItem('portfolio', JSON.stringify(newportfolio))
            this._failure.next(ticker + " sold successfully");
            this.makecalls()
            this.sellAlert = true;
          }
          break;
        }
      }
    }
  }


  makecalls() {
    var callsapi = []
    this.portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    this.walletmoney = JSON.parse(localStorage.getItem('walletmoney') || '[]');
    if (this.portfolio.length > 0) {
      for (var i = 0; i < this.portfolio.length; i++) {
        callsapi.push(this.ApiService.fetchCompanyStockPrice(this.portfolio[i].ticker))
      }
      forkJoin(callsapi).subscribe((responses) => {
        var list = [];
        for (var j = 0; j < responses.length; j++) {
          var d = JSON.parse(JSON.stringify(responses[j]));
          const bar: PortfolioInfo = {
            ticker: this.portfolio[j].ticker,
            name: this.portfolio[j].name,
            quantity: this.portfolio[j].quantity,
            total: this.portfolio[j].total,
            avgcost: this.portfolio[j].total / this.portfolio[j].quantity,
            change: Math.round((d.c - (this.portfolio[j].total / this.portfolio[j].quantity)) * 100) / 100,
            marketvalue: Math.round((d.c + this.portfolio[j].quantity) * 100) / 100,
            currentprice: Math.round(d.c * 100) / 100
          };
          list.push(bar)
        }
        this.finaldata = list;
      });
    }
    else {
      this.showAlert = true
    }

  }

  ngOnInit(): void {
    this.subscription = this.stockdata.getRatelimit().subscribe(
      res => {
        this.ApiError = res;
      });
    this.showAlert = true;
    this.portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    this.walletmoney = JSON.parse(localStorage.getItem('walletmoney') || '[]');
    if (this.portfolio.length > 0) {
      this.showAlert = false;
      this.makecalls()
    }
    else {
      this.showAlert = true;
    }

    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    this._failure.subscribe(message => this.failureMessage = message);
    this._failure.pipe(debounceTime(5000)).subscribe(() => {
      if (this.closingAlert) {
        this.closingAlert.close();
      }
    });
  }

}
