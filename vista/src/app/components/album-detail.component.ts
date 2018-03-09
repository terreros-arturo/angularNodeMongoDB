import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Route, Params } from '@angular/router';


import { GLOBAL } from '../services/global';
/**Servicios */
import { SongService } from '../services/song.service';
import { UserService } from '../services/user.services';
import { AlbumService } from '../services/album.service';

import { Album } from '../models/album';
import { Song } from '../models/song';




@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [AlbumService, SongService, UserService]
})


export class AlbumDetailComponent implements OnInit{

    public titulo: string;
    public token;
    public identity;

    public album: Album;
    public songs: Array<Song>;
    public albumMessage: string;
    public url: string;

    public constructor(
        private songService: SongService,
        private userService: UserService,
        private albumService: AlbumService,
        private route: ActivatedRoute,
        private router: Router
    ){
        this.titulo = 'Album'
        this.token = userService.getToken();
        this.identity = userService.getIdentity();
        this.albumMessage = '';
        this.album = new Album('','','',0,'','');
        this.url = GLOBAL.url;
    }

    public ngOnInit(){
        console.log('Inicializando componente album-detail');
        let idAlbum = '';

        this.route.params.subscribe((params: Params) => {
            idAlbum = params['id'];
            console.log(idAlbum);
        });
        
        this.getAlbum(idAlbum);
        
    }


    public getAlbum(idAlbum){
        
        this.albumService.getAlbum(idAlbum, this.token).subscribe(
            success  => {
                if(success.album){
                    this.album._id = success.album._id;
                    this.album.artist= success.album.artist._id;
                    this.album.description = success.album.description;
                    this.album.image = success.album.image;
                    this.album.title = success.album.title;
                    this.album.year = success.album.year;

                    console.log('Album');
                    console.log(this.album);
                    //Se recuperó exitosamente el album
                    this.songService.getSongs(this.token, idAlbum).subscribe(
                        success =>{
                            if(success.songs){
                                console.log('Canciones recuperadas');
                                console.log(success.songs);
                                this.songs = success.songs;
                                
                            }else{
                                //No se encontraron canciones relacionadas al album u ocurrió un problema
                                console.log('No se pudieron recuperar canciones del album: \'' + idAlbum + '\'')
                                this.albumMessage = 'No se encontraron canciones relacionadas al album';
                            }
                        },
                        error => {
                            //Error al recuperar las canciones del album
                            console.error(error);
                        }
                    );
                }else{
                    console.log('Se ha producido un error al recuperar el album');
                }
            },
            error => {
                //Error aal recuperar album
                console.error(error);
            }
        );
        
    }
}