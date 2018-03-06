import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response, Request} from '@angular/http';
import 'rxjs/add/operator/map'; //para mapear
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Album } from '../models/album';


@Injectable()
export class AlbumService{
    public url: string;

    constructor(private http: Http){
        this.url = GLOBAL.url;
    }

    addAlbum(token, album){
        let requestOptions = new RequestOptions({
                headers: new Headers({
                    'Content-Type':'application/json',
                    'Authorization': token
                })
            });
        return this.http.post(this.url + 'album', album, requestOptions).map( response => response.json());
    }


    editAlbum(token, album){
        let requestOptions = new RequestOptions({
            headers: new Headers({
                'Content-Type':'application/json',
                'Authorization': token
            })
        });
        return this.http.put(this.url + 'album/' + album._id, album, requestOptions).map( response => response.json());
    }

    getAlbum(id, token){
        let requestOptions = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                //'Content-Type': 'text/html',
                'Authorization': token
            })
        });
        return this.http.get(this.url + 'album/' + id,requestOptions).map(success => success.json());
    }

    getAlbums(idArtist = null, token){
        let requestOptions = new RequestOptions({
            headers: new Headers({
                //'Content-Type': 'application/json',
                'Content-Type': 'text/html',
                'Authorization': token
            })
        });
        if(idArtist != null){
            return this.http.get(this.url + 'albums/' + idArtist,requestOptions).map(success => success.json());
        }else{
            return this.http.get(this.url + 'albums/' ,requestOptions).map(success => success.json());
        }

    }
}
