document.getElementById('P-registrationForm').addEventListener('submit', async(event)=>{
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    const confirmPassword = document.getElementById("confirmpassword").value;
    
    if(password !== confirmPassword){
        document.getElementById("confirmpasswordError").innerHTML= "Password do not match"
        return;
    }else{
        document.getElementById("confirmpasswordError").innerHTML= " ";
    }

  

    try{
        const response = await fetch('/auth/P-Register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, email, password}),
        });

        if(response.ok){
            alert("Registered successfully!")
            document.getElementById("messageError").innerHTML= "Redirecting to login page..."
            setTimeout(()=>{
                window.location.href= '/auth/patientLogin';
            }, 2000);
        }else{
            const errorData = await response.json();
            document.getElementById("messageError").innerHTML= `Error: ${errorData.message}`;
        }
        }catch(error){
            console.error("Error:", error);
            document.getElementById("messageError").innerHTML= "Something went wrong. please try again.";
    }

   
})