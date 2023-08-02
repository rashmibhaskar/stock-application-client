import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { DetailsComponent } from './components/details/details.component';
import { SearchComponent } from './components/search/search.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from '../app/api.service';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { SummaryComponent } from './components/summary/summary.component';
import { NewsComponent } from './components/news/news.component';
import { InsightsComponent } from './components/insights/insights.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsComponent } from './components/charts/charts.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    TopNavigationComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent,
    SearchComponent,
    SummaryComponent,
    NewsComponent,
    InsightsComponent,
    ChartsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    HttpClientModule,
    MatTabsModule,
    HighchartsChartModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
