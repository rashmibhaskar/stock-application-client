import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../api.service';
import * as Highcharts from "highcharts/highstock";
import { StockdataService } from '../../stockdata.service';
import { Subscription } from 'rxjs';
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts);
require('highcharts/indicators/volume-by-price')(Highcharts);

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
    @Input() companydesc!: any;
    companyhistory!: any
    highcharts = Highcharts;
    charConstructor = 'stockChart'
    chartOptions!: any;
    subscription!: Subscription;
    inStateTiicker: any;
    ohlc!: any;
    volume!: any;
    constructor(
        private ApiService: ApiService,
        private stockdata: StockdataService
    ) { }

    setchart() {
        var groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]]
        this.chartOptions = {
            rangeSelector: {
                selected: 2,
                enabled: true
            },

            title: {
                text: this.companydesc.ticker + ' Historical'
            },

            subtitle: {
                text: 'With SMA and Volume by Price technical indicators'
            },
            navigator: {
                enabled: true
            },
            scrollbar: {
                enabled: true
            },
            yAxis: [{
                startOnTick: false,
                endOnTick: false,
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'OHLC'
                },
                height: '60%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],

            tooltip: {
                split: true
            },

            plotOptions: {
                series: {
                    dataGrouping: {
                        units: groupingUnits
                    }
                }
            },

            series: [{
                type: 'candlestick',
                name: this.companydesc.ticker,
                id: this.companydesc.ticker,
                zIndex: 2,
                data: this.ohlc
            }, {
                type: 'column',
                name: 'Volume',
                id: 'volume',
                data: this.volume,
                yAxis: 1
            }, {
                type: 'vbp',
                linkedTo: this.companydesc.ticker,
                params: {
                    volumeSeriesID: 'volume'
                },
                dataLabels: {
                    enabled: false
                },
                zoneLines: {
                    enabled: false
                }
            }, {
                type: 'sma',
                linkedTo: this.companydesc.ticker,
                zIndex: 1,
                marker: {
                    enabled: false
                }
            }]
        }
    }

    displayChart() {
        this.subscription = this.stockdata.getChartcompanyhistory().subscribe(
            res => {
                if (res) {
                    this.inStateTiicker = res.ticker;
                    this.ohlc = res.ohlc;
                    this.volume = res.volume;
                }
            });
        if (this.inStateTiicker === this.companydesc.ticker) {
            this.setchart()
        }
        else {
            var now_ = new Date()
            var from_ = new Date(now_)
            from_.setFullYear(now_.getFullYear() - 2)
            this.ApiService.fetchCompanyHistory(this.companydesc.ticker, 'D', from_, now_, 'second')
                .subscribe((data: any) => {
                    this.companyhistory = data
                    var o = []
                    var v = [];
                    for (var i = 0; i < this.companyhistory.t.length; i++) {
                        o.push([this.companyhistory.t[i], this.companyhistory.o[i], this.companyhistory.h[i], this.companyhistory.l[i], this.companyhistory.c[i]])
                        v.push([this.companyhistory.t[i], this.companyhistory.v[i]])
                    }

                    this.ohlc = o;
                    this.volume = v;

                    var dat = {
                        'ticker': this.companydesc.ticker,
                        'ohlc': this.ohlc,
                        'volume': this.volume
                    }


                    this.stockdata.setChartcompanyhistory(dat)
                    this.setchart()
                }
                )
        }

    }
    ngOnInit(): void {
        this.displayChart()
    }

}
