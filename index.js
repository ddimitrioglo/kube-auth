// var cc = require('./lib/CaptchaChecker');

// var test = new cc.CaptchaChecker('secret', 'asdsad');
// var req = test.checkCaptcha();

// req.then(function (res) {
//   console.log(res);
// });


var es = require('./lib/EmailSender').EmailSender;

var test = new es('asdsad', {
  sourceEmail: 'qa@gmail.com:QA department',
  destinationEmails: 'support@gmail.com, admin@gmail.com:Admin',
  subject: 'Email subject',
  body: '<div>Email body</div>'
});

console.log(test.sendEmail());
