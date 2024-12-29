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


function initMap() {
    // Initialize the map
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: -34.397, lng: 150.644 }, // Default location
    });

    var input = document.getElementById('searchTextField')
    let autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map)

    // Use HTML5 Geolocation to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center the map to user's location
                map.setCenter(userLocation);

                // Add a marker for user's location
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "You are here!",
                });

                // Search for nearby hospitals
                const request = {
                    location: userLocation,
                    radius: '5000', // Search within 5km radius
                    type: ['hospital'], // Specify type
                };

                const service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        results.forEach((place) => {
                            new google.maps.Marker({
                                position: place.geometry.location,
                                map: map,
                                title: place.name,
                            });
                        });
                    } else {
                        console.error("Places API error: " + status);
                    }
                });
            },
            () => {
                alert("Geolocation failed. Please enable location services.");
            }
        );
    } else {
        alert("Your browser doesn't support Geolocation.");
    }
}


