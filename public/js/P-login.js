document.getElementById('P-loginForm').addEventListener('submit', async(event)=>{
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    try{
        const response = await fetch('/auth/P-Login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        if(response.ok){
            alert("Login successfully!")
            document.getElementById("messageError").innerHTML= "Redirecting to home page..."
            setTimeout(()=>{
                window.location.href= '/patientHome';
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