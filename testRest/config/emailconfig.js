const nodemailer = require('nodemailer');

function configmail(){
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
      service: '"Outlook365"',
      auth: {
          user: 'juanbasdel@udenar.edu.co',
          pass: '1085301712Jgbd'
      }
  });

  return transporter;
}

module.exports.configmail = configmail;
