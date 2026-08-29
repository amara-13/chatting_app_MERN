const nodemailer = require("nodemailer");
const transportor = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});
const sendOtpEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"${process.env.APP_NAME || 'Authenticator'}" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your Email verification code",
        html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
           <h2 style="color: #333; text-align: center;">Email Verification</h2>
                <p>Hello,</p>
                 <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background-color: #EEF2FF; padding: 10px 24px; border-radius: 6px; display: inline-block;">
                        ${otp}
                    </span>
                </div>
                <p style="color: #666; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            </div>`
        ,
    };
    return await transportor.sendMail(mailOptions);

};
module.exports = sendOtpEmail;

