//Edit Event handler
function editEvent(event) {
    event.preventDefault();
    
    //Grabbing form values
    const newdatetime = document.getElementById("new-datetime").value; 
    const editid = document.getElementById("edit-id").value;  
    const newlocation = document.getElementById("new-location").value; 
    const newtitle = document.getElementById("new-title").value; 
    const token = sessionStorage.getItem('token'); 

    const data = {
        'new-datetime': newdatetime,
        'edit-id': editid,
        'new-location': newlocation,
        'new-title': newtitle,
        'token': token
    };

    fetch("edit-event.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            console.log("Updated Successfully");
            pop_All_Down();
            updateCalendar();
        } else {
            alert("Edit Error: " + data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert('what are you doing');
    });
}

document.querySelector("#edit-event form").addEventListener("submit", editEvent, false);