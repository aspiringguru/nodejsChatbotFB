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
console.log("accessToken:", jsonContent.accessToken);

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot running on facebook.automationservices.host")
})

app.get('/blah', function(req, res) {
	res.send("This is blah. running on facebook.automationservices.host")
})

let token = ""

// routes for Facebook

app.get('/webhook/', function(req, res) {
  console.log("app.get('/webhook/' start");
  console.log("req.query['hub.verify_token'] = ", req.query['hub.verify_token']);
  console.log("jsonContent.verifyToken = ", jsonContent.verifyToken);
	if (req.query['hub.verify_token'] === jsonContent.verifyToken) {
    console.log("hub.verify_token equals jsonContent.verifyToken");
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
  console.log("hub.verify_token does not match jsonContent.verifyToken");
})

app.post('/webhook/', function(req, res) {
  console.log("app.post('/webhook/' start");
	let messaging_events = req.body.entry[0].messaging
  console.log("messaging_events.length = ", messaging_events.length);
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
    console.log("event:", event);
    console.log("sender:", sender);
		if (event.message && event.message.text) {
      console.log("event.message && event.message.text = true");
			let text = event.message.text
      console.log("event.message.text = ", event.message.text)
			sendText(sender, "Text echo: " + text.substring(0, 100))
		} else {
      console.log("event.message && event.message.text = false");
    }
	}
	res.sendStatus(200)
});

function sendText(sender, text) {
	let messageData = {text: text}
  console.log("sendText : sender = ", sender);
  console.log("sendText : text = ", text);
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: jsonContent.accessToken},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error");
      console.log("error: ", error);
      console.log("response : ", response);
      console.log("body : ", body);
		} else if (response.body.error) {
			console.log("response body error")
      console.log("error: ", error);
      console.log("response : ", response);
      console.log("body : ", body);
		}
	})
}


app.listen(app.get('port'), function() {
	console.log("running, listening....")
});
