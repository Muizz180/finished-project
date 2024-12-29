const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');

const router = express.Router();

// Patient Routes
router.get('/patientRegister', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'P-registration.html'));
});
router.post('/P-Register', authController.patientRegister);

router.get('/patientLogin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'P-login.html'));
});
router.post('/P-Login', authController.patientLogin);

// Doctor Routes
router.get('/doctorRegister', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'D-registration.html'));
});
router.post('/D-Register', authController.doctorRegister);

router.get('/doctorLogin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'D-login.html'));
});
router.post('/D-Login', authController.doctorLogin);


router.post('/logout', authController.logout);

// Export the router
module.exports = router;
