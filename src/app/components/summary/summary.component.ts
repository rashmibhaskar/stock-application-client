import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router, Event, ActivatedRoute, ParamMap, Params, NavigationEnd } from '@angular/router';
import { ApiService } from '../../api.service';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import 'moment-timezone';
import { StockdataService } from '../../stockdata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  highcharts = Highcharts;
  chartOptions!: any;
  @Input() item !: any;
  @Input() companydesc!: any;
  @Input() marketStatus!: any;
  @Input() stockprice!: any;
  @Input() count!: any;
  companypeers!: any;
  companyhistory!: any;
  ctt: any;
  subscription!:Subscription;
  inStateTiicker: any;

  constructor(
    private route: ActivatedRoute,
    private ApiService: ApiService,
    private router: Router,
    private stockdata: StockdataService
  ) { }

  displayLineChart() {
    console.log("Inside display",this.ctt)
    var colour;
    if (this.stockprice.d > 0) {
      colour = '#008000'
    }
    if (this.stockprice.d < 0) {
      colour = '#FF0000'
    }
    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: this.companydesc.ticker + " Hourly Price Variation",
        style: {
          color: '#808080',
      }
      },
      time: {
        timezone: 'America/Los_Angeles'
    },  
    tooltip: {
      valueDecimals: 2,
      split: true,
    },
    xAxis: {
      type: 'datetime',
      scrollbar: {
        enabled: true
    },
    crosshair: {
      enabled: true
  }
    },
      yAxis: {
        opposite: true,
        title:{
          enabled:false
        }
      },
      plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },
      series: [{
        data: this.ctt,
        color: colour,
        name: this.companydesc.ticker
      }]
    }
  }


  displaySummaryChart() {
    if (this.marketStatus) {
      this.subscription = this.stockdata.getSummarycompanyhistory().subscribe(
        res => {
          if(res)
          {
              this.inStateTiicker = res.ticker;
              this.ctt= res.data;
            }
          });
          if(this.inStateTiicker === this.companydesc.ticker)
          {
              this.displayLineChart()
          }
          else{
            var now_ = new Date()
            var from_ = new Date(now_)
            from_.setHours(now_.getHours() - 6)
            this.ApiService.fetchCompanyHistory(this.companydesc.ticker, 5, from_, now_, 'first')
              .subscribe((data: any) => {
                this.companyhistory = data
                this.ctt = this.companyhistory.t.map((e: any, i: any) => {
                  return [e, this.companyhistory.c[i]];
                });
                var newdat={
                  ticker:this.companydesc.ticker,
                  data:this.ctt
                }
                this.stockdata.setSummarycompanyhistory(newdat)
                this.displayLineChart()
              })
          }
    }
    else {
      this.subscription = this.stockdata.getSummarycompanyhistory().subscribe(
        res => {
          if(res)
          {
              this.inStateTiicker = res.ticker;
              this.ctt = res.data;
            }
          });
          if(this.inStateTiicker === this.companydesc.ticker)
          {
              this.displayLineChart()
          }
          else{
            var to = new Date(this.stockprice.t * 1000)
            var from = new Date(to)
            from.setHours(to.getHours() - 6)
            this.ApiService.fetchCompanyHistory(this.companydesc.ticker, 5, from, to, 'first')
              .subscribe((data: any) => {
                this.companyhistory = data
                this.ctt = this.companyhistory.t.map((e:any, i:any) =>{
                  return [e,this.companyhistory.c[i]];
                });
                var newdat={
                  ticker:this.companydesc.ticker,
                  data:this.ctt
                }
                this.stockdata.setSummarycompanyhistory(newdat)
                this.displayLineChart()
              })
          }
    }
  }

  changePeerRoute(company: any) {
    this.router.navigateByUrl('/search/' + company.toUpperCase())
    localStorage.setItem('route', company.toUpperCase())
  }


  changeChartData(){
    if(this.marketStatus){
      var now_ = new Date()
      var from_ = new Date(now_)
      from_.setHours(now_.getHours() - 6)
      this.ApiService.fetchCompanyHistory(this.companydesc.ticker, 5, from_, now_, 'first')
        .subscribe((data: any) => {
          this.companyhistory = data
          this.ctt = this.companyhistory.t.map((e: any, i: any) => {
            return [e, this.companyhistory.c[i]];
          });
          var newdat={
            ticker:this.companydesc.ticker,
            data:this.ctt
          }
          this.stockdata.setSummarycompanyhistory(newdat)
          this.displayLineChart()
        })
    }
    else{
      this.displayLineChart()
    }
  }

  ngOnInit(): void {
    this.subscription = this.stockdata.getCompanypeers().subscribe(
      res => {
        if(res)
        {
            this.inStateTiicker = res.ticker;
            this.companypeers = res.data;
          }
        });
        if(this.inStateTiicker === this.companydesc.ticker)
        {
        }
        else{
          this.ApiService.fetchCompanyPeers(this.companydesc.ticker)
          .subscribe((data:any)=>{
            this.companypeers=data
            var newData={
              ticker:this.companydesc.ticker,
              data:this.companypeers
            }
            this.stockdata.setCompanypeers(newData)
          });
        }
    this.displaySummaryChart()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changeChartData()
  }

}
