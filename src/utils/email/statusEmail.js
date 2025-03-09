import nodemailer from "nodemailer";

export const sendApplicationEmail = async (email, status, jobTitle) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL, // gmail email
      pass: process.env.PASS, // app password
    },
  });

  const subject = status === "accepted" ? "Job Application Accepted" : "Job Application Rejected";
  const message =
    status === "accepted"
      ? `Congratulations! You have been accepted for the job: ${jobTitle}.`
      : `Unfortunately, your application for the job: ${jobTitle} has been rejected.`;

  await transporter.sendMail({
    from: `"job Application" <${process.env.EMAIL}>`,
    to: email,
    subject: subject,
    text: message,
  });

  console.log(`Email sent to ${email} for ${status} application.`);
};
