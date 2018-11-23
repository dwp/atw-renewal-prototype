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

module.exports = router
