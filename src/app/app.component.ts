import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'client';
  myDate = new Date();
  constructor() { }

  ngOnInit(): void {
    localStorage.setItem('route','home')
    if(!localStorage.getItem('walletmoney')){
      localStorage.setItem('walletmoney','25000')
    }
  }
}
