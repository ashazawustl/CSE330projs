
//----------SECTION: CALENDAR MATH (BASED FROM CS330 WIKI)--------------------------------------------//
(function () { Date.prototype.deltaDays = function (c) { return new Date(this.getFullYear(), this.getMonth(), this.getDate() + c) }; Date.prototype.getSunday = function () { return this.deltaDays(-1 * this.getDay()) } })();
function Week(c) { this.sunday = c.getSunday(); this.nextWeek = function () { return new Week(this.sunday.deltaDays(7)) }; this.prevWeek = function () { return new Week(this.sunday.deltaDays(-7)) }; this.contains = function (b) { return this.sunday.valueOf() === b.getSunday().valueOf() }; this.getDates = function () { for (var b = [], a = 0; 7 > a; a++)b.push(this.sunday.deltaDays(a)); return b } }
function Month(c, b) { this.year = c; this.month = b; this.nextMonth = function () { return new Month(c + Math.floor((b + 1) / 12), (b + 1) % 12) }; this.prevMonth = function () { return new Month(c + Math.floor((b - 1) / 12), (b + 11) % 12) }; this.getDateObject = function (a) { return new Date(this.year, this.month, a) }; this.getWeeks = function () { var a = this.getDateObject(1), b = this.nextMonth().getDateObject(0), c = [], a = new Week(a); for (c.push(a); !a.contains(b);)a = a.nextWeek(), c.push(a); return c } };

let currentMonth = new Month(2024, 9); // October 2024

updateCalendar();

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function (event) {
    currentMonth = currentMonth.nextMonth();
    updateCalendar();
}, false);

// Change the month when the "prev" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function (event) {
    currentMonth = currentMonth.prevMonth(); 
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
}, false);


//----------------- SECTION: CALENDAR CREATION ------------------------------//
//Main Function: Creates & Updates Calendar at every change
function updateCalendar() {
    updateMonthYear();
    //Clears previous calendar
    let cal = document.getElementById("calendar");
    cal.innerHTML = "";

    //creating week headers
    let cal_header = document.createElement('tr');
    cal_header.innerHTML = `
        <th>Sunday</th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
        <th>Saturday</th>
    `;
    let weeks = currentMonth.getWeeks();
    document.getElementById("calendar").appendChild(cal_header);
    for (let w in weeks) {
        let days = weeks[w].getDates();
        // days contains normal JavaScript Date objects.

        let cal_week = document.createElement('tr');
        //loop through all days in a week and add to week
        for (let d in days) {
            let id = "week" + w + "day" + d;
            let cal_day = document.createElement('td');
            cal_day.innerHTML = `
                <td>
                <div class="day">
                    <h4>${days[d].getDate()}<h4>
                </div>
                <div class="event-wrapper" id="${id}">
                </div>
                </td>
            `;
            cal_week.appendChild(cal_day);
        }
        document.getElementById("calendar").appendChild(cal_week);
    }

    //Loop again to add owned and shared events to user's calendar
    for (let w in weeks) {
        let days = weeks[w].getDates();
        for (let d in days) {
            let id = "week" + w + "day" + d;
            displayDailyEvents(d, days, id);
            displayDailyShared(d, days, id);
        }
    }
}

//Changes Calendar title to match month and year
function updateMonthYear() {
    let curMonthId = currentMonth.month;
    let curYear = String(currentMonth.year);
    const months = [];
    months.push("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    let curMonth = months[curMonthId];

    //clearing previous month title
    let MY_div = document.getElementById("month-year");
    MY_div.innerHTML = "";

    //creating new month title
    let MY = document.createElement('h2');
    MY.innerHTML = `${"" + curMonth + " " + curYear}`;

    MY_div.appendChild(MY);
}

//------------------------ SECTION: POPUP HANDLERS --------------------------//
//Activate Pop-up
function popUp(elm) {
    pop_All_Down(); //forces all others to deactivate
    let id = elm.name;
    document.getElementById(id).style.display = "block";
    console.log(id);
}

//Deactivate Pop-up
function popDown(elm) {
    let id = elm.name;
    document.getElementById(id).style.display = "none";
}

//Forces all Pop-ups to Deactivate (allows for decluttering)
function pop_All_Down() {
    let pop_ups = document.getElementsByClassName("pop-up");
    for (let i = 0; i < pop_ups.length; i++) {
        popDown(pop_ups[i]);
    }
}

//------------------------ SECTION: EVENT MANIPULATION --------------------------//
/*
* Section includes:
* - Daily Event Display
* - Add Event
*/
function displayDailyEvents(d, days, id) {
    //formatting the date range for SQL
    let curMonthId = currentMonth.month;
    let curYear = String(currentMonth.year);
    const num_months = [];
    num_months.push("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    let day = days[d].getDate();
    let day2 = days[d].deltaDays(1).getDate();
    if (String(day).length < 2) {
        day = "0" + day;
    }
    startDate = "" + curYear + "-" + num_months[curMonthId] + "-" + day + " 00:00:00";
    endDate = "" + curYear + "-" + num_months[curMonthId] + "-" + day2 + " 00:00:00";

    //retrieving and displaying the events
    const getEvents = async () => {
        //retireving
        const pathToPhpFile = 'display-events.php';
        const data = { 'startDate': startDate, 'endDate': endDate};
        const response = await fetch(pathToPhpFile, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        const event_results = await response.json();
        //checks that events actually exist then formats & displays
        if (event_results.success) {
            let events = event_results.result;
            //displaying
            let all_events_div = document.getElementById(id);
            if (events.length > 0) {
                for (let i = 0; i < events.length; i++) {
                    let time = events[i].datetime;
                    time = time.substring(11, 16);
                    let event_div = document.createElement('div');
                    event_div.innerHTML = `
                    <div class="event-div" id="${events[i].event_id}">
                        <p>${time}<b> ${events[i].title}</b></p>
                        <p class="loc">${events[i].location} id: ${events[i].event_id}<p>
                    </div>
                `;
                    all_events_div.appendChild(event_div);
                }
            }
        }
        else{
            console.log('daily events empty');
        }

    }
    getEvents();
}

//Adding an event to the database then update the calendar
const addEventForm = document.getElementById("add-event");
addEventForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let title = document.getElementById("title").value;
    let datetime = document.getElementById("datetime").value;
    let location = document.getElementById("location").value;
    const token = sessionStorage.getItem('token'); 

    const pathToPhpFile = 'add-event.php';
    const data = { 'title': title, 'location': location, 'datetime': datetime, 'token': token };
    const response = fetch(pathToPhpFile, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(res => res.json())
        .then(response => console.log(response.message))
        .catch(error => console.error('Error:', error));
    updateCalendar();
    pop_All_Down();
});

///-------------------- SECTION: PURELY CREATIVE PORTION ---------------------------------///
/*
* This section contains code for:
* - Event Sharing
* - Displaying of Shared Items
* Creative Portion items included earlier in this script:
* - Events have a location
* - Pop-up Handlers
*/

//CREATIVE PORTION: User can allow others to view an event read more in readMe
/* note: 
* - user id instead of user name used for safety reasons so that only 
*   friends know eachother's ids since usernames can be public
* - event id used since duplicate titles for repeated events may exist
*/
const shareEventForm = document.getElementById("share-event");
shareEventForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let share_id = document.getElementById("share-id").value;
    let share_user = document.getElementById("share-user").value;
    const token = sessionStorage.getItem('token'); 
    const pathToPhpFile = 'share-event.php';
    const data = { 'share_id': share_id, 'share_user': share_user, 'token': token };
    const response = fetch(pathToPhpFile, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(res => res.json())
        .then(response => console.log(response.message))
        .catch(error => console.error('Error:', error));
    pop_All_Down();
});

/*
* Specialized display for shared items. lists...
* - Time of event
* - Name of Event
* - Who it's shared by
*/
function displayDailyShared(d, days, id) {
    //formatting the date range for SQL
    let curMonthId = currentMonth.month;
    let curYear = String(currentMonth.year);
    const num_months = [];
    num_months.push("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    let day = days[d].getDate();
    let day2 = days[d].deltaDays(1).getDate();
    if (String(day).length < 2) {
        day = "0" + day;
    }
    let startDate = "" + curYear + "-" + num_months[curMonthId] + "-" + day + " 00:00:00";
    let endDate = "" + curYear + "-" + num_months[curMonthId] + "-" + day2 + " 00:00:00";

    //retrieving and displaying the events
    const getShared = async () => {
        //retireving
        const pathToPhpFile = 'display-shared.php';
        const data = { 'startDate': startDate, 'endDate': endDate };
        const response = await fetch(pathToPhpFile, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        const event_results = await response.json();
        //Checking if events exist, formatting and displaying if so
        if (event_results.success) {
            let events = event_results.result;
            //displaying
            let all_events_div = document.getElementById(id);
            if (events.length > 0) {
                for (let i = 0; i < events.length; i++) {
                    let time = events[i].datetime;
                    time = time.substring(11, 16);
                    let event_div = document.createElement('div');
                    event_div.innerHTML = `
                <div class="shared-div" id="${events[i].event_id}">
                    <p><em>Shared by ${events[i].owner_id}<em></p>
                    <p>${time} ${events[i].title}</p>
                </div>
            `;
                    all_events_div.appendChild(event_div);
                }
            }
        }

    }
    getShared();
}