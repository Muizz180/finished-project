document.addEventListener('DOMContentLoaded', async () => {

    try {
      const response = await fetch('/displayPatientName', { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctor info.');
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
    if (!appointmentsList) {
    console.error('Error: .appointmentsList element not found');
    return;
    }

  
    
      try {
      // Fetch appointments from the backend
      const response = await fetch('/appointment/patient-booked-appointment', { method: 'GET', credentials: 'include' });
  
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
  
      const data = await response.json();
      console.log(data);
  
      if (data.appointments && data.appointments.length > 0) {
        // Populate the appointments list
        data.appointments.forEach((appointment) => {
          const appointmentForm = document.createElement('div');
          appointmentForm.className = 'appointment-item';
          appointmentForm.id = 'appointment-item';

  
          appointmentForm.innerHTML = `
        <span> ${appointment.doctor_name} </span>
        <span> ${appointment.specialization} </span  
       <span> ${appointment.date.substring(0, 10)} </span>
       <span>${appointment.time}</span>
       <span>${appointment.created_at.substring(0, 10)}</span>
         
      
       <button type="button" name="deleteAppointment" id="delete_btn"  value="${appointment.patientAppointment_id}">Delete</button>       
        `;
        
  
          appointmentsList.appendChild(appointmentForm);
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

});



document.querySelector('.appointmentsList').addEventListener('click', async (e) => {
    e.preventDefault();
  
    // Check if the clicked element is a delete button
    if (e.target.tagName === 'BUTTON' && e.target.name === 'deleteAppointment') {
      const patientAppointmentId = e.target.value; // Get the appointment ID from the button
  
        
      
      try {
        const response = await fetch('/appointment/delete-patient-appointment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ patientAppointment_id: patientAppointmentId }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Remove the deleted appointment from the DOM
          e.target.closest('.appointment-item').remove();
          console.log('Appointment deleted successfully.');
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
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