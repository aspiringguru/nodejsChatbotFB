'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (4000));

const fs = require('fs');
const contents = fs.readFileSync('automationservices_ga_passwords.json');
var jsonContent = JSON.parse(contents);
console.log("verifyToken:", jsonContent.verifyToken);

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot running on automationservices.ga")
})

app.get('/blah', function(req, res) {
	res.send("This is blah. running on automationservices.ga")
})

let token = ""

// routes for Facebook

app.get('/webhook/', function(req, res) {
  console.log("app.get('/webhook/' start");
	if (req.query['hub.verify_token'] === jsonContent.verifyToken) {
    console.log("hub.verify_token equals jsonContent.verifyToken");
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
  console.log("hub.verify_token does not match jsonContent.verifyToken");
})


app.listen(app.get('port'), function() {
	console.log("running, listening....")
})
