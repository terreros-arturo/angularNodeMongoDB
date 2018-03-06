'use strict'

/*para las cargas de archivos*/
var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


var moongosePaginate = require('mongoose-pagination');

function getArtist(req, res){
	var idArtist = req.params.id;

	Artist.findById(idArtist,(err,artist)=>{
		if(!err){
			if(artist){
				//Artista encontrado
				console.log('Artista recuperado exitosamente: ' + artist);
				res.status(200).send({artist});	
			}else{
				//No se encontro artista
				console.log('No se encontró el artista con id \'' + idArtist + '\'');
				res.status(404).send({
					message:'recurso no encontrado'
				});	
			}
		}else{
			console.log('Error 500, se ha producido un error inesperado');
			res.status(500).send({
				message:"Se ha producido un error inesperado al buscar artista, contacte con su admnistrador"
			});
		}
	});

	
}


function saveArtist(req, res){
	var parametros = req.body;

	//creamos objeto de tipo artista
	var artist = new Artist();

	artist.name = parametros.name;
	artist.description = parametros.description;
	artist.image = 'null';

	if(artist.name && artist.description){
		artist.save((err,artistStored)=>{
			if(!err){
				if(artistStored){
					//Se guardo correctamente
					console.log('Artista guardado correctamente');
					console.log(artistStored);
					res.status(200).send({
						artist:artistStored
					});

				}else{
					//No se guardo el artista
					console.log('Error 404: artistStored vacio');
					res.status(404).send({
						message:"No se guardó correctamente el artista"
					});
				}
			}else{
				console.log('Error 500, error inesperado');
				res.status(500).send({
					message:"Se ha producido un error inesperado al intentar guardar artista, contacte con su admnistrador"
				});
			}
		});
	}else{
		res.status(200).send({
			message:"* campos requeridos"
		});
	}
}

function getArtists(req,res){
	var page = 1;

	page = req.params.page?req.params.page:1;

	var itemsPerPage = 5

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
		if(err){
			res.status(500).send({
				message:"Se ha producido un error inesperado al intentar recuperar la pagina " + page + ", contacte con su admnistrador"
			});
		}else{
			if(artists && artists.length > 0){
				return res.status(200).send({
					total: total,
					artists: artists
				});
			}else{
				res.status(404).send({
					message:"No se encontraron elementos en la pagina \'" + page + "\'"
				});
			}

		}
	});
}


function updateArtist(req, res){
	var idArtist = req.params.id;
	var params = req.body;


	if(idArtist){
		Artist.findByIdAndUpdate(idArtist, params, (err, artistaUpdated)=>{
			if(err){
				res.status(500).send({
					message:"Se ha producido un error inesperado al intentar actualizar el artista, contacte con su admnistrador"
				});
			}else{
				if(artistaUpdated){
					console.log('Artista actualizado');
					res.status(200).send({
						artist: artistaUpdated
					});
				}else{
					res.status(404).send({
						message:"No pudo ser actualizado el artista"
					});
				}
			}
		});
	}else{
		res.status(404).send({
			message:"id obligatorio"
		});
	}
}

function deleteArtist(req, res){
	var idArtist = req.params.id;
	Artist.findByIdAndRemove(idArtist, (err,artistRemoved)=>{
		if(err){
				res.status(500).send({
					message:"Se ha producido un error inesperado al intentar eliminar el artista, contacte con su admnistrador"
				});
			}else{
				if(!artistRemoved){
					res.status(404).send({
						message:"No pudo ser eliminado el artista"
					});
				}else{
					//Eliminado correctamente, se eliminan los registros relacionados en cascada
					console.log(artistRemoved);

					//Eliminar registro relacionados
					Album.find({artist:artistRemoved._id}).remove((err,albumRemoved)=>{
						if(err){
							res.status(500).send({
								message:"Se ha producido un error inesperado al intentar eliminar registros de album relacionados al artista, contacte con su admnistrador"
							});
						}else{
							if(!albumRemoved){
								res.status(404).send({
									message:"No hay album relacionado al artista eliminado"
								});
							}else{
								//Album(es) eliminados correctamente

								//Eliminar canciones
								Song.find({album:albumRemoved._id}).remove((err,songRemoved)=>{
									if(err){
										res.status(500).send({
											message:"Se ha producido un error inesperado al intentar eliminar canciones relacionadas a los albumes del artista, contacte con su admnistrador"
										});
									}else{
										if(!songRemoved){
											res.status(404).send({
												message:"No hay canciones relacionados a los albunes del artista eliminado"
											});
										}else{
											//eliminados correctamente
											res.status(200).send({artist: artistRemoved});
										}
									}

								});

							}
						}
					});
				}
			}
	});
}


function uploadImage(req,res){
	//recibimos id de url
	var idArtist = req.params.id;
	var fileName = "No subido";

	
	//Se valida que haya archivos
	if(req.files){
		//image es el name del campo file
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
			Artist.findByIdAndUpdate({_id:idArtist},{image:fileName},{new: true},(err,artistUpdated)=>{
				if(err){
					res.status(500).send({message:'Error al cargar archivo de imagen de artista, consulte con su admnistrador'});
				}else{
					if(!artistUpdated){
						res.status(404).send({message:'Artista no encontrado'});	
					}else{
						res.status(200).send({artist:artistUpdated});
					}
				}
			});
		}else{
			res.status(200).send({message:'Extensión de archivo no permitida'});
		}
	}else{
		res.status(200).send({message:'No se recibió archivo'});
	}

}


function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/artist/' + imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message:'No existe el archivo'});
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};

