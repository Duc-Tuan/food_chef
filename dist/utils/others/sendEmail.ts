/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');

const email: string = 'junypham26@gmail.com';

export const sendEmail = async (receiver: string, htmlEmail: any) => {
  try {
    let transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email, // generated ethereal user
        pass: 'lfnovclmxvqmxvna', // generated ethereal password
      },
    });

    let detail = {
      from: email,
      to: receiver,
      subject: 'testing our nodemailer',
      html: htmlEmail,
    };

    await transporter.sendMail(detail, (err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Oke');
      }
    });
    return { status: true, mess: 'Mã code đã được gửi về email của bạn. Vui lòng kiểm tra trong email của bạn.' };
  } catch (error) {
    return error;
  }
};