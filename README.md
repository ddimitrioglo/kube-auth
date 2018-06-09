# aws-assistant

This is a simple npm module with set of helpers for `aws-sdk`. 

> ⚠️ The repo is under refactoring 👷

## Installation

```bash
npm install aws-assistant
```

## Usage

Just include the library along to aws-sdk:

```javascript
const AWS = require('aws-sdk');
const { EmailSender } = require('aws-assistant');
```

#### EmailSender

Follow this example to send email by AWS.SES: 

```javascript
let config = {
  sourceEmail: 'qa@gmail.com:QA department',
  destinationEmails: 'support@gmail.com, admin@gmail.com:Admin',
  subject: 'Email subject',
  body: '<div>Email body</div>'
};

let sender = new ASH.EmailSender(new AWS.SES(), config);

sender.sendEmail().then(res => {
  // response 
}).catch(err => {
  // error
});
```

#### CaptchaChecker

If you want to use Google reCaptcha, just validate your captcha response and then send your email:

```javascript
const captchaSecret = 'your_google_captcha_secret_here';
const captchaResponse = 'your_google_captcha_response_here';

let checker = new ASH.CaptchaChecker(captchaSecret, captchaResponse);

checker.checkCaptcha().then(res => {
  // response from google
}).catch(err => {
  // request error
});
```

#### EmailTemplate

Let's assume that we have following email template:
 
```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
  <body>
    Hello, {{ Name }}!
  </body>
</html>
```

To render it, just do this:

```javascript
let tmpl = new ASH.EmailTemplate('message.twig', {
  Name: 'Linus Torvalds'
});

tmpl.render().then(res => {
  // rendered html response
}).catch(err => {
  // request error
});
```

## Improvements

Have an idea how to improve this module? 
Feel free to contribute or open an issue with `enhancement` label.

## License

This repository can be used under the MIT license.
> See [LICENSE][1] for more details.

[1]: https://en.wikipedia.org/wiki/MIT_License
