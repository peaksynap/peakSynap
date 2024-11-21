import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.PEAKSYNAP_EMAIL,
    pass: process.env.PEAKSYNAP_PASSWORD
  }
});