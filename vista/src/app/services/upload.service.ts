import { Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response } from  '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';


@Injectable()
export class UploadFileService{
    public url: string;

    constructor(private http:Http){
        this.url = GLOBAL.url;
    }


    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string){
        console.log('makeFileRequest token por enviar:\'' + token + '\'');
        return new Promise((resolve, reject) =>{
            let formData: any = new FormData();
            for(let index = 0; index < files.length; index ++){
                formData.append(name, files[index], files[index].name);
            }

            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        //exito
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}
