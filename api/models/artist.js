'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ArtistSchema = Schema({
	name: String,
	description: String,
	image: String
});

/*exportarlo como User el esquema ArtistSchema, Artist será un objeto. se guardaran en mongoDB
los objetos (como archivos) en una carpeta que se generará de forma automática y pluralizada, es decir "Artists"
*/

module.exports = mongoose.model('Artist',ArtistSchema);

