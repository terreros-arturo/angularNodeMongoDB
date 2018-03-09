import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.services';

import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AlbumService } from '../services/album.service';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, AlbumService]
})

export class SongAddComponent implements OnInit{
    
    public url: string;
    public titulo: string;
    public song: Song;
    public btnSubmit: string;
    public token;
    public msgSong;
    public identity;

    constructor(
        private userService: UserService,
        private songService: SongService,
        private albumService: AlbumService,
        private route: ActivatedRoute,
        private router: Router
    ){
        this.url = GLOBAL.url;
        this.titulo = 'Agregar tema';
        this.song = new Song('',0,'','','','');
        this.btnSubmit = 'Guardar';
        this.token = userService.getToken();
        this.identity = userService.getIdentity();
        this.msgSong = '';
    }

    public ngOnInit(){
        
        console.log('Inicializando SongAddComponent');
        this.getTitleAlbum();
    }

    public getTitleAlbum(){
        let idAlbum;
        this.route.params.forEach((params:Params) =>{
            idAlbum = params['album'];
        });

        this.albumService.getAlbum(idAlbum, this.token).subscribe(
            success =>{
                if(success.album){
                    this.titulo = success.album.title;
                }else{
                    console.error('No se logró recuperar el titulo del album');
                }
            },
            error =>{
                console.error('No se logró recuperar el titulo del album: ' + error);
            }
        );
    }

    public onSubmit(){
        let idAlbum;
        this.route.params.forEach((params:Params) =>{
            idAlbum = params['album'];
        });
        this.song.album = idAlbum;
        //console.log(this.song);

        this.songService.saveSong(this.token, this.song).subscribe(
            success => {
                if(success.song){
                    this.song = success.song;
                    console.log(success);
                    this.msgSong = 'Canci&oacute;n registrada con &eacute;xito';
                    this.router.navigate(['/editar-tema/',this.song._id]);
                }else{
                    console.log('No se logró registrar la cancion');
                    this.msgSong = 'No se logr&oacute; registrar la canci&oacute;n, consulte con su administrador';
                }
            },
            error => {
                this.msgSong = error;
            }
        );
    }
}