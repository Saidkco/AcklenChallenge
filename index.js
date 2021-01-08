var express = require('express');

var app = express();

//to have access to the public directory
var myParser = require("body-parser");
var fs = require("fs");
var path    = require("path");
var locale = require("locale")
, supported = ["en", "en_US","es", "es-US"]
, default1 = "es";

//when have a request to the root load the home on the webside
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(myParser.urlencoded({extended : true}));

//to enable comunication when its hosting
app.use(express.static(__dirname + '/public'));
app.use(locale(supported, default1));
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', (req,res) => {});

//The Whatsapp function to send the message
app.post('/whatsapp_msg', (req,res) => 
{
    client.messages 
    .create({ 
       body: req.body.mensaje, 
       from: 'whatsapp:+14155238886',       
       to: 'whatsapp:+50432145240' 
     }) 
    .then(message => res.send("correcto")).catch(error => console.log(error.message))
    .done();

});


app.listen(process.env.PORT || 2020);