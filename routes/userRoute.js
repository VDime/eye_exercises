module.exports = function(passport){

    var express = require('express');
    var router = express.Router();
    var UserController = require('../controllers/userController')();

    router.post('/login', UserController.login);

    router.post('/', UserController.signup);
    
    return router;
};