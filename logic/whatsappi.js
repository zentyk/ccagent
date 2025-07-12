const {Client, LocalAuth} = require('whatsapp-web.js');

class whatsappi {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        }); 

        this.client.on('ready', () => { 
            console.log('Client is ready!'); 
        });

        this.client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
        });

        this.client.on('authenticated', () => {
            console.log('Client authenticated!');
        });

        /*this.client.on('message', (message) => { 
            this.receiveMessage(message);
        });*/

        this.client.on('auth_failure', msg => {
            console.error('Authentication failed:', msg);
        });

        this.client.on('disconnected', (reason) => {
            console.log('Client was logged out', reason);
            this.client.destroy(); // Destroy the client instance
            this.client.initialize(); // Reinitialize the client
        });

        this.client.initialize();
    }

    sendMessage(number, message) { 
        let n = "+521"+ number; // Ensure the number is in the correct format
        const chatId = n.substring(1) + '@c.us'; 
        this.client.sendMessage(chatId, message).then(response => {
            console.log('Message sent successfully:');
        })
        .catch(err => {
            console.error('Error sending message:');
        });       
    } 
}

module.exports = whatsappi;