var express = require('express');

var app = express();

//to have access to the public directory
var myParser = require("body-parser");
var fs = require("fs");
var path    = require("path");
var locale = require("locale")
, supported = ["en", "en_US","es", "es-US"]
, default1 = "es";
const accountSid = 'AC0f26788e366eced1740d45a34e5c8132'; 
    const authToken = '27f004c23a0ce69af4e950a2cec3b21e'; 
    const client = require('twilio')(accountSid, authToken); 

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

app.post('/prueba', (req,res) => 
{
    

});

app.post('/whatsapp_msg', (req,res) => 
{
    console.log(req.body.mensaje);
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