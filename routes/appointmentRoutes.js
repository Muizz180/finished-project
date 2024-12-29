const express = require('express');
const path = require('path');
const appointmentController = require('../controllers/appointmentController');

const appointmentRouter = express.Router();


appointmentRouter.post('/C-Appointment', appointmentController.createAppointment);

appointmentRouter.get('/createAppointment', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'D-appointment.html'));
});


appointmentRouter.get('/B-Appointment', appointmentController.bookAppointments)

appointmentRouter.get('/bookAppointment', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'P-appointment.html'));
});

appointmentRouter.post('/book-selected-appointment', appointmentController.bookSelectedAppointment);


appointmentRouter.post('/delete-appointment', appointmentController.deleteAppointment);

appointmentRouter.post('/delete-patient-appointment', appointmentController.deletePatientAppointment);

appointmentRouter.get('/created-appointment', appointmentController.createdAppointments);

appointmentRouter.get('/createdAppointment', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'D-booked.html'));
});

appointmentRouter.get('/patientBookedAppointment', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'P-booked.html'));
});




appointmentRouter.get('/doctor-booked-appointment', appointmentController.doctorBookedAppointments);

appointmentRouter.get('/patient-booked-appointment', appointmentController.patientBookedAppointments);


module.exports = appointmentRouter;