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

    cal.createEvent({
        start: new Date(),
        end: new Date(new Date().getTime() + 3600000),
        timestamp: new Date(),
        summary: 'My Event',
        organizer: 'Sebastian Pekarek <mail@example.com>'
    });

    var invite = cal.toString();

    var mailOptions = {
        from: 'Whiteboard Mailer <whiteboardmailler@gmail.com>', // sender address
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
            res.status(500).send(error);
        }
        console.log('Message sent: ' + info.response);
        res.status(200).send('invite sent');
    });

});

module.exports = router;
