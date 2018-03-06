import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'; //para mapear
import { Observable } from 'rxjs/Observable'; //recuperar respuestas del servidor al que se relizarán las peticiones
import { GLOBAL } from './global';
import { User } from "../models/user";
import { Artist } from '../models/artist';

@Injectable() //inyección de dependencias
export class ArtistService{
    /*url del api*/
    public url: string;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    addArtist(token, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.post(this.url + '/artist', params, {headers: headers}).map( response => response.json());
    }

    getArtists(token, page){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        let requestOptions = new RequestOptions({headers: headers});
        return this._http.get(this.url + "artists/" + page, requestOptions).map((response) => response.json());
        //return this._http.get(this.url + "artist/" + page, {headers: headers}).map((response) => response.json());
    }


    getArtist(token, id: string){
       let headers = new Headers({
           'Content-Type' : 'application/json',
           'Authorization': token
       });

       return this._http.get(this.url + "/artist/" + id, {headers:headers}).map(response => response.json());
    }

    editArtist(token, id, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.put(this.url + '/artist/' + id, params, {headers: headers}).map( response => response.json());
    }


    deleteArtist(token, id: string){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization': token
        });
        return this._http.delete(this.url + "/artist/" + id,{headers:headers}).map((response) => {return response.json()});
    }


}