const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const journeys = require('./data/journeys.json');
let route = '', journey = '';

for (let j in journeys) {
    fs.stat(path.resolve(__dirname, 'views/' + j), function(err, stats) {
        if (err && err.errno !== 34) {
            fs.symlinkSync(path.resolve(__dirname, 'views'), path.resolve(__dirname, 'views/' + j), 'dir');
        }
    });
}

router.use((req, res, next) => {
    route = req.path.match(/^\/([^/]+)\//) ? req.path.match(/^\/([^/]+)\//)[1] : 'v1';
    if (journeys[route]) journey = journeys[route].map(p => `/${route}/${p}`);
    next();
});

router.use((req, res, next) => {
    const questions = journey.filter(p => p.match(/question/));
    res.locals.firstQuestion = questions[0];
    res.locals.questionNumber = questions.indexOf(req.path) + 1;
    res.locals.totalQuestions = questions.length;
    res.locals.renewalDateExample = moment().add(6, 'weeks').format('D M YYYY');
    res.locals.data.changes = res.locals.data.changes || [];
    res.locals.back = (journey.indexOf(req.path) === 0) ? '/' : journey[journey.indexOf(req.path) - 1];
    next();
})

router.post('/*/question/name', (req, res, next) => {
    res.locals.errors = [];
    if(!res.locals.data['first-name']) {
        res.locals.errors.push('first-name');
    }
    if(!res.locals.data['last-name']) {
        res.locals.errors.push('last-name');
    }
    if(res.locals.errors.length) {
        res.render('question/name');
    } else {
        next();
    }
})

router.post('/*/question/date-of-birth', (req, res, next) => {
    res.locals.errors = [];
    if(!res.locals.data['dob-day']) {
        res.locals.errors.push('dob-day');
    }
    if(!res.locals.data['dob-month']) {
        res.locals.errors.push('dob-month');
    }
    if(!res.locals.data['dob-year']) {
        res.locals.errors.push('dob-year');
    }
    if(res.locals.errors.length) {
        res.render('question/date-of-birth');
    } else {
        next();
    }
})

router.post('/*/question/address', (req, res, next) => {
    res.locals.errors = [];
    if(!res.locals.data['address-line-1']) {
        res.locals.errors.push('address-line-1');
    }
    if(!res.locals.data['address-postcode']) {
        res.locals.errors.push('address-postcode');
    }
    if(res.locals.errors.length) {
        res.render('question/address');
    } else {
        next();
    }
})

router.post('/*/question/urn', (req, res, next) => {
    res.locals.errors = '';
    if(res.locals.data['have-urn'] == 'yes' && !res.locals.data.urn.replace(/[\s]/g, '').match(/^1\d{8}$/)) {
        res.locals.errors = 'urn';
        res.render('question/urn');
    } else {
        next();
    }
})

router.post('*', (req, res) => {
    const nextPage = journey[journey.indexOf(req.path)+1];
    res.status(302).redirect(nextPage);
})

router.get('/*/submit', (req, res, next) => {
    res.locals.dob = moment(`${res.locals.data['dob-year']}-${res.locals.data['dob-month']}-${res.locals.data['dob-day']}`, 'YYYY-MM-DD').format('D MMMM YYYY');
    next();
})

module.exports = router
