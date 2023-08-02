import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {
  isCollapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

  getroute(){
    return localStorage.getItem('route')
  }

  detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}
  
  checkclick(){
    if(this.detectMob()){
      this.isCollapsed=!this.isCollapsed
    }
    
  }
}
