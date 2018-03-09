'use strict'

/*para las cargas de archivos*/
var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var moongosePaginate = require('mongoose-pagination');


/*Obtener una canción a partir de su id, devuelve el registro de la canción junto con la información del album

*/
function getSong(req,res){
	var idSong = req.params.id;
	console.log('idSong \'' + idSong + '\'');
	Song.findById(idSong).populate({path:'album'}).exec((err,song) =>{
		if(err){
			console.log('Error 500 producido en la búsqueda de canción');
			res.status(500).send({message:"Se ha producido un error en la busqueda de canción, contacte con su administrador"});
		}else{
			if(song){
				res.status(200).send({song});
			}else{
				res.status(404).send({message:"Canción con encontrada"});
			}
		}
	});
	//res.status(200).send({message:"Controlador de cancion"});
}


/*
Registrar canción
*/
function saveSong(req, res){
	var song = new Song();
	var parametros = req.body;
	song.number = parametros.number;
	song.name = parametros.name;
	song.duration = parametros.duration;
	song.file = null;
	song.album = parametros.album;


	song.save((err,songSaved)=>{
		if(err){
			console.log('Error 500 en guardado de canción');
			res.status(500).send({message:"Se ha producido un error, comuníquese con el administrador"})
		}else{
			if(songSaved){
				res.status(200).send({song: songSaved});
			}else{
				res.status(404).send({message:"No se registro la canción"})
			}
		}
	});
}


/*
Recupera todas las canciones ya sea clasificado por un album o todas ordenadas por número de pista. 
Los datos devueltos son: canción, album y artista

 */
function getSongs(req, res){
	var idAlbum = req.params.album;

	var query;
	if(idAlbum){
		//mostrar solo las canciones del album con id idAlbum
		query = Song.find({album:idAlbum}).sort('number');

	}else{
		//se muestran todas las canciones
		query = Song.find().sort('number');
	}

	//populate es similar join de SQL para extraer los datos de otra tabla
	query.populate({
		path: 'album',
		model: 'Album', //Se especifica el modelo de donde obtendrá la información
		populate:{
			path:'artist',
			model: 'Artist'
		}
	}).exec((err, songs)=>{
		if(err){
			console.log('Error 500 al buscar canciones');
			res.status(500).send({message: "se ha producido un error, contacte con su administrador"})
		}else{
			if(songs){
				res.status(200).send({songs});
			}else{
				res.status(404).send({message:"No se encontraron canciones"});
			}
		}
	});
}


function updateSong(request, response){
	var idSong = request.params.id;
	var songForUpdate = request.body;

	Song.findByIdAndUpdate(idSong,songForUpdate, {new: true}, (err,songUpdate)=>{
		if(err){
			console.log('error 500 al actualizar registro de canción');
			response.status(500).send({message:"Se ha producido un error, contacte con su administrador"});
		}else{
			if(songUpdate){
				response.status(200).send({song:songUpdate});
			}else{
				response.status(404).send({message:"No se pudo actualizar la canción"});
			}
		}
	});
}


/*Elimina una canción a partir de su id*/
function deleteSong(request, response){
	var idSong = request.params.id;

	Song.findByIdAndRemove(idSong,(err,songDeleted)=>{
		if(err){
			console.log('Error producido al eliminar canción')
			response.status(500).send({message:"Se ha producido un error en la eliminación de la canción, consulte con su administrador"});
		}else{
			if(songDeleted){
				response.status(200).send({song: songDeleted});
			}else{
				console.log("No se eliminó canción \'" + idSong + "\', revise que exista la canción");
				response.status(404).send({message:"No se logró eliminar la conción"});
			}
		}
	});
}


function uploadAudio(request,response){
	//recibimos id de url
	var idSong = request.params.id;
	var fileName = "No subido";

	//Se valida que haya archivos
	if(request.files){
		//image es el name del campo file
		if(request.files.file.path){
			var file_path = request.files.file.path;
			console.log('file_path: \'' + file_path + '\'');
			var fileSplit = file_path.split('\\');

			fileName = fileSplit[2]
			var exp_split = fileName.split('\.');

			var file_ext = exp_split[exp_split.length - 1];

			console.log(fileSplit);
			console.log(fileName);
			console.log('Extension : \'' + file_ext + '\'');


			//validar extensión
			if(file_ext== 'mp3' || file_ext== 'ogg'){
				Song.findByIdAndUpdate({_id:idSong},{file:fileName},{new: true},(err,songUpdated)=>{
					if(err){
						response.status(500).send({message:'Error al cargar archivo de audio de canción, consulte con su admnistrador'});
					}else{
						if(!songUpdated){
							response.status(404).send({message:'Canción no encontrada'});	
						}else{
							response.status(200).send({song:songUpdated});
						}
					}
				});
			}else{
				response.status(200).send({message:'Extensión de archivo no permitida'});
			}
		}else{
			response.status(404).send({message:"archivo de audio no recibido"});
		}
	}else{
		response.status(200).send({message:'No se recibió archivo'});
	}

}


function getAudioSong(req, res){
	var songFile = req.params.songFile;
	var pathFile = './uploads/songs/' + songFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message:'No existe el archivo: \'' + songFile + '\''});
		}
	});
}
module.exports = {
	getSong,
	saveSong,
	getSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadAudio,
	getAudioSong
};