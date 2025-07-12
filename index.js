require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.CLIENT_PORT, () => {
    console.log(`Server is running on port ${process.env.CLIENT_PORT}`);
});

// Importing the WhatsApp API logic
let whatsappi = require('./logic/whatsappi');
let wapi = new whatsappi();


app.post('/bulksend', (req, res) => {
    try {
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