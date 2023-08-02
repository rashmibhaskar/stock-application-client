import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from "../app/components/details/details.component"
import { WatchlistComponent } from "../app/components/watchlist/watchlist.component";
import { PortfolioComponent } from "../app/components/portfolio/portfolio.component";
import { SearchComponent } from "../app/components/search/search.component";


const routes: Routes = [
  { path: 'search/home', component: SearchComponent },
  { path: 'search/:ticker', component: DetailsComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: '', redirectTo:'search/home',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
