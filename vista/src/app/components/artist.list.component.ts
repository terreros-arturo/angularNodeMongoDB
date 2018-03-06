import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';

import { ArtistService } from '../services/artist.service';
import { Response } from '@angular/http/src/static_response';
import { Jsonp } from '@angular/http/src/http';


@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})



export class ArtistListComponent{
    public titulo: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public nextPage;
    public prevPage;
    public confirm: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private artistService: ArtistService,
        private userService: UserService
    ){
        this.titulo = 'Artistas';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.prevPage = 1;
        this.nextPage = 1;
        this.confirm = '';
    }

    ngOnInit(){
        console.log('Inicializando artist.list.component');
        this.getArtists();
    }

    getArtists(){
        this.route.params.forEach((params: Params)=>{
            /*+ convertir a número*/
            let page = +params ['page'];
            if(page){
                this.nextPage = (page) + 1;
                this.prevPage = (page) - 1;
                this.prevPage == 0? this.prevPage = 1: this.prevPage
            }else{
                page = 1;
            }

            this.artistService.getArtists(this.token, page).subscribe( 
                response =>{
                    if(response.artists){
                        this.artists = response.artists;
                        console.log(response);
                    }else{
                        this.router.navigate(['/']);
                    }
                },
                error =>{
                    let errorMessage = error;

                    if(errorMessage){
                        let body = JSON.parse(error._body);
                        console.log(body);
                    }
                    
                });
                    
        });
    }

    onDeleteArtistConfirm(id){
        this.confirm = id;
    }

    cancelDelete (){
        this.confirm = '';
    }

    deleteArtist(id: string){
        console.log('idArtist: \'' + id + '\'');
        this.artistService.deleteArtist(this.token, id).subscribe(
            response =>{
                console.log(response);
                if(response.artist){
                    console.log('artista eliminado correctamente');
                    //this.router.navigate(['/artistas/1']);
                    this.getArtists();
                }else{
                    console.log('No se logró eliminar el artista');
                }
            },error =>{
                console.log(error);
            }
        );
    }
}