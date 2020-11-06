'use strict';

const { twig } = require('twig');

class Util {
  static async render(template, context = {}) {
    if (!template) return '';
    const tmpl = twig({ data: template });

    return tmpl.render(context);
  }

  static hostName() {
    return 'kube.auth.host';
  }

  static extensionId() {
    return 'eopgnbljekjdehngoiejkihkcmnjeghf';
  }
}

module.exports = Util;
