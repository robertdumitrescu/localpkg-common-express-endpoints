"use strict";

const express = require('express');
const path = require('path');
const morgan = require('morgan');


let app = express();

var router = express.Router();

router.get("/bar", function(req,res,next){
    res.send('bar');
});

app.use("/",router);



app.use(morgan('dev'));

/** Controllers */
let ContentsCreateController = require('./src/presentation/appInfo/appInfo.Controller')(app);
app.use('/', ContentsCreateController);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

let server = app.listen(3000, function () {

    let host = server.address().address;
    let port = server.address().port;
});

module.exports = app;