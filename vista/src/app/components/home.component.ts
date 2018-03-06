import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
    selector: 'home',
    templateUrl: '../views/home.html',
})



export class HomeComponent{
    public titulo: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ){
        this.titulo = 'Bienvenido';
    }

    ngOnInit(){
        console.log('Inicializando home.component');
    }
}