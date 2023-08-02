import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../api.service';
import * as Highcharts from 'highcharts';
import { StockdataService } from '../../stockdata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  highcharts = Highcharts;
  chartOptions!: any;
  recommendation!: any;
  earnings!: any;
  earningsChartOptions!: any;
  subscription!: Subscription;
  inStateTiicker: any;
  @Input() companydesc!: any;
  sentiments!: any;
  constructor(
    private ApiService: ApiService,
    private stockdata: StockdataService
  ) { }

  setRecOptions() {
    this.chartOptions = {
      chart: {
        type: 'column',
        renderTo: 'contanier',
        marginRight: 10
      },
      title: {
        text: 'Recommendation Trends'
      },
      xAxis: {
        categories: this.recommendation.period
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis'
        },
        stackLabels: {
          enabled: true
        }
      },
      legend: {


        verticalAlign: 'bottom',


        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },

      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Strong Buy',
        data: this.recommendation.strongBuy,
        color: '#186f37'
      }, {
        name: 'Buy',
        data: this.recommendation.buy,
        color: '#1cb955'
      }, {
        name: 'Hold',
        data: this.recommendation.hold,
        color: '#b98b1d'
      },
      {
        name: 'Sell',
        data: this.recommendation.sell,
        color: '#f45b5a'
      }, {
        name: 'Strong Sell',
        data: this.recommendation.strongSell,
        color: '#823535'
      }]

    };
  }
  displayRecommendationCharts() {

    this.subscription = this.stockdata.getRecommendation().subscribe(
      res => {
        if (res) {
          this.inStateTiicker = res.ticker;
          this.recommendation = res.data;
        }
      });
    if (this.inStateTiicker === this.companydesc.ticker) {
      this.setRecOptions()
    }
    else {
      this.ApiService.fetchRecommendationTrends(this.companydesc.ticker)
        .subscribe((data: any) => {
          this.recommendation = data
          var newData = {
            ticker: this.companydesc.ticker,
            data: this.recommendation
          }
          this.setRecOptions()
          this.stockdata.setRecommendation(newData)
        });
    }
  }

  setEPS() {
    this.earningsChartOptions = {
      chart: {
        type: 'spline',
        renderTo: 'conatiner',
        marginRight: '10'
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      xAxis: {
        categories: this.earnings.categories
      },
      yAxis: {
        title: {
          text: '#Quantity EPS'
        }
      },
      series: [{
        name: 'Actual',
        data: this.earnings.actual
      }, {
        name: 'Estimate',
        data: this.earnings.estimate
      }]

    };
  }
  displayEPSChart() {
    this.subscription = this.stockdata.getEarnings().subscribe(
      res => {
        if (res) {
          this.inStateTiicker = res.ticker;
          this.earnings = res.data;
        }
      });
    if (this.inStateTiicker === this.companydesc.ticker) {
      this.setEPS()
    }
    else {
      this.ApiService.fetchEarnings(this.companydesc.ticker)
        .subscribe((data: any) => {
          this.earnings = data
          var newData = {
            ticker: this.companydesc.ticker,
            data: this.earnings
          }
          this.setEPS()
          this.stockdata.setEarnings(newData)
        });
    }
  }

  ngOnInit(): void {
    this.subscription = this.stockdata.getSocialsentiment().subscribe(
      res => {
        if (res) {
          this.inStateTiicker = res.ticker;
          this.sentiments = res.data;
        }
      });
    if (this.inStateTiicker === this.companydesc.ticker) {
    }
    else {
      this.ApiService.fetchSocialSentiment(this.companydesc.ticker)
        .subscribe((data: any) => {
          this.sentiments = data
          var newData = {
            ticker: this.companydesc.ticker,
            data: this.sentiments
          }
          this.stockdata.setSocialsentiment(newData)
        });
    }
    this.displayRecommendationCharts()
    this.displayEPSChart()
  }
}
