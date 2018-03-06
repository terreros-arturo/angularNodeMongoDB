'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;


var UserSchema = schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

/*exportarlo como User el esquema UserSchema, User será un objeto. se guardaran en mongoDB
los objetos (como archivos) en una carpeta que se generará de forma automática y pluralizada, es decir "Users"
*/

module.exports = mongoose.model('User',UserSchema);

