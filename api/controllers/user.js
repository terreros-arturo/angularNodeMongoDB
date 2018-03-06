'use strict'

var User = require('../models/user');
//encriptar/desencriptar
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
//Archivos de sistena
var fs = require('fs');
//rutas
var path = require('path');




function pruebas(req, res){
	res.status(200).send({
		message:'probando controller user.js'
	});
}

function saveUser(req,res){
	var user = new User();
	//recuperar todas las variables que nos llegan por request
	var params = req.body;

	console.log(params);
	//set a atributos de objeto user
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	//validar entrada de password
	if(params.password){
		//encriptar contraseña y guardar información
		console.log('Password no vacio');
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			console.log('user.name: \'' + user.name + '\'');

			if(user.name != null && user.surname != null && user.email != null){
				//se guarda
				user.save((err,userStored)=>{
					if(err){
						console.log('ocurrió un error en el registro de usuario, favor de contactar con el administrador')
						res.status(500).send({message:'Ocurrió un error en el, favor de contactar con el administrador'});
					}else{
						if(!userStored){
							res.status(404).send({message:'No se logró guardar el usuario'});
						}else{
							//res.status(200).send({message:'Se ha registrado correctamente el usuario'});
							res.status(200).send({user: userStored});
						}
					}

				});
				console.log('Registro guardado');
			}else{
				res.status(200).send({message:'*campos requeridos'});
			}
		});
	}else{
		res.status(500).send({message:'Se debe ingresar contraseña'});
	}


}


function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	if(email && password){
		//Buscar en base de datos
		User.findOne({email:email.toLowerCase()}, (err,user) => {
			if(err){
				res.status(500).send({message:'Error insesperado en a búsqueda del usuario'});
			}else{
				if(!user){
					res.status(404).send({message:'Usuario o contraseña inválidos'});
				}else{
					//validar contraseña
					bcrypt.compare(password, user.password,function(err, check){
						if(check){
							//Usuario y password validos
							//si se recibe bandera getHash en true, se devuelve token de sesión
							if(params.gethash){
								//devoler un token de jwt
								var token = jwt.createtoken(user);
								//console.log('devolviendo token: \'' + token + '\'');
								res.status(200).send({token:token});
							}else{
								//se devuelve el usuario encontrado
								user.password = '';
								res.status(200).send({user});
							}
							
						}else{
							res.status(404).send({message:'Usuario o password incorrecto'});
						}
					});
				}
			}
		});
	}else{
		res.status(404).send({message:'Usuario o password incorrecto'});
	}
}


function updateUser(req, res){
	//se obtiene el id del usuario desde la url 
	var userId = req.params.id;
	
	var user = req.body;

	//console.log('usuario recibido\n' + user);
	if(userId == req.user.sub){
		User.findByIdAndUpdate(userId, user,{'new': true}, (err, userUpdated) =>{
			if(err){
				console.log(err);
				res.status(500).send({message:'Error al actualizar los datos del usuario'});
			}else{
				if(!userUpdated){
					res.status(404).send({message:'No se logró actualizar los datos de usuario'});
				}else{
					console.log('usuario actualizado');
					console.log(userUpdated);
					userUpdated.password = '';
					res.status(200).send({user:userUpdated});
				}
			}
		});
	}else{
		res.status(500).send({message:'Acceso no permitido'});
	}
}



function uploadImage(req,res){
	//recibimos id de url
	var userId = req.params.id;
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
			User.findByIdAndUpdate({_id:userId},{image:fileName},{'new': true},(err,userUpdated)=>{
				if(err){
					res.status(500).send({message:'Error al cargar archivo de imagen de usuario'});
				}else{
					res.status(200).send({
						image: fileName, 
						user:userUpdated
					});
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
	var pathFile = './uploads/users/' + imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message:'No existe el archivo'});
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};
