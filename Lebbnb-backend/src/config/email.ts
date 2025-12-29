import nodemailer from 'nodemailer';

// Create email transporter - Simple Gmail configuration
export const createTransporter = () => {
  const gmailUser = process.env.GMAIL_USER || 'jihadabdlghani@gmail.com';
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  
  if (!gmailPass) {
    console.warn('⚠️  GMAIL_APP_PASSWORD not configured. Email sending will fail.');
    console.warn('⚠️  Get your Gmail App Password from: https://myaccount.google.com/apppasswords');
  }
  
  // Simple Gmail configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });
  
  /* Advanced SMTP Configuration (commented out - use if you need custom settings)
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  */
};

// Send contact notification email
export const sendContactNotification = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: Date;
}) => {
  const transporter = createTransporter();
  
  const gmailUser = process.env.GMAIL_USER || 'jihadabdlghani@gmail.com';
  const companyName = process.env.COMPANY_NAME || 'Lebbnb';
  
  const mailOptions = {
    from: `"${companyName}" <${gmailUser}>`,
    to: gmailUser, // Send to your own email
    subject: `New Contact Form Submission from ${contactData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4a5568; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f7fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 5px 5px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #4a5568; margin-bottom: 5px; }
            .value { background-color: white; padding: 10px; border-left: 3px solid #4299e1; margin-top: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #718096; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${contactData.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${contactData.email}">${contactData.email}</a></div>
              </div>
              
              ${contactData.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${contactData.phone}">${contactData.phone}</a></div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${contactData.message.replace(/\n/g, '<br>')}</div>
              </div>
              
              ${contactData.createdAt ? `
              <div class="field">
                <div class="label">Submitted on:</div>
                <div class="value">${new Date(contactData.createdAt).toLocaleString()}</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This is an automated notification from your website contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
${contactData.phone ? `Phone: ${contactData.phone}\n` : ''}
Message:
${contactData.message}

${contactData.createdAt ? `Submitted on: ${new Date(contactData.createdAt).toLocaleString()}` : ''}
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // Log success
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Email sent:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Failed to send email:', error.message);
    // Don't throw error - we don't want to fail the contact submission if email fails
    return { success: false, error: error.message };
  }
};

// Send reply email to contact
export const sendContactReply = async (contactData: {
  name: string;
  email: string;
  subject: string;
  originalMessage: string;
  reply: string;
}) => {
  const transporter = createTransporter();
  
  const gmailUser = process.env.GMAIL_USER || 'jihadabdlghani@gmail.com';
  const companyName = process.env.COMPANY_NAME || 'Lebbnb';
  
  const mailOptions = {
    from: `"${companyName}" <${gmailUser}>`,
    to: contactData.email,
    replyTo: gmailUser,
    subject: `Re: ${contactData.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4299e1; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f7fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .reply-section { background-color: white; padding: 20px; margin-bottom: 20px; border-left: 4px solid #4299e1; }
            .original-message { background-color: #edf2f7; padding: 15px; margin-top: 20px; border-left: 4px solid #cbd5e0; }
            .label { font-weight: bold; color: #4a5568; margin-bottom: 10px; }
            .footer { background-color: #2d3748; color: white; padding: 20px; text-align: center; border-radius: 0 0 5px 5px; margin-top: 0; }
            .footer a { color: #63b3ed; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${companyName}</h2>
              <p style="margin: 5px 0 0 0;">Response to Your Inquiry</p>
            </div>
            <div class="content">
              <p>Dear ${contactData.name},</p>
              
              <div class="reply-section">
                <div class="label">Our Response:</div>
                <div>${contactData.reply.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="original-message">
                <div class="label">Your Original Message:</div>
                <div><strong>Subject:</strong> ${contactData.subject}</div>
                <div style="margin-top: 10px;">${contactData.originalMessage.replace(/\n/g, '<br>')}</div>
              </div>
              
              <p style="margin-top: 20px;">If you have any further questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>${companyName} Team</p>
            </div>
            <div class="footer">
              <p>This email was sent by ${companyName}</p>
              <p>Email: <a href="mailto:${gmailUser}">${gmailUser}</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Dear ${contactData.name},

Thank you for contacting ${companyName}. Here is our response to your inquiry:

${contactData.reply}

---
Your Original Message:
Subject: ${contactData.subject}
${contactData.originalMessage}
---

If you have any further questions, please don't hesitate to contact us.

Best regards,
${companyName} Team

Email: ${gmailUser}
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // Log success
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Reply email sent:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Failed to send reply email:', error.message);
    throw new Error(`Failed to send reply email: ${error.message}`);
  }
};
