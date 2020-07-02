const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
  console.log('CHEN');
  //create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //define email options

  const mailOptions = {
    from: 'chen <chenkamin@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  console.log(mailOptions);
  console.log(transporter);
  //send the mail
  await transporter.sendMail(mailOptions);
};
