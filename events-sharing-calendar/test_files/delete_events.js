//Event deletion handler
const deleteEventForm = document.getElementById("delete-event");
deleteEventForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let del_id = document.getElementById("delete-id").value;
    const token = sessionStorage.getItem('token'); 
    
    const pathToPhpFile = 'delete-event.php';
    const data = { 'del_id': del_id, 'token': token };
    const response = fetch(pathToPhpFile, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(res => res.json())
        .then(response => console.log(response.success))
        .catch(error => console.error('Error:', error));
    updateCalendar();
    pop_All_Down();
});