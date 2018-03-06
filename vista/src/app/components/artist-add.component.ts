import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';


@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService],
})



export class ArtistAddComponent{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public artistMessage: string;
    public btnSubmitForm: string;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private artistService: ArtistService,
        private userService: UserService
    ){
        this.titulo = 'Crear Artista';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','','');
        this.btnSubmitForm = "Registrar";
    }

    ngOnInit(){
        console.log('Inicializando artist-add.component');
        
    }

    onSubmit(){
        this.artistService.addArtist(this.token, this.artist).subscribe(
            response =>{
                if(response.artist){
                    this.artist = response.artist;
                    console.log(this.artist);
                    //this.router.navigate(['/editar-artista'], this.artist._id);
                    this.router.navigate(['/editar-artista/' + this.artist._id]);
                    this.artistMessage = "Artista registrado correctamente";
                }else{
                    this.artistMessage = "error en servidor";
                }
        },error => {
            alert();
            this.artistMessage = "error"
        });
    }
}