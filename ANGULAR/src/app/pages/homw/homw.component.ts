import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-homw',
  templateUrl: './homw.component.html',
  styleUrls: ['./homw.component.css']
})
export class HomwComponent implements OnInit {
  public adapiData = [];
  public image: boolean;
  public headers: Headers

  public totalusers: number;
  constructor(private _AppService: AppService, public http: Http) { }

  ngOnInit(): void {
    this.image = true;
    this.totalusers = 0
    this.searchMusic()
  }
  searchMusic() {
    this._AppService.searchResult().subscribe((result) => {
      if (result) {

        this.adapiData = result
        this.image = false

      } else {
        console.log("error..........!")
      }
    });
  }
  gotoDelete(id) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.delete('http://localhost:1900/upload/' + id, { headers: this.headers }).subscribe({
      next: data => {
        this.searchMusic()
      },
      error: error => console.error('There was an error!', error)
    })
  }
}
