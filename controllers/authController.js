const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Patient Auth Controller
exports.patientRegister = async (req, res) => {
    const { username, email, password } = req.body;
    console.log({ username, email, password });
    try {
        const [rows] = await db.query('SELECT * FROM patient WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).send({message: 'Email already registered.'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO patient (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]);
        res.redirect('/auth/patientLogin');
    } catch (error) {
        console.error('Error registering patient:', error.message);
        res.status(500).send(`Error registering patient: ${error.message}`);
    }
};

exports.patientLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM patient WHERE email = ?', [email]);
       

        if (rows.length === 0) {
            return res.status(400).send({message:'Incorrecct E-mail.'});
        }
        const patient = rows[0];
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).send({message:'Invalid password.'});
        }
        
        //save patient session
        req.session.patient={
            id: patient.id,
            username: patient.username,
            email: patient.email,
        };

        res.status(200).send({message: "Login successfully"});
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).send(`Error logging in: ${error.message}`);
    }
};

// Doctor Auth Controller
exports.doctorRegister = async (req, res) => {
    const { username, email, password, specialization } = req.body;
    console.log({ username, email, password, specialization });
    try {
       const validSpecialization = ['Consultant doctor', 'Radiography', 'Neurology', 'Orthopedics', 'Optician', 'Dentist']

        if(!validSpecialization.includes(specialization)){
            return res.status(400).send({message: "Invalid specialization selected."})
        }
        const [rows] = await db.query('SELECT * FROM doctor WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).send({message: 'Email already registered.'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO doctor (username, email, password, specialization) VALUES (?, ?, ?, ?)', 
            [username, email, hashedPassword, specialization]);
            res.status(200).send({message: "Login successfully"});
    } catch (error) {
        console.error('Error registering doctor:', error.message);
        res.status(500).send(`Error registering doctor: ${error.message}`);
    }
};

exports.doctorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM doctor WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).send({message:'Incorrect E-mail.'});
        }
        const doctor = rows[0];
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).send({message: 'Invalid password.'});
        }
        
        // save doctor session
        req.session.doctor = {
            id: doctor.id,
            username: doctor.username,
            email: doctor.email,
            specialization: doctor.specialization,
        };
        
        res.status(200).send({message: "Registered successfully"});
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).send(`Error logging in: ${error.message}`);
    }
};




exports.logout = (req, res) => {
    console.log('Session:', req.session); // Log the session object
    if (!req.session) {
        return res.status(500).send('Session not initialized.');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err.message);
            return res.status(500).send('Failed to logout.');
        }
        res.clearCookie('user_session');
        res.status(200).send('Logout successfully!');
    });
};
