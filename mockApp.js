'use strict';

const express = require('express');
const morgan = require('morgan');


let app = express();

var router = express.Router();

router.get('/bar', (req, res, next) => {
    res.send('bar');
});

app.use('/', router);

app.use(morgan('dev'));

/** Controllers */
let AppStateController = require('./src/presentation/appState/appState.Controller')(app, '/appState');
let MachineStateController = require('./src/presentation/machineState/machineState.Controller')(app, '/machineState');
let AppStatusController = require('./src/presentation/appStatus/appStatus.Controller')(app, '');


app.use('/', AppStateController);
app.use('/', MachineStateController);
app.use('/', AppStatusController);

app.set('view engine', 'ejs');

let server = app.listen(3000, () => {

    let host = server.address().address;
    let port = server.address().port;
});

module.exports = app;
