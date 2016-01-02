var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('***REMOVED***');
var ical = require('ical-generator');



/* GET invite page. */
router.get('/', function(req, res, next) {
    res.render('invite');
});

router.post('/', function (req, res, next) {

    var cal = ical();

    var event = cal.createEvent({
        start: new Date(),
        end: new Date(new Date().getTime() + 3600000),
        timestamp: new Date(),
        summary: 'My Event',
        organizer: 'Sebastian Pekarek <mail@example.com>'
    });

    var invite = cal.toString();

    var mailOptions = {
        from: 'Fred Foo ✔ <technoir08@gmail.com>', // sender address
        to: '***REMOVED***, ***REMOVED***', // list of receivers
        subject: 'Hello ✔', // Subject line
        attachments: [
            {
                filename: 'invite.ics',
                content: invite,
                contentType: 'text/calendar'
            }
        ],

        html: '<b>Hello world ✔</b>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });

    next();
});

module.exports = router;
