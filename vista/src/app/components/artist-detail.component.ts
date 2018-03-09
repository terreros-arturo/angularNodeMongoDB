import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';


@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})



export class ArtistDetailComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public artistMessage: string;
    public albums: Array<Album>;
    public confirm: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private artistService: ArtistService,
        private userService: UserService,
        private albumService: AlbumService
    ){
        this.titulo = 'Editar Artista';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.confirm = '';
        //this.artist = new Artist('','','','');
    }

    ngOnInit(){
        console.log('Inicializando artist-detail.component');
        //invocar a método del API para obtener un artista a partir de su _id
        this.getArtist();
    }

    getArtist(){
        //console.log('recuperando artista');
        this.route.params.forEach((params: Params) =>{
            let id = params['id'];
            this.artistService.getArtist(this.token, id).subscribe(response =>{
                if(response.artist){
                    
                    this.artist = response.artist;
                    //console.log(this.artist);
                    //obtener los albums del artista
                    this.albumService.getAlbums(id, this.token).subscribe(
                        success =>{
                            //Albums recuperados
                            if(success.albums){
                                this.albums = success.albums;
                                //console.log(this.albums);
                            }else{
                                //No se puedieron recuperar albums
                                console.log('No se encontraron albums para este artista');
                            }
                        },error => {
                            //se produjo un error
                            console.log('Error producido al recuperar los albums, ' + error);
                            this.artistMessage = error;
                        }
                    );
                }else{
                    this.artistMessage = "error producido al intentar recuperar el artista";
                    //Redireccionar a raiz
                    this.router.navigate(['/']);
                }
            },
            error => {
                this.artistMessage = "error";
            });
        });       
    }

    public onDeleteAlbumConfirm(id: string){
        if(id){
            this.confirm = id;
        }
    }

    public deleteAlbum(id: string){
        //se invoca al servicio para eliminar
        this.albumService.deleteAlbum(this.token,id).subscribe(
            success => {
                if(success.album){
                    //this.router.navigate(['/artistas/',1]);
                    //window.location.reload();
                    this.getArtist();
                }else{
                    console.error('Se ha producido un error al eliminar el ');
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    public cancelDelete(){
        this.confirm = '';
    }
    
}