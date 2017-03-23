'use strict';

import htmlToText from 'html-to-text';

export class EmailSender {

  /**
   * @param ses
   * @param params
   */
  constructor(ses, params) {
    this._ses = ses;
    this._params = params;
  }

  /**
   * Send email with init parameters
   * @returns {Promise}
   */
  sendEmail() {
    let html = this._params.body;
    let params = {
      Source: this._buildContact(this._params.sourceEmail),
      Destination: {
        ToAddresses: this._params.destinationEmails.split(',').map(contact => this._buildContact(contact)),
      },
      Message: {
        Subject: {
          Data: this._params.subject
        },
        Body: {
          Html: {Data: html},
          Text: {Data: htmlToText.fromString(html)}
        }
      }
    };

    return this.ses.sendEmail(params).promise();
  }

  /**
   * Build contact
   * @param contact
   * @returns {string}
   * @private
   */
  _buildContact(contact) {
    let parts = contact.split(':');
    let email = parts[0].trim();
    let name = (parts[1]) ? parts[1].trim() : '';

    return (name !== '') ? `${name} <${email}>` : email;
  }

  /**
   * Get AWS.SES
   * @returns {*}
   */
  get ses() {
    return this._ses;
  }

}
