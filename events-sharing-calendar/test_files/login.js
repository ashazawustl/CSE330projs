// Login handlers 
function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById("log-username").value.trim(); // Get the username from the form
    const password = document.getElementById("log-password").value.trim(); // Get the password from the form
    let token;
    // Make a URL-encoded string for passing POST data:
    const data = {'username': username, 'password': password };

    //CSRF token stuff
    fetch("login.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => 
        {
            if(data.success){
                token = data.token;
                sessionStorage.setItem("token", data.token);
                alert(data.message);
                console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`);
                pop_All_Down();
                toggleLogin();
                updateCalendar();
            }else{
                alert(data.message);
            }
        }
        )
    .catch(err => {
        console.error(err);
    });
}

function toggleLogin(){
    document.getElementById('login_button').style.display = "none";
    document.getElementById('register_button').style.display = "none";
    document.getElementById('logout').style.display = "block";
}

document.querySelector("#login form").addEventListener("submit", loginUser, false);