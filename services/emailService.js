const nodemailer=require('nodemailer')

async function sendMail(from,to,subject,text,html ){
    let transporter=nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
    })
    try {
        let info = await transporter.sendMail({
          from: from,
          to: to,
          subject: subject,
          text: text,
          html: html
        });
        return info;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to send email');
      }
}

module.exports=sendMail