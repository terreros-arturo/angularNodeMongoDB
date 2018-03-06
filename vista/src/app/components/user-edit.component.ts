import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.services';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{

    public titulo: string;
    public user: User;
    public identity;
    public token;
    public updateMessage;
    public filesToUpload: Array<File>;
    public url: string;

    constructor(private userService: UserService){
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.titulo = 'Actualizar mis datos';
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Creando componente UserEditComponent');
    }

    onSubmit(){
        console.log(this.user);
        //this.user.password = this.identity.password;
        this.userService.updateUser(this.user).subscribe(
            response => {
                console.log('respuesta recibida');
                console.log(response);

                if(response.user && response.user._id){
                    this.user = response.user;
                    localStorage.setItem('identity',JSON.stringify(this.user));
                    document.getElementById('identity_name').textContent = this.user.name;
                    this.loadFileUser();
                }else{
                    let responseJSON = JSON.parse(response);
                    console.log('Se ha producido un error en la actualización de los datos del usuario');
                    this.updateMessage = responseJSON._body.message;
                }
            },
            error =>{
                
                let mensajeRegistro = <any>error;
                if(mensajeRegistro != null){
                    console.log('Error: ');
                    console.log(mensajeRegistro);
                    var jsonBody = JSON.parse(mensajeRegistro._body);
                    this.updateMessage = jsonBody.message;
                }
            }
        );
    }

    fileChooseEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
    
    loadFileUser(){
        console.log(this.filesToUpload);
        if(this.filesToUpload && this.filesToUpload.length > 0){
            //Archivo seleccionado
            this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id,[], this.filesToUpload)
            .then(
                (response: any) =>{
                    this.user.image = response.image;
                    this.identity.image = response.image;
                    
                    //this.userService.identity = this.user;
                    
                    localStorage.setItem('Identity', JSON.stringify(this.user));
                    document.getElementById('user-image').setAttribute("src",this.url + 'get-image-user/' + this.identity.image);
                    console.log(this.user);
                },(error) => {
                    console.log('Se ha producido un error');
                    console.log(error);
                }
            ).catch(error =>{
                console.log(error);
            });
        }else{
            //no se seleccionaron archivos
        }
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        //let token = this.token;
        let token = localStorage.getItem('token');
        this.token = token;
        console.log('makeFileRequest token por enviar:\'' + token + '\'');
        return new Promise((resolve, reject) =>{
            let formData: any = new FormData();
            for(let index = 0; index < files.length; index ++){
                formData.append('image', files[index], files[index].name);
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