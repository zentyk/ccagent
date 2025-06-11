const nodemailer = require('nodemailer');

class MailApi {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ionos.mx',
            port: 465,
            secure: true, 
            auth: {
                user:'armeza@todoencontrol.mx',
                pass: 'zentik1$1000.exp1'
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
        console.log(`Correo abierto. Id:${id}`)
    }
}

module.exports = MailApi;