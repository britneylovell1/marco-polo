var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(options[, defaults])

// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//     transport: 'ses', // loads nodemailer-ses-transport
//     accessKeyId: 'AWSACCESSKEY',
//     secretAccessKey: 'AWS/Secret/key'
// });

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Brit Boo 👥" <britneyklovell@gmail.com>', // sender address
    to: 'britneyklovell@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};



app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});

});