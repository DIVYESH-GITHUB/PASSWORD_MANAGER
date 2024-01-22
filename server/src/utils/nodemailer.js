import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: {
      name: "Password Manager",
      address: process.env.USER,
    },
    to: email,
    subject: "Email Verification for Password manager",
    html: `
    <p>Dear User,</p>
    <p>Thank you for registering with Password manager. Please click the link below to verify your email:</p>
    <a href="${process.env.BASE_URL}/users/verify/${verificationToken}">${process.env.BASE_URL}/users/verify/${verificationToken}</a>
    <p>Best regards,<br>Password manager Team</p>
  `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
