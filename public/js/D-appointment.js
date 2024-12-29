
document.getElementById('createAppointmentForm').addEventListener('submit', async(event)=>{
    event.preventDefault();

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
  
    
  

    try{
        const response = await fetch('/appointment/C-Appointment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify({date, time}),
        });

        if(response.ok){
            alert("Appointment created successfully!")
            document.getElementById("appointmentError").innerHTML = ""; 
            

            //reset the values
            document.getElementById('createAppointmentForm').reset();
        }else{
            const errorData = await response.json();
            document.getElementById("appointmentError").innerHTML= `Error: ${errorData.message}`;
            
        }
        }catch(error){
            console.error("Error:", error);
            document.getElementById("appointmentError").innerHTML= "Something went wrong. please try again.";
    }
 


   
})


document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/displayDoctorName', { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctor info.');
      }
  
      const data = await response.json();
      if (data) {
        // Display the username in the frontend
        document.getElementById('profile_preview').innerHTML = ` <p>${data.username[0].toUpperCase()}</p>`;
        document.getElementById('doctorName').innerHTML = ` ${data.username.charAt(0).toUpperCase() + data.username.slice(1)} `;
        document.getElementById('doctorEmail').innerText = `${data.email}`;
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    }


    const notification_content = document.getElementById('dropdown_notify_content');
    if (!notification_content) {
      console.error('Error: notifation_content element not found');
      return;
      }

      try{
        const response = await fetch('/appointment/doctor-booked-appointment', { method: 'GET', credentials: 'include' });

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
             <b>${appointment.patient_name} </b> booked your appointmnet on <b>${appointment.date.substring(0, 10)}</b> at <b>${appointment.time}</b>
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


        try{
          const response = await fetch('/appointment/created-appointment', { method: 'GET', credentials: 'include' });
  
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
               You created appointment on <b>${appointment.date.substring(0, 10)}</b> at <b>${appointment.time}</b>
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


// Select the logout button
const logoutButton = document.getElementById('log_out')

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