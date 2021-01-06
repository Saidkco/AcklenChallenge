const accountSid = 'AC0f26788e366eced1740d45a34e5c8132'; 
    const authToken = '27f004c23a0ce69af4e950a2cec3b21e'; 
    const client = require('twilio')(accountSid, authToken); 
     
    client.messages 
          .create({ 
             body: 'Estamos haciendo pruebas', 
             from: 'whatsapp:+14155238886',       
             to: 'whatsapp:+50432145240' 
           }) 
          .then(message => console.log(message.sid)) 
          .done();