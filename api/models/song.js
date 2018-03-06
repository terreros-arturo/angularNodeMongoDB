'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;


var SongSchema = schema({
	number: String,
	name: String,
	duration: String,
	file: String,
	album: {type:schema.ObjectId, ref: 'Album'}
});

/*exportarlo como User el esquema SongSchema, Song será un objeto. se guardaran en mongoDB
los objetos (como archivos) en una carpeta que se generará de forma automática y pluralizada, es decir "Songs"
*/

module.exports = mongoose.model('Song',SongSchema);
