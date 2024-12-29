const db = require('../db');

exports.createAppointment = async (req, res) => {
  if (!req.session.doctor) {
    return res.status(401).send({ error: 'Unauthorized. Please login first.' });
  }

  console.log('Doctor Session:', req.session.doctor);

  
  const { date, time } = req.body;
  console.log('Request Body:', req.body);

  try {
      const [existingAppointment] = await db.query(
          'SELECT * FROM appointment WHERE date = ? AND time = ?',
          [date, time]
      );
      console.log('Existing Appointment:', existingAppointment);

      if (existingAppointment.length > 0) {
        return res.status(400).send({ 
            message: 'You already have an appointment at this date and time. Please choose a different time or date.' 
        });
    }


      const validtime = ["11:00am - 12:00am", "10:00am - 11:00am", "11:00am - 12:00am", "12:00am - 1:00pm", "1:00pm - 2:00pm", "2:00pm - 3:00pm", "3:00pm - 4:00pm", "4:00pm - 5:00pm"];

      if (!validtime.includes(time)) {
          return res.status(400).send({ message: "Invalid time selected." });
      }

      await db.query('INSERT INTO appointment (doctor_id, doctor_name, specialization, date, time) VALUES (?, ?, ?, ?, ?)', [
          req.session.doctor.id,
          req.session.doctor.username,
          req.session.doctor.specialization,
          date,
          time,
      ]);

      

     

      res.send({ message: 'Appointment created successfully!' });
  } catch (err) {
      console.error('Error creating appointment:', err);
      res.status(500).send({ message: 'Failed to create appointment', details: err.message });
  }
};


  
exports.bookAppointments = async (req, res) => {
  if (!req.session.patient) {
    return res.status(401).send({ error: 'Unauthorized. Please login first.' });
  }

  try {
    const [appointments] = await db.query(`
      SELECT id AS appointment_id, doctor_name, specialization, date, time 
      FROM appointment
    `);
    console.log('Appointments fetched from DB:', appointments);
  
    if (appointments.length === 0) {
      return res.status(400).send({ error: 'No appointments available.' });
    }
  
    res.send({ appointments });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).send({ error: 'Failed to fetch appointments', details: err.message });
  }
  
};


exports.bookSelectedAppointment = async (req, res) => {
  const { appointment_id } = req.body;

  if (!req.session.patient) {
    return res.status(401).send({ error: 'Unauthorized. Please log in first.' });
  }

  try {
    // Retrieve the selected appointment details
    const [appointment] = await db.query(
      'SELECT doctor_id, doctor_name, specialization, date, time FROM appointment WHERE id = ?',
      [appointment_id]
    );

    if (!appointment || appointment.length === 0) {
      return res.status(404).send({ message: 'Appointment not found' });
    }

    const { doctor_id, doctor_name, specialization, date, time } = appointment[0];
    const patient_id = req.session.patient.id;
    const patient_name = req.session.patient.username;

    // Insert into patient_appointments table
    await db.query(
      'INSERT INTO patient_appointments (patient_id, doctor_id, patient_name, doctor_name, specialization, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, patient_name, doctor_name, specialization, date, time]
    );

    res.send({ message: 'Appointment booked successfully!' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).send({ message: 'Failed to book appointment', details: error.message });
  }
};


exports.deleteAppointment = async (req, res) => {
  const { appointment_id } = req.body;

  try {
    // Check if the appointment exists
    const [appointment] = await db.query(
      'SELECT * FROM appointment WHERE id = ?',
      [appointment_id]
    );

    if (appointment.length === 0) {
      return res.status(404).send({ message: 'Appointment not found' });
    }

    // Delete the appointment
    await db.query('DELETE FROM appointment WHERE id = ?', [appointment_id]);

    res.send({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).send({ message: 'Failed to delete appointment', details: error.message });
  }
};


exports.deletePatientAppointment = async (req, res) => {
  const { patientAppointment_id } = req.body;

  try {
    // Check if the appointment exists
    const [appointment] = await db.query(
      'SELECT * FROM patient_appointments  WHERE id = ?',
      [patientAppointment_id]
    );

    if (appointment.length === 0) {
      return res.status(404).send({ message: 'Appointment not found' });
    }

    // Delete the appointment
    await db.query('DELETE FROM patient_appointments WHERE id = ?', [patientAppointment_id]);

    res.send({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).send({ message: 'Failed to delete appointment', details: error.message });
  }
};


exports.createdAppointments = async (req, res) => {
  if (!req.session.doctor) {
    return res.status(401).send({ error: 'Unauthorized. Please login first.' });
  }

  
  const doctor_session_id = req.session.doctor.id; 

  console.log(doctor_session_id);

  try {
    const [appointments] = await db.query(
      'SELECT id AS appointment_id,  doctor_id, doctor_name, date, time, created_at FROM appointment WHERE doctor_id = ?',
      [doctor_session_id]
    );
    console.log('Appointments fetched from DB:', appointments);

    
  
    if (appointments.length === 0) {
      return res.status(400).send({ error: 'No appointments available.' });
    }
  
    res.send({ appointments });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).send({ error: 'Failed to fetch appointments', details: err.message });
  }
  
};





exports.doctorBookedAppointments = async (req, res) => {
  if (!req.session.doctor) {
    return res.status(401).send({ error: 'Unauthorized. Please login first.' });
  }

  
  const doctor_session_id = req.session.doctor.id; 

  console.log(doctor_session_id);

  try {
    const [appointments] = await db.query(
      'SELECT id AS patientAppointment_id, doctor_id, patient_name, doctor_name, date, time, created_at FROM patient_appointments WHERE doctor_id = ?',
      [doctor_session_id]
    );
    console.log('Appointments fetched from DB:', appointments);

    
  
    if (appointments.length === 0) {
      return res.status(400).send({ error: 'No appointments available.' });
    }
  
    res.send({ appointments });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).send({ error: 'Failed to fetch appointments', details: err.message });
  }
  
};


exports.patientBookedAppointments = async (req, res) => {
  if (!req.session.patient) {
    return res.status(401).send({ error: 'Unauthorized. Please login first.' });
  }

  
  const patient_session_id = req.session.patient.id; 

  console.log(patient_session_id);

  try {
    const [appointments] = await db.query(
      'SELECT id AS patientAppointment_id, patient_id, patient_name, doctor_name, specialization, date, time, created_at FROM patient_appointments WHERE patient_id = ?',
      [patient_session_id]
    );
    console.log('Appointments fetched from DB:', appointments);

    
  
    if (appointments.length === 0) {
      return res.status(400).send({ error: 'No appointments available.' });
    }
  
    res.send({ appointments });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).send({ error: 'Failed to fetch appointments', details: err.message });
  }
  
};
