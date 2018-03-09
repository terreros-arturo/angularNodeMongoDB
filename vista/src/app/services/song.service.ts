import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response, Request} from '@angular/http';
import 'rxjs/add/operator/map'; //para mapear
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Song } from '../models/song';



@Injectable()
export class SongService{

    public url: string;
    public constructor(
        private http: Http   
    ){
        this.url = GLOBAL.url;
    }


    public getSongs(token, idAlbum = null){
        let requestOptions = new RequestOptions({
            headers: new Headers({
                //'Content-Type': 'application/json',
                'Content-Type': 'text/html',
                'Authorization': token
            })
        });

        idAlbum = idAlbum?idAlbum: '';

        return this.http.get(this.url + '/songs/' + idAlbum,requestOptions).map(respone => respone.json());
    }


    public saveSong(token, song: Song){
        let requestOptions = new RequestOptions ({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        });
        return this.http.post(this.url + '/song', song, requestOptions).map(response => response.json());
    }

    public getSong(token, idSong){
        let requestOptions = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        });
        return this.http.get(this.url + '/song/' + idSong,requestOptions).map(response => response.json());

    }

    public updateSong(token: string, song: Song){
        let requestOptions = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        });

        return this.http.put(this.url + '/song/' + song._id,song, requestOptions).map(response => response.json());
    }

    public deleteSong(token, idSong){
        let requestOptions = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            })
        });
        return this.http.delete(this.url + '/song/' + idSong,requestOptions).map(response => response.json());

    }


    

}

