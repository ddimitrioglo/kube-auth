const EmailSender = require('./src/EmailSender');
const EmailTemplate = require('./src/EmailTemplate');
const CaptchaChecker = require('./src/CaptchaChecker');

module.exports = {
  EmailSender: EmailSender,
  EmailTemplate: EmailTemplate,
  CaptchaChecker: CaptchaChecker,
};
