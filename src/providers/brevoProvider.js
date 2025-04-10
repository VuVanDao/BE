/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const SibApiV35dk = require("@getbrevo/brevo");
import { env } from "~/config/environment";

let apiInstance = new SibApiV35dk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  let sendSmtpEmail = new SibApiV35dk.SendSmtpEmail();
  //nguoi gui
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME,
  };
  //den
  sendSmtpEmail.to = [{ email: recipientEmail }];
  //tieu de
  sendSmtpEmail.subject = customSubject;
  //noi dung
  sendSmtpEmail.htmlContent = htmlContent;

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const BrevoProvider = {
  sendEmail,
};
