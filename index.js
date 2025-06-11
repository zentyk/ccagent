require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.CLIENT_PORT, () => {
    console.log(`Server is running on port ${process.env.CLIENT_PORT}`);
});

let config = require('./config/config');
let singleConfig = new config(process.env.N8N_HOST, process.env.N8N_PORT);
// Importing the WhatsApp API logic
let whatsappi = require('./logic/whatsappi');
let wapi = new whatsappi(singleConfig.n8nconfig);
// Importing the MailAPI logic
let mailapi = require('./logic/mailapi');
let mail = new mailapi();

// Endpoint to handle incoming messages
app.post('/bulksend', (req, res) => {
    try {
        console.log('Received a request to send a bulk message');   

    console.log('Request body:', req.body);

    let contacts = req.body.excelBulk;

    contacts.forEach((element,i) => {
        let randomSecs = Math.floor(Math.random() * 20) + 15;

        setTimeout(function(){
            let number = element.phone;
            let message = element.message; 
            wapi.sendMessage(number, message);
        },i*randomSecs*1000); 
    }); 

    res.send(JSON.stringify({
        status: 'success',
        message: 'Bulk send request received and being processed'
    }));
    } catch (error) {
        console.error('Error processing bulk send request:', error);
        res.status(500).send('Internal Server Error');
        return;   
    } 
});


// Endpoint to handle mail sending
app.post('/sendmail', (req, res) => {
    try {
        console.log('Received a request to send an email');

        let from = req.body.from;
        let to = req.body.to;
        let subject = req.body.subject;
        let html = req.body.html;

        (async () => {
            try {
                let info = await mail.sendMail(from,to, subject, html); 
                console.log(info)
                res.send(JSON.stringify({
                    status: 'success',
                    message: 'Email sent successfully',
                    messageId: `${info}`
                }));
            } catch (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Failed to send email');
            }
        }
        )();
    } catch (error) {
        console.error('Error processing send mail request:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to handle img tracking
app.get('/sendmail/track/open',(req,res)=>{
    const id = req.query.id;
    console.log('tracking...')
    mail.notifyEmailOpened(id);
})