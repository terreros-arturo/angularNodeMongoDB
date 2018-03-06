'use strict'

/*para las cargas de archivos*/
var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


var moongosePaginate = require('mongoose-pagination');

function getAlbum(req, res){
	var idAlbum = req.params.id;
	/*populate recupera la información completa del documento asociado, en este caso del artista asociado al album por su id. 
	El funcionamiento es similar a un join
	*/
	Album.findById(idAlbum).populate({path:'artist'}).exec((err,album)=>{
		if(err){
			res.status(500).send({
				message:"Se ha producido un error inesperado al buscar album, contacte con su admnistrador"
			});
		}else{
			if(!album){
				res.status(404).send({message:'album no encontrado'});	
			}else{
				//Se recupera el album con la información completa del artista relacionado
				console.log(album)
				res.status(200).send({album});
			}
		}

	});
}

function saveAlbum(req,res){
	var album = new Album();
	var parametros = req.body;

	album.title = parametros.title;
	album.description = parametros.description;
	album.year = parametros.year;
	album.image = 'null';

	album.artist = parametros.artist;

	if(album.title == '' && album.description == '' && album.year == '' && album.artist == ''){
		console.log('Parametros vacios');
		res.status(404).send({
			message:"* campos obligatorios"
		});
	}else{
		album.save((err, albumSave)=>{
			if(!err){
				if(albumSave){
					//Se guardó correctamente
					res.status(200).send({album:albumSave});	
				}else{
					res.status(404).send({
						message:"no se guardo album, contacte con su admnistrador"
					});
				}

			}else{
				res.status(500).send({
					message:"Se ha producido un error inesperado al guardar album, contacte con su admnistrador"
				});
			}
		});
	}
}


function getAlbums(req,res){
	var idArtist = req.params.artist;

	var find;
	if(idArtist){
		//Filtrar por artista
		find = Album.find({artist:idArtist}).sort('year');
	}else{
		find = Album.find().sort('title');
	}

	find.populate({path: 'artist'}).exec((err,albums) => {
		if(err){
			console.log("error 500 en getAlbums");
			res.status(500).send({message:"Se ha producido un error inesperado, contacte con su admnistrador"});
		}else{
			if(albums){
				res.status(200).send({					
					albums: albums
				});
			}else{
				res.status(404).send({message:"No se encontraron albums"});
			}
		}
	});
}


function updateAlbum(req,res){
	var idAlbum = req.params.id;

	var album = req.body;

	if(idAlbum){
		Album.findByIdAndUpdate(idAlbum, album, {new: true},(err, albumUpdate) => {
			if(err){
				res.status(500).send({message:"Se ha producido un error inesperado, contacte con su admnistrador"});
			}else{
				if(!albumUpdate){
					res.status(404).send({message:"album no actualizado con id \'" + idAlbum + "\'"})
				}else{
					res.status(200).send({album: albumUpdate});
				}
			}
		});
	}else{
		res.status(404).send({message:"album no encontrado"})
	}
}


function deleteAlbum(req,res){
	var idAlbum = req.params.id;
	if(idAlbum){
		Album.findByIdAndRemove(idAlbum, (err,albumDeleted)=>{
			if(err){
				res.status(500).send({message:"Se ha producido un error inesperado, contacte con su admnistrador"});
			}else{
				if(!albumDeleted){
					res.status(404).send({message:"No se ha podido eliminar el album"});
				}else{
					//res.status(200).send(message:"Album eliminado correctamente");
					console.log("Album eliminado correctamente");
					//Eliminamos sus canciones
					Song.find({album:idAlbum}).remove((err,songDeleted)=>{
						if(err){
							res.status(500).send({message:"Se ha producido un error inesperado, contacte con su admnistrador"});
						}else{
							if(!songDeleted){
								console.log('No se eliminaron canciones relacionadas al album');
								res.status(404).send({message:"No se eliminaron canciones del album"});
							}else{
								res.status(200).send({album:albumDeleted});
							}
						}
					});
				}
			}
		});

	}else{
		res.status(404).send({message:"album no encontrado"})
	}
}


function uploadImage(req,res){
	//recibimos id de url
	var idAlbum = req.params.id;
	var fileName = "No subido";

	//Se valida que haya archivos
	if(req.files){
		//image es el name del campo file
		if(req.files.image.path){
			var file_path = req.files.image.path;
			console.log('file_path: \'' + file_path + '\'');
			var fileSplit = file_path.split('\\');

			fileName = fileSplit[2]
			var exp_split = fileName.split('\.');

			var file_ext = exp_split[exp_split.length - 1];

			console.log(fileSplit);
			console.log(fileName);
			console.log('Extension : \'' + file_ext + '\'');


			//validar extensión
			if(file_ext== 'png' || file_ext== 'jpg' || file_ext== 'gif'){
				Album.findByIdAndUpdate({_id:idAlbum},{image:fileName},{new: true}, (err,albumUpdated)=>{
					if(err){
						res.status(500).send({message:'Error al cargar archivo de imagen de album, consulte con su admnistrador'});
					}else{
						if(!albumUpdated){
							res.status(404).send({message:'Album no encontrado'});	
						}else{
							res.status(200).send({album:albumUpdated});
						}
					}
				});
			}else{
				res.status(200).send({message:'Extensión de archivo no permitida'});
			}
		}else{
			res.status(404).send({message:"imagen no recibida"});
		}
	}else{
		res.status(200).send({message:'No se recibió archivo'});
	}

}


function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/albums/' + imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message:'No existe el archivo: \'' + imageFile + '\''});
		}
	});
}


module.exports={
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}