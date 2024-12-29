document.addEventListener('DOMContentLoaded', async () => {

  try {
    const response = await fetch('/displayPatientName', { credentials: 'include' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch patient info.');
    }

    const data = await response.json();
    if (data) {
      // Display the username in the frontend
      document.getElementById('profile_preview').innerHTML = ` <p>${data.username[0].toUpperCase()}</p>`;
      document.getElementById('patientName').innerHTML = ` ${data.username.charAt(0).toUpperCase() + data.username.slice(1)} `;
      document.getElementById('patientEmail').innerText = `${data.email}`;
    }
  } catch (error) {
    console.error('Error fetching doctor info:', error);
  }




  const appointmentsList = document.querySelector('.appointmentsList');

  async function loadAppointments() {
    try {
    // Fetch appointments from the backend
    const response = await fetch('/appointment/B-Appointment', { method: 'GET', credentials: 'include' });

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    const data = await response.json();
    console.log(data);

    if (data.appointments && data.appointments.length > 0) {
      // Populate the appointments list
      data.appointments.forEach((appointment) => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.className = 'appointment-item';

        appointmentDiv.innerHTML = `
          <span> ${appointment.doctor_name}</span>
          <span> ${appointment.specialization}</span>
          <span> ${appointment.date.substring(0, 10)}</span>
          <span> ${appointment.time}</span>
          <input type="radio" name="appointment" value="${appointment.appointment_id}">
        `;

        appointmentsList.appendChild(appointmentDiv);
      });
    } else  {
      appointmentsList.innerHTML = '<p>No appointments available.</p>';
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    appointmentsList.innerHTML = '<p>No appointments available.</p>';
  } 

  
  const notification_content = document.getElementById('dropdown_notify_content');
  if (!notification_content) {
    console.error('Error: notifation_content element not found');
    return;
    }

  try{
    const response = await fetch('/appointment/patient-booked-appointment', { method: 'GET', credentials: 'include' });

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    const data = await response.json();
    console.log(data);

    if (data.appointments && data.appointments.length > 0) {

      data.appointments.forEach((appointment) => {
        const appointmentBooked = document.createElement('div');
        appointmentBooked.className = 'appointmentBooked'


        appointmentBooked.innerHTML = `
        <span>
         You book appointmentt of  Dr.${appointment.doctor_name} on <b>${appointment.date.substring(0, 10)}</b> at <b>${appointment.time}</b>
        </span>
        `;
        notification_content.appendChild(appointmentBooked);
    });
    }else  {
      appointmentBooked.innerHTML = '<p>No appointments booked available.</p>';
    }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      appointmentBooked.innerHTML = '<p>No appointments booked available.</p>';
    } 


}

document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const selectedAppointment = document.querySelector('input[name="appointment"]:checked');
  if (!selectedAppointment) {
    alert('Please select an appointment.');
    return;
  }

  const appointmentId = selectedAppointment.value;

  try {
    const response = await fetch('/appointment/delete-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ appointment_id: appointmentId }),
    });

    const result = await response.json();

    if (response.ok) {
      

      // Remove the appointment from the DOM
      selectedAppointment.closest('.appointment-item').remove();

      // Reload the appointments after successful deletion
      loadAppointments();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
  }
});

// Load appointments initially
loadAppointments();

});

// Handle form submission for booking the selected appointment
document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const selectedAppointment = document.querySelector('input[name="appointment"]:checked');
  if (!selectedAppointment) {
    alert('Please select an appointment.');
    return;
  }

  const appointmentId = selectedAppointment.value;



  try {
    const response = await fetch('/appointment/book-selected-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ appointment_id: appointmentId }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      location.reload(); // Refresh the page after successful booking
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
  }
});



// Select the logout button
const logoutButton = document.querySelector('.log_out');

// Add a click event listener to the logout button
logoutButton.addEventListener('click', async () => {
    try {
        // Send a POST request to the logout route
        const response = await fetch('/auth/logout',{
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle the response from the server
        if (response.ok) {
            alert('Logout successful!');
            // Redirect to the login page or home page
            window.location.href = '/'
        } else {
            const error = await response.text();
            alert(`Logout failed: ${error}`);
        }
    } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred while logging out.');
    }
});




const nav = document.getElementById('nav');
    document.querySelector('.menu_icon').addEventListener('click', (e)=>{
        e.stopPropagation();
       if (nav.style.display === 'none') {
        nav.style.display = 'block'; 
        } else {
            nav.style.display = 'none'; 
    }
    });

    document.addEventListener('click', () => {
      if (nav.style.display === 'block') {
          nav.style.display = 'none'; 
      }
    })
