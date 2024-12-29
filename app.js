const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const authRoutes= require('./routes/authRoutes');
const db = require('./db');
const appointmentRoutes= require('./routes/appointmentRoutes');



const app = express()

// // Configure MySQL session store
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });


  app.use(
    session({
      key: 'user_session',
      secret: process.env.JWT_SECRET ,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Enable in production
      },
    })
  );

app.use(bodyParser.urlencoded({
    extended: false
})); 

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);

app.use('/appointment', appointmentRoutes);






app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Landing.html'));
});



app.get('/doctorHome', (req, res) => {
    if(!req.session.doctor){
        return res.redirect('/auth/doctorLogin');
    }
    res.sendFile(path.join(__dirname, 'views', 'D-home.html'));
});


app.get('/patientHome', (req, res) => {
    if(!req.session.patient){
        return res.redirect('/auth/patientLogin');
    }
    res.sendFile(path.join(__dirname, 'views', 'P-home.html'));
});


app.get('/doctorContact', (req, res) => {
  if(!req.session.doctor){
      return res.redirect('/auth/doctorLogin');
  }
  res.sendFile(path.join(__dirname, 'views', 'D-contact.html'));
});

app.get('/patientContact', (req, res) => {
  if(!req.session.patient){
      return res.redirect('/auth/patientLogin');
  }
  res.sendFile(path.join(__dirname, 'views', 'P-contact.html'));
});


app.get('/doctorSetting', (req, res) => {
  if(!req.session.doctor){
      return res.redirect('/auth/doctorLogin');
  }
  res.sendFile(path.join(__dirname, 'views', 'D-setting.html'));
});


app.get('/patientSetting', (req, res) => {
  if(!req.session.patient){
      return res.redirect('/auth/patientLogin');
  }
  res.sendFile(path.join(__dirname, 'views', 'P-setting.html'));
});


app.get('/patientmap', (req, res) => {
  if(!req.session.patient){
      return res.redirect('/auth/patientLogin');
  }
  res.sendFile(path.join(__dirname, 'views', 'map.html'));
});

app.get('/patientmap', (req, res) => {
  if(!req.session.patient){
      return res.redirect('/auth/patientLogin');
  }
  res.sendFile(path.join(__dirname, 'views', 'map.html'));
});


app.get('/displayDoctorName', (req, res) => {
  if (req.session.doctor) {
    return res.send({ username: req.session.doctor.username, email: req.session.doctor.email  });
  } else {
    return res.status(401).send({ error: 'Unauthorized. Please log in first.' });
  }
});

app.get('/displayPatientName', (req, res) => {
  if (req.session.patient) {
    return res.send({ username: req.session.patient.username, email: req.session.patient.email });
  } else {
    return res.status(401).send({ error: 'Unauthorized. Please log in first.' });
  }
});




const PORT = 9098;

app.listen(PORT, () => {
    console.log(`Server is runing on http://localhost:${PORT}`);
});

