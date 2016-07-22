var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://whiteboardtest1%40gmail.com:Wh1t3board@smtp.gmail.com');
var ical = require('ical-generator');

/* GET invite page. */
router.get('/', function(req, res, next) {
    res.render('invite');
});

router.post('/', function (req, res, next) {

    var hostName = req.headers.host;
    var roomNumber = req.body.roomNumber;
    var link = "<a href=/" + hostName + "/board/" + roomNumber + "/>here</a>";
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var inviteeEmailAddresses = req.body.emailAddresses;


    var cal = ical();

    cal.createEvent({
        start: startDate,
        end: endDate,
        timestamp: new Date(),
        summary: 'Whiteboard Meeting',
        organizer: 'Michael Kemp <mail@example.com>'
    });

    var invite = cal.toString();

    var mailOptions = {
        from: 'Whiteboard Mailer <whiteboardmailler@gmail.com>',
        to: inviteeEmailAddresses, // list of receivers
        subject: 'Whiteboard Meeting Request',
        attachments: [
            {
                filename: 'invite.ics',
                content: invite,
                contentType: 'text/calendar'
            }
        ],

        html: "<b>Please join my meeting at room number " + roomNumber +  " you can do this by visiting the Whiteboard Room in your office and entering the room number or from your desktop by clicking the following link " + link + "<\/b>"
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
