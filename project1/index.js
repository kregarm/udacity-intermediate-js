const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('public'));

app.get('/dinos', (req, res) => {
    fs.readFile('public/dino.json', (err, data) => {
        if (!err){
            res.send(JSON.parse(data))
        }
        console.log(err)
    });
})

app.listen(3000, () => { console.log('Listening on port 3000') })