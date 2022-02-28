const express = require('express');

const router = express.Router();

const userController = require('../controller/userController')
const subscriptionController = require('../controller/subscriptionController')

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});
//user APIS
router.put('/user/:userName', userController.userRegistration);
router.get('/user/:userName', userController.userDetail);

//subscription APIS
router.post('/subscription', subscriptionController.registrationOfSubscription)
router.get('/subscription/:userName/:inputDate', subscriptionController.getSubscriptionWithDate)
router.get('/subscription/:userName', subscriptionController.getSubscription)


module.exports = router; 