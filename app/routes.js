const express = require('express');
const router = express.Router();
const moment = require('moment');

// const questionPages = [
//     'name',
//     'date-of-birth',
//     'postcode',
//     'urn',
//     'renewal-date',
//     'changes-condition',
//     'changes-impact',
//     'changes-travel',
//     'changes-name',
//     'changes-address',
//     'changes-job',
//     'changes-work-address',
//     'contact',
//     'contact-window'
// ].map(p => `/renew/${p}`);

const questionPages = [
    'name',
    'date-of-birth',
    'urn',
    'changes',
    'contact'
].map(p => `/renew/${p}`);

router.use((req, res, next) => {
    res.locals.firstQuestion = questionPages[0];
    res.locals.questionNumber = questionPages.indexOf(req.path) + 1;
    res.locals.totalQuestions = questionPages.length;
    res.locals.renewalDateExample = moment().add(3, 'weeks').format('D M YYYY');
    if(req.path === '/declaration'){
        res.locals.back = questionPages[questionPages.length - 1];
    } else {
        res.locals.back = (questionPages.indexOf(req.path) === 0) ? '/' : questionPages[questionPages.indexOf(req.path) - 1]; 
    }
    next();
})
router.post('*', (req, res) => {
    const nextPage = (questionPages.indexOf(req.path) !== questionPages.length - 1) ? questionPages[questionPages.indexOf(req.path)+1] : '/declaration';
    res.status(302).redirect(nextPage);
})

module.exports = router
