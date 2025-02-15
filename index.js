require("dotenv").config();
const express = require('express');
const { param, query, validationResult, oneOf, body} = require('express-validator');
let app = express();

// Cors
const cors = require('cors');
const {json} = require("express");
app.use(cors());
app.use(express.static('public'));

// Root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const INVALID_DATE_MESSAGE = 'Invalid Date';

/**
 * Extracted validation handler to improve readability.
 */
function validateDateParams() {
    return oneOf([
        [param('date').notEmpty(), param('date').isInt({min: 0})],
        [param('date').notEmpty(), param('date').isDate()],
        param('date').isEmpty(),
    ]);
}

/**
 * Extracted function for parsing date logic.
 */
function parseDate(dateParam) {
    if (dateParam === undefined) {
        return new Date();
    }
    if (isNaN(dateParam)) {
        return new Date(dateParam);
    }
    return new Date(dateParam * 1000);
}

app.get('/api/:date?',
    validateDateParams(),
    (req, res) => {
        console.log('Starting API timestamp');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.json({error: INVALID_DATE_MESSAGE});
        }

        const dateParam = req.params.date;
        const resultDate = parseDate(dateParam);

        const response = {
            unix: resultDate.valueOf(),
            utc: resultDate.toUTCString()
        };

        return res.json(response);
    }
);

app.listen(process.env.NODE_PORT, () => {
    console.log('Server started on port ' + process.env.NODE_PORT);
});