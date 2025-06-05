require('dotenv').config();

const express = require('express');

const app = express();

app.listen(process.env.CLIENT_PORT, () => {
    console.log(`Server is running on port ${process.env.CLIENT_PORT}`);
});

let config = require('./config/config');
let singleConfig = new config(process.env.N8N_HOST, process.env.N8N_PORT);
let whatsappi = require('./logic/whatsappi');
let wapi = new whatsappi(singleConfig.n8nconfig);

// Endpoint to handle incoming messages
app.post('/bulksend', (req, res) => {
    const business = "Jorge Arturo Meza"; // Default value if not provided
    const message = `Buen dia, tengo el gusto con el titular de la cuenta AT&T empresarial a nombre de *${business}* ? Si este tema no lo veo con usted, ayúdenme a dirigirme con la persona indicada o  respóndame este mensaje para no molestarle mas.`;
    const number = '+5215538864689';
    try {
        wapi.sendMessage(number, message);
        res.status(200).send('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
    }
});