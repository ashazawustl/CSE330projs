function logoutUser(){
    fetch("logout.php", {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
    .then(response => {
        if (!response.ok){
           throw new Error('Network response was not ok');
        }
        return response.json();
        })
    .then(data => 
        {
            console.log(data);
            if(data.success){
                alert(data.message);
                updateCalendar();
            }else{
                alert("Error logging out.");
            }
        })
    .catch(err => {
        console.error(err);
    });

}