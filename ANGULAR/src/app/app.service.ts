import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class AppService {
    private _loginUrl1 = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album=';
    private _loginUrl2 = '&api_key=3d85129871d8f0b1a2134034ac5bf2d3&format=json';

    //private _loginUrl = 'https://api.themoviedb.org/3/search/movie?api_key=d8fa248e12a683818d392f8b67e5db48&language=en-US&page=1&include_adult=false&query=';
    private header = new Headers({ 'Content-Type': 'application/json' });

    constructor(private _http: Http) { }

    searchResult() {
        return this._http.get('http://localhost:1900/upload', { headers: this.header }).pipe(
            map(res => res.json()),
            map((res) => {
                return res;
            })
        )
    }
    searchResultById(id) {
        return this._http.get('http://localhost:1900/upload/' + id, { headers: this.header }).pipe(
            map(res => res.json()),
            map((res) => {
                return res;
            })
        )
    }


}
