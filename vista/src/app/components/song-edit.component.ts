import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.services';
import { SongService } from '../services/song.service';
import { UploadFileService } from  '../services/upload.service';
import { AlbumService } from '../services/album.service';

import { Song } from '../models/song';
import { GLOBAL } from '../services/global';
import { ActivatedRoute, Params, Router } from '@angular/router';




@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService,UploadFileService, AlbumService]
})


export class SongEditComponent implements OnInit{
    public titulo: string;
    public song: Song;
    public btnSubmit: string;
    public token: string;
    public filesSong: Array<File>;
    public msgSong: string;
    public url: string;
    public identity;

    public constructor(
        private userService: UserService,
        private songService: SongService,
        private albumService: AlbumService,
        private uploadService: UploadFileService,
        private route: ActivatedRoute,
        private router: Router
    ){
        this.titulo = "Editar tema";
        this.btnSubmit = 'Actualizar';
        this.url = GLOBAL.url;
        this.song = new Song('',0,'','','','');
        this.token = userService.getToken();
        this.identity = userService.getIdentity();
        this.filesSong = new Array<File>();
        this.msgSong = '';
    }

    public ngOnInit(){
        console.log('Inicializando SongEditComponent');
        this.getTitleAlbum();
        this.getSong();
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

    public getSong(){
        let idSong;
        this.route.params.forEach((params: Params) => {
            idSong = params['id'];
        })
        this.songService.getSong(this.token,idSong).subscribe(
            success =>{
                if(success.song){
                    console.log(success.song);
                    this.song = success.song;
                }else{
                    this.msgSong = 'Error al recuperar la canci&oacute;n, favor de comunicarse con su administrador';
                    this.router.navigate(['/']);
                }
            },
            error =>{
                this.msgSong = error;
                this.router.navigate(['/']);
            }
        );
    }

    public onSubmit(){
        console.log('Parametros recibidos para modificar');
        console.log(this.song);

        this.songService.updateSong(this.token,this.song).subscribe(
            success => {
                if(success.song){
                    //Actualizadoo con éxito
                    this.song = success.song;
                    /**Se verifica que haya archivo de audio que subir, sino no se sube */
                    if(this.filesSong.length > 0){
                        this.uploadService.makeFileRequest(this.url + '/upload-audio-song/' + this.song._id,[],this.filesSong,this.token,'file')
                        .catch(successFile => {
                            console.log('Respuesta recibida al cargar archivo');
                            console.log(successFile);
                            this.song = successFile.song;
                            this.song.file = successFile.song.file;
                            this.msgSong = 'Canción actualizada con éxito';
                        }).catch(err => {
                            console.error(err);
                            this.msgSong = err;
                        });
                    }else{
                        this.msgSong = 'Canción actualizada con éxito';
                    }

                    
                }else{
                    this.msgSong = 'Se ha producido un error al actualizar la canci&oacute;n, favor de comunicarse con su administrador';
                }
            },
            error => {
                this.msgSong = error;
            }
        );
    }

    public chooseFileEvent(files){
        console.log('archivo seleccionado');
        this.filesSong = <Array<File>>files.target.files;
    }
}