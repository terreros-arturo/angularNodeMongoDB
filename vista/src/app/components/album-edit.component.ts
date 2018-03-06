import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GLOBAL } from '../services/global';

import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

import { AlbumService } from '../services/album.service' ;
import { UploadFileService } from '../services/upload.service';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService,UploadFileService],
})



export class AlbumEditComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public albumMessage: string;
    public btnSubmit: string;
    public fileChooseAlbum: Array<File>;
    public idAlbum: string;
    public alertClass : string;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private albumService: AlbumService,
        private uploadService: UploadFileService
    ){
        this.titulo = 'Editar album';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','','', new Date().getFullYear(),'','');
        this.btnSubmit = 'Actualizar album';
        this.idAlbum = '';
        this.albumMessage = '';
        this.alertClass = '';
        this.fileChooseAlbum = new Array<File>();
    }

    ngOnInit(){
        console.log('Inicializando album-edit.component');
        //Recuperamos el id del album actual
        this.route.paramMap.subscribe(params => {
            this.idAlbum = params.get('id');
            //console.log('idAlbum: ' + this.idAlbum);
        });
        //Recuperamos los datos del album
        this.getAlbum(this.idAlbum);
    }

    onSubmit(){
        this.albumService.editAlbum(this.token, this.album).subscribe(
            success =>{
                if(success.album){
                    //exito
                    if(this.fileChooseAlbum.length > 0){
                        this.uploadService.makeFileRequest(this.url + 'upload-image-album/' + this.album._id,[], this.fileChooseAlbum, this.token, 'image')
                        .then(
                            (success: any) => {
                                if(success.album){
                                    this.album = success.album;
                                    this.albumMessage = 'Album actualizado correctamente';
                                    this.alertClass = 'alert alert-success';
                                }else{
                                    this.albumMessage = 'No hay imagen, favor de contactar con el administrador';
                                    this.alertClass = 'alert alert-danger';
                                }
                            },
                            error => {
                                //Error producido en Promise
                                this.albumMessage = 'Se ha producido un error en el servidor, favor de contactar con el administrador';
                                this.alertClass = 'alert alert-danger';
                            }
                        )
                        .catch((error) =>{
                            //Error producido al cargar imagen
                            this.albumMessage = 'Se ha producido un error en el servidor, favor de contactar con el administrador';
                            this.alertClass = 'alert alert-danger';
                        });
                    }else{
                        this.album = success.album;
                        this.albumMessage = 'Album actualizado correctamente';
                        this.alertClass = 'alert alert-success';
                    }
                }else{
                    //error al guardar
                    this.albumMessage = 'Se ha producido un error en el servidor, favor de contactar con el administrador';
                    this.alertClass = 'alert alert-danger';
                }
            },
            error => {
                this.albumMessage = error;
            }
        );
    }


    getAlbum(id){
        this.albumService.getAlbum(id, this.token).subscribe(success => {
            if(success.album){
                this.album = success.album;
            }else{
                this.albumMessage = 'Error producido al recuperar album, favor de comunicarse con su administrador';
            }
        },
        error => {
            console.log(error);
            this.albumMessage = 'Error producido al recuperar album, favor de comunicarse con su administrador';
        });
    }

    fileChooseEvent(event){
        console.log('Archivo seleccionado');
        this.fileChooseAlbum = <Array<File>>event.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        let token = this.token;
        //let token = localStorage.getItem('token');
        //this.token = token;
        //console.log('makeFileRequest token por enviar:\'' + token + '\'');
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
   

    getImage(img){
        console.log('img: \'' + img + '\''); 
    }
}