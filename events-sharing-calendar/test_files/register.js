function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById("reg-username").value.trim(); // Get the username from the form
    const password = document.getElementById("reg-password").value.trim(); // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = {'username': username, 'password': password};

    fetch("register.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data=>
            {
                console.log(data);
                 if (data.success){
                    alert(data.message);
                    pop_All_Down();
                 }else{
                    alert(data.message);
                 }
            }
            )
        .catch(err => 
            {
                console.error(err);
            });
}

document.querySelector("#register form").addEventListener("submit", registerUser, false); // Bind the AJAX call to button click