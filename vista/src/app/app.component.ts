import { Component } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.services'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'Musify';
  //Usuario logueado
  public user: User;
  //Propiedad para saber si el usuario está logueado
  public identity;
  //token generado al loguearse un usuario
  public token;

  public errorMessage;

  public registroUsuario: User;

  public mensajeRegistro;

  public url: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER','',false);
    this.registroUsuario = new User('','','','','','ROLE_USER','',false);
    this.url = GLOBAL.url;
  }

  ngOnInit(){  
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
/*
    console.log('identity: \'')
    console.log(this.identity);
    console.log('\'token: \'')
    console.log(this.token);
    console.log('\'');
*/
  }

  public onSubmit(){
    console.log(this.user);
    this._userService.signup(this.user, null).subscribe(
      response => {
        console.log(response);
        let identity = response.user;
        this.identity = identity;
        if(!this.identity._id){
          alert('Error en la identificación del usuario');
        }else{
          //Crear sesión en localstorage
          localStorage.setItem('identity', JSON.stringify(identity));
          //recuperar token
          this._userService.signup(this.user, true).subscribe(
            response => {
              console.log(response);
              let token = response.token;
              this.token = token;
              if(this.token.length <= 0){
                alert('no se ha creado la sesión del usuario correctamente');
              }else{
                console.log(token);
                console.log(identity);
                localStorage.setItem('token', token);
              }
            },error => {
              let errorMessage = <any> error;
              if(errorMessage != null){
                let body = JSON.parse(errorMessage._body);
                this.errorMessage = body.message;
                console.log(errorMessage);
                this.user = new User('','','','','','ROLE_USER','',false);
              }
          });
        }
      },error => {
        let errorMessage = <any> error;
        
        if(errorMessage != null){
          let body = JSON.parse(errorMessage._body);
          this.errorMessage = body.message;
          console.log(errorMessage);
          this.user = new User('','','','','','ROLE_USER','',false);
        }
    });
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.user = new User('','','','','','ROLE_USER','',false);
    this.router.navigate(['/']);
  }

  registerSubmit(){
    console.log('Registrando usuario nuevo...');
    console.log(this.registroUsuario);
    this._userService.register(this.registroUsuario).subscribe(
      
      response =>{
        let user = response.user;
        if(user._id){
          console.log('regreso de la invocación al registro del usuario');
          this.mensajeRegistro = 'Usuario registrado correctamente';
          this.registroUsuario = new User('','','','','','ROLE_USER','',false);
        }else{
          this.mensajeRegistro = 'Se ha producido un error al registrar el usuario';
        }
      },error =>{
        let mensajeRegistro = <any>error;
        if(mensajeRegistro != null){
          var jsonBody = JSON.parse(mensajeRegistro._body);
          this.mensajeRegistro = jsonBody.message;
          console.log(error);
        }
      }, ()=> {
        console.log('Se terminó de procesar el registro de usuario correctamente');
      }
    );
  }

}
