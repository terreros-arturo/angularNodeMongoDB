import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'; //para mapear
import { Observable } from 'rxjs/Observable'; //recuperar respuestas del servidor al que se relizarán las peticiones
import { GLOBAL } from './global';
import { User } from "../models/user";

@Injectable() //inyección de dependencias
export class UserService{
    /*url del api*/
    public identity;
    public token;
    public url: string;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    signup(userToLogin: User, getHash = null){
        if(getHash != null){
            userToLogin.gethash = getHash;
        }
        /**se convierte el usuario a tipo json para pasarlo como parametro al API */
        let json = JSON.stringify(userToLogin);
        let params = json;

        let headers = new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url + 'loginUser', params, {headers: headers}).map(res => res.json());
    }

    register(usuarioRegistro){
        let jsonUser = JSON.stringify(usuarioRegistro);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url + 'register',jsonUser,{headers: headers}).map(res => res.json());
    }


    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != 'undefined'){
           this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');
        if(token != 'undefined'){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

    updateUser(usuario:User){
        let jsonUser = JSON.stringify(usuario,(key, value)=>{
            if(key != 'password'){
                return value;
            }
        });
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': this.getToken()
        });
        return this._http.put(this.url + 'update-user/' + usuario._id ,jsonUser,{headers: headers}).map(res => res.json());
    }
}