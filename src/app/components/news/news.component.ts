import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockdataService } from '../../stockdata.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  @Input() companydesc!: any;
  news!: any;
  publishdate!: any;
  modeldata!: any;
  subscription!: Subscription;
  inStateTiicker: any;
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private modalService: NgbModal,
    private stockdata: StockdataService
  ) { }

  openModal(content: any, data: any) {
    this.modeldata = data
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  ngOnInit(): void {
    this.subscription = this.stockdata.getNews().subscribe(
      res => {
        if (res) {
          this.inStateTiicker = res.ticker;
          this.news = res.data;
        }
      });
    if (this.inStateTiicker === this.companydesc.ticker) {
    }
    else {
      this.ApiService.fetchCompanyNews(this.companydesc.ticker)
        .subscribe((data: any) => {
          this.news = data
          var newData = {
            ticker: this.companydesc.ticker,
            data: this.news
          }
          this.stockdata.setNews(newData)
        });
    }
  }

}
