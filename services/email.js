import {createTransport} from "nodemailer";

// Create the tranporter once
const transport = createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4c2169d04c1885",
    pass: "e2a1696c165f32",
  },
});

export const sendEmail = async (options) => {
  // Email options
  const emailOptions = {
    from: "support<hrc@alumni.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transport.sendMail(emailOptions).catch(err => console.log("Email error", err));
};
