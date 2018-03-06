import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GLOBAL } from '../services/global';

import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

import { AlbumService } from '../services/album.service' ;

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService],
})



export class AlbumAddComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public albumMessage: string;
    public btnSubmit: string;
    public fileChooseAlbum: Array<File>;
    public idArtist: string;
    public alertClass : string;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private artistService: ArtistService,
        private userService: UserService,
        private albumService: AlbumService
    ){
        this.titulo = 'Crear album';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','','', new Date().getFullYear(),'','');
        this.btnSubmit = 'Crear album';
        this.idArtist = '';
        this.albumMessage = '';
        this.alertClass = '';
    }

    ngOnInit(){
        console.log('Inicializando album-add.component');
        //invocar a método del API para obtener un artista a partir de su _id
        this.route.paramMap.subscribe(params => {
            this.idArtist = params.get('artist');
            //console.log('idArtist: ' + this.idArtist);
        });
    }

    onSubmit(){
        console.log('Guardando album');
        this.album.artist = this.idArtist;
        console.log(this.album);
        this.albumService.addAlbum(this.token, this.album).subscribe(
            success =>{
                if(success.album){
                    //exito
                    this.album = success.album;
                    this.albumMessage = 'Album registrado correctamente';
                    this.alertClass = 'alert alert-success';
                    this.router.navigate(['/editar-album/',this.album._id]);
                }else{
                    //error
                    this.albumMessage = 'Se ha producido un error en el servidor, favor de contactar con el administrador';
                    this.alertClass = 'alert alert-danger';
                }
            },
            error => {
                this.albumMessage = error;
            }
        );
        
    }  
}