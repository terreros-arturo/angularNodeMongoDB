'use strict'

var express = require('express');
var UserController = require('../controllers/user');


var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

/*path que podrá ser solicitado, se indica el méotodo que será ejecutado del controlador, 
en este caso el método se llama pruebas del controlador UserController*/

//md_auth_ensureAuth es un middleware que intercepta la petición antes de llamar a los métodos finales
api.get('/probando-controlador',md_auth.ensureAuth, UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/loginUser',UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

//Se exporta para que pueda ser utilizado desde otro lado
module.exports = api;

