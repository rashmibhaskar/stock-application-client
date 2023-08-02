import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { of, from, Observable, Subject, Subscription, timer, forkJoin } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { Info } from './info';
import { StockdataService } from '../../stockdata.service';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  watchtickers: [] | undefined;
  finalinfo = {};
  allres: Array<any> = []
  watchlistticker = []
  data = []
  finaldata: any;
  info!: Info;
  watchlistArr!: []
  isEmpty = false;
  ApiError = false;
  subscription!: Subscription;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private stockdata: StockdataService
  ) { }

  gotodetailspage(ticker: any) {
    this.router.navigateByUrl('/search/' + ticker.toUpperCase())
  }
  removedata(ticker: any, e: Event) {
    e.stopPropagation();
    this.data = JSON.parse(localStorage.getItem('watchlist') || '[]');
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i][0] === ticker) {
        this.data.splice(i, 1);
        localStorage.setItem('watchlist', JSON.stringify(this.data));
        break;
      }
    }

    this.updatewatchlist()
  }

  updatewatchlist() {
    var callsapi = []
    this.data = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (this.data.length === 0) {
      this.isEmpty = true;
    }
    else {
      this.isEmpty = false;
      for (var i = 0; i < this.data.length; i++) {
        callsapi.push(this.ApiService.fetchCompanyStockPrice(this.data[i][0]))
      }
      forkJoin(callsapi).subscribe((responses) => {
        var list = [];
        for (var j = 0; j < responses.length; j++) {
          var d = JSON.parse(JSON.stringify(responses[j]));
          const bar: Info = { ticker: this.data[j][0], name: this.data[j][1], c: d.c, d: d.d, dp: Math.round(d.dp * 100) / 100 };
          list.push(bar)
        }
        this.finaldata = list;
      });
    }
  }
  ngOnInit(): void {
    this.subscription = this.stockdata.getRatelimit().subscribe(
      res => {
        this.ApiError = res;
      });
    this.updatewatchlist()
  }

}

