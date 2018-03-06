'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';


exports.createtoken = function(user){
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),//hora actual en formato unix
		expi: moment().add(30,'hour').unix()//hora actual mas 30 dias en formato unix
	};
	console.log('codificando:');
	console.log(payload);
	return jwt.encode(payload, secret);
};
