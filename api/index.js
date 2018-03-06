//utilizar instrucciones de nuevo estandar
'use strict'


//cargar libreria mongoose
var mongoose = require('mongoose');


//importar el archivo app
var app = require('./app');

var port = process.env.PORT || 3977;


//Eliminar warning de mpromise
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso_mean2',{useMongoClient: true}, (err,res)=>{
	if(err){
		throw err;
	}else{
		console.log('Conexión con la BD correcta');
		app.listen(port,function(){
			console.log('Servidor de API REST funcionando por puerto: ' + port);
		});
	}

});
