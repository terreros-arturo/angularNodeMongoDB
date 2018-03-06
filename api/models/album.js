'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;


var AlbumSchema = schema({
	title: String,
	description: String,
	year: String,
	image: String,
	artist: {type:schema.ObjectId, ref:'Artist'} 
});
//referencia a objeto Artist identificado por su Id

/*exportarlo como User el esquema AlbumSchema, Album será un objeto. se guardaran en mongoDB
los objetos (como archivos) en una carpeta que se generará de forma automática y pluralizada, es decir "Albums"
*/

module.exports = mongoose.model('Album',AlbumSchema);