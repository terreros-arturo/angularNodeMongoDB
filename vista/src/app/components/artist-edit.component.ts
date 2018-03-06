import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';
import { UploadFileService } from '../services/upload.service';


@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadFileService],
})



export class ArtistEditComponent{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public artistMessage: string;
    public isEdit: boolean;
    public btnSubmitForm: string;
    public fileUpload: Array<File>;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private artistService: ArtistService,
        private userService: UserService,
        private uploadService: UploadFileService

    ){
        this.titulo = 'Editar Artista';
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','','');
        this.isEdit = true;
        this.btnSubmitForm = "Actualizar";
    }

    ngOnInit(){
        console.log('Inicializando artist-edit.component');
        //invocar a método del API para obtener un artista a partir de su _id
        this.getArtist();
    }

    getArtist(){
        console.log('recuperando artista');
        this.route.params.forEach((params: Params) =>{
            let id = params['id'];
            this.artistService.getArtist(this.token, id).subscribe(
                response =>{
                    if(response.artist){
                        
                        this.artist = response.artist;
                        console.log(this.artist);
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

    onSubmit(){
        let id = this.artist._id;
        this.artistService.editArtist(this.token, id, this.artist).subscribe(
            response =>{
                console.log(response);
                if(response.artist){
                    //this.artist = response.artist;
                    //console.log(this.artist);
                    //this.router.navigate(['/editar-artista'], this.artist._id);
                    //this.router.navigate(['/editar-artista/' + this.artist._id]);
                    this.artistMessage = "Artista actualizado correctamente";

                    //Enviar el archivo seleccionado
                    if(this.fileUpload && this.fileUpload.length > 0){
                        console.log('Enviando archivo...')
                        this.uploadService.makeFileRequest(this.url + "/upload-image-artist/" + id, [], this.fileUpload, this.token, 'image')
                        .then ((response) =>{
                            console.log('Respuesta recibida: ');
                            console.log(response);
                            //this.router.navigate(['/artistas/1']);
                            this.router.navigate(['/artista/', id]);
                        }, error => {
                            console.log("Se ha producido un error: \'" + error + "\'");
                        })
                        .catch ((Error) => {
                            console.log(Error);
                        });
                    }else{
                        //this.router.navigate(['/artistas/1']);
                        this.router.navigate(['/artista/', id]);
                    }
                }else{
                    this.artistMessage = "error en servidor";
                }
        },error => {
            this.artistMessage = "error"
        });
    }

    fileChooseEvent(fileInput: any){
        this.fileUpload = <Array<File>>fileInput.target.files;
        console.log('Archivo seleccionado');
    }
}