
//----------CALENDAR MATH: BASED FROM CS330 WIKI--------------------------------------------//
(function () { Date.prototype.deltaDays = function (c) { return new Date(this.getFullYear(), this.getMonth(), this.getDate() + c) }; Date.prototype.getSunday = function () { return this.deltaDays(-1 * this.getDay()) } })();
function Week(c) { this.sunday = c.getSunday(); this.nextWeek = function () { return new Week(this.sunday.deltaDays(7)) }; this.prevWeek = function () { return new Week(this.sunday.deltaDays(-7)) }; this.contains = function (b) { return this.sunday.valueOf() === b.getSunday().valueOf() }; this.getDates = function () { for (var b = [], a = 0; 7 > a; a++)b.push(this.sunday.deltaDays(a)); return b } }
function Month(c, b) { this.year = c; this.month = b; this.nextMonth = function () { return new Month(c + Math.floor((b + 1) / 12), (b + 1) % 12) }; this.prevMonth = function () { return new Month(c + Math.floor((b - 1) / 12), (b + 11) % 12) }; this.getDateObject = function (a) { return new Date(this.year, this.month, a) }; this.getWeeks = function () { var a = this.getDateObject(1), b = this.nextMonth().getDateObject(0), c = [], a = new Week(a); for (c.push(a); !a.contains(b);)a = a.nextWeek(), c.push(a); return c } };

var currentMonth = new Month(2024, 9); // October 2023

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function (event) {
    currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    alert("The new month is " + currentMonth.month + " " + currentMonth.year);
}, false);


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar() {
    //Clears previous calendar
    var cal = document.getElementById("calendar");
    cal.innerHTML = "";

    var cal_header = document.createElement('tr');
    cal_header.innerHTML = `
        <th>Sunday</th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
        <th>Saturday</th>
    `;
    var weeks = currentMonth.getWeeks();
    document.getElementById("calendar").appendChild(cal_header);
    for (var w in weeks) {
        var days = weeks[w].getDates();
        // days contains normal JavaScript Date objects.

        cal_week = document.createElement('tr');
        //loop through all days in a week and add to week
        for (var d in days) { 
            // console.log(days[d].toISOString());
            cal_day = document.createElement('td');
            cal_day.innerHTML = `
                <td>
                <div class="day">
                    <h4>${days[d].getDate()}<h4>
                </div>
                <div class="event-wrapper">
                    <p>events</p>
                </div>
                </td>
            `;
            cal_week.appendChild(cal_day);  
        }
        document.getElementById("calendar").appendChild(cal_week);
    }
}

/*
ABBY'S NOTES:
Calendar: 7 x 7 table
row 0: days of the week (starts from sunday) => in th, never changes
rows 1-6: actual days => week by week, each one is a td
CAN put divs inside td! :D
*/
