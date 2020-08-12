const app = require('express')();
var lamfoController = require('../controllers/lamfo');

//app.get('/', lamfoController.index);
app.get('/top10', lamfoController.getTop10);
app.get('/posiciones/:torneo', lamfoController.getPosiciones);
app.get('/ultima/:torneo', lamfoController.getUltimaFecha);

module.exports = app;