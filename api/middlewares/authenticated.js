'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';


exports.ensureAuth= function(req, res, next){
	//validar encabezado
	if(!req.headers.authorization){
		//console.log('La petición no tiene la cabecera de autenticación');
		return res.status(403).send({message:'La petición no tiene la cabecera de autenticación'});
	}else{
		//comprobar el token
		var token = req.headers.authorization.replace(/['"]+/g,'');
		console.log('token recibido: \'' + token + '\'');
		try{
			//se decodifica el token
			console.log('secret: \'' + secret + '\'');
			var payload = jwt.decode(token, secret);
			//validar el tiempo de expiración del token
			console.log('Fecha de expiración de token: ');
			console.log(payload.expi);
			console.log('Hora actual: ');
			let today = moment().unix();
			console.log(today);
			if(payload.expi <= moment().unix()){
				return res.status(401).send({message:'El token ha expirado'});
			}else{
				console.log('Token exitoso');
			}
		}catch(e){
			console.log('\nSe ha producido un error: ');
			console.log(e);
			return res.status(404).send({message:'Token no válido'});
		}

		/**Se agrega un objeto user que son los datos del usuario decodificados 
		 * para que pueda ser utilizado en caso de ser necesario en un método posterior al middleware
		 */
		req.user = payload;
		next();
	}
};