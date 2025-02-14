require("dotenv").config();
const express = require('express');

let app = express();

// Cors
const cors = require('cors');
app.use(cors());
app.use(express.static('public'));

// Root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/:date', (req, res) => {
    console.log(req.params.date);
    const dateParams = req.params.date;
    const resultDate = (isNaN(dateParams) ? new Date(req.params.date) : new Date(req.params.date * 1000 ));

    let resultObj = {unix: resultDate.valueOf(), utc: resultDate.toUTCString()};

    res.json(resultObj);
})

app.listen(3001, () => {
    console.log('Server started on port ' + process.env.NODE_PORT);
});