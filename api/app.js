'use strict'


//REST
var express = require('express');
//Serializador
var bodyParser = require('body-parser');


var app = express();


//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');


//configuración de bodyparser (serializador)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configuración de middleware de cabeceras http
app.use((req, res, next) => {
	//Acceso a todo el dominio
	res.header('Access-Control-Allow-Origin','*');
	//*permitir ajax
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	//Se habilitan los métodos get, post, options, put y delete
	res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
	next();
});

//rutas base
app.use('/api',user_routes);
app.use('/api',artist_routes);
app.use('/api',album_routes);
app.use('/api',song_routes);

/*
app.get('/pruebas', function(req,res){
	res.status(200).send({message:'Hola Mundo Node.js'})
});*/

//utilizar express en fuentes que utilicen el archivo app.js
module.exports = app