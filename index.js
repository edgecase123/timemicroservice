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
 * Validation handler to improve readability.
 */
function validateDateParams() {
    return oneOf([
        param('date').custom(value => {
            if (!value) {
                // empty values ok
                return true;
            }

            const moment = require('moment');
            if (!moment(value).isValid()) {
                console.error('Invalid date: ' + value);
                throw new Error("Invalid Date");
            }

            return true;
        }),
        [param('date').notEmpty(), param('date').isInt({min: 0})],
        [param('date').notEmpty(), param('date').isISO8601()],
        param('date').isEmpty(),
    ]);
}

/**
 * Function for parsing date logic.
 */
function parseDate(dateParam) {
    if (dateParam === undefined) {
        return new Date();
    }

    if (isNaN(dateParam)) {
        console.log(`Date Param: ${dateParam}`);
        const moment = require('moment');
        const result = moment(dateParam).toDate();
        console.log(result.toString());
        return result;
    }

    return new Date(parseInt(dateParam));
}

app.get('/api/:date?',
    validateDateParams(),
    (req, res) => {
        console.log('Starting API timestamp with params' + JSON.stringify(req.params));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({error: INVALID_DATE_MESSAGE});
        }

        const dateParam = req.params.date;
        const resultDate = parseDate(dateParam);

        const response = {
            unix: resultDate.valueOf(),
            utc: resultDate.toUTCString()
        };
        console.log('Response follows');
        console.log(response);
        return res.json(response);
    }
);

app.listen(process.env.NODE_PORT, () => {
    console.log('Server started on port ' + process.env.NODE_PORT);
});