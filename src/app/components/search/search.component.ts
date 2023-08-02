import { Component, Input,OnInit,SimpleChanges,ViewChild } from '@angular/core';
import { Event,Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../api.service';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { of, iif, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import { StockdataService } from '../../stockdata.service';
import { Subscription } from 'rxjs';

const API_KEY = "e8067b53"
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchMoviesCtrl = new FormControl();
  filteredMovies: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 2;
  selectedMovie: any = "";
  filteredCompanies:any = [];
  isData=false;
  @Input() ticker!: any;

  subscription!:Subscription;

  private _success = new Subject<string>();
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert!: NgbAlert;
  successMessage = '';

  constructor(private http: HttpClient,    
    private formBuilder: FormBuilder,
    private router: Router,
    private ApiService: ApiService,
    private stockdata: StockdataService) { }

  onSelected() {
    this.isData=true;
    this.selectedMovie = this.selectedMovie.symbol;
    localStorage.setItem('route',this.selectedMovie)
    this.router.navigateByUrl('/search/'+this.selectedMovie.toUpperCase())
  }

  onSubmit(event:any) {
    this.stockdata.setTicker(this.selectedMovie.toUpperCase())
    event.preventDefault();
    this.isData=true;
    this.selectedMovie = this.selectedMovie;
    if(this.selectedMovie.length>0){
      localStorage.setItem('route',this.selectedMovie.toUpperCase())
      this.router.navigate(['/search/'+this.selectedMovie.toUpperCase()])
    }
    else{
      this._success.next("Please enter a valid ticker.");
    }
  }

  displayWith(value: any) {
    return value?.Title;
  }

  clearSelection() {
    this.selectedMovie = "";
    this.filteredMovies = [];
    this.router.navigateByUrl('')
  }

  makeSearch(){
    this.router.navigate(['search/'+this.searchMoviesCtrl.value.symbol])
  }
  ngOnInit() {
    // console.log(this.ticker)
    // // this.subscription = this.stockdata.getNews().subscribe(
    // //   res => {
    // //     if (res) {
    // //       this.selectedMovie = res;
    // //     }
    // //   });

    this.searchMoviesCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredMovies = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(`https://stock-frontend-1609.wl.r.appspot.com/autocomplete/${value}`)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        if (data==undefined) {
          this.errorMsg = data['Error'];
          this.filteredMovies = [];
        }
        else{
          this.errorMsg = "";
          data.result.map((ele: any)=>{
            if(ele.type==="Common Stock" && ele.symbol.includes(".")==false){
              this.filteredMovies.push(ele)
            }
          })
        }
      });


      this._success.subscribe(message => this.successMessage = message);
      this._success.pipe(debounceTime(5000)).subscribe(() => {
        if (this.selfClosingAlert) {
          this.selfClosingAlert.close();
        }
      });
  }
}
