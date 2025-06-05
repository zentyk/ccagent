const {Client, LocalAuth} = require('whatsapp-web.js');

class whatsappi {
    constructor(n8nconfig) {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        this.n8nconfig = n8nconfig;

        this.client.on('ready', () => { 
            console.log('Client is ready!'); 
        });

        this.client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
        });

        this.client.on('authenticated', () => {
            console.log('Client authenticated!');
        });

        this.client.on('message', (message) => {
            console.log('Message received:', message);
            this.receiveMessage(message);
        });

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
        const chatId = number.substring(1) + '@c.us'; 
        this.client.sendMessage(chatId, message).then(response => {
            console.log('Message sent successfully:');
        })
        .catch(err => {
            console.error('Error sending message:');
        });       
    }

    async receiveMessage(message){ 
        const url = `${this.n8nconfig.url}/webhook/request`;

       //check if message is from an existing chat
        if (message.from === 'status@broadcast') {
            console.log('Message is a broadcast status, ignoring.');
            return;
        }
         
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                } 
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); 

            let tempclient = this.client; 

            setTimeout(function () {
                tempclient.sendMessage(message.from, `${data.message}`);
            }, 15000); 

        } catch (error) {
            console.error('Error sending message to webhook:', error);
        }
    }
}

module.exports = whatsappi;