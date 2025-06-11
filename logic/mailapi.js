const nodemailer = require('nodemailer');

class MailApi {
    constructor(config){ 
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: true, 
            auth: {
                user: config.user,
                pass: config.pass 
            }
        });
    }
   
    async sendMail(from,destiny, subject, htmlBody) { 
        let verified = await this.transporter.verify();
        console.log("verification:"+verified);
    
        const info = await this.transporter.sendMail({
            from: from,
            to: destiny,
            subject: subject,
            html: htmlBody,
        })

        console.log('Message sent: %s', info.messageId);
        return info.messageId;
    }    

    async notifyEmailOpened(id){
        console.log(`Correo abierto. Id:${id}`); 
        let img = "3312";
        return img;
    }
}

module.exports = MailApi;