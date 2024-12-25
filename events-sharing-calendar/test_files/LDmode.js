//Light Mode / Dark Mode toggle handler
const toggleDark = () => {
    let r = document.querySelector(':root');
    let rs = getComputedStyle(r);
    
    //swap out root colour variables (inverts colour)
    if (rs.getPropertyValue('--bg') === 'rgb(26, 22, 62)') {
        r.style.setProperty('--bg', 'rgb(246, 235, 221)');
        r.style.setProperty('--text-color', 'rgb(26, 22, 62)');
    } else {
        r.style.setProperty('--bg', 'rgb(26, 22, 62)');
        r.style.setProperty('--text-color', 'rgb(246, 235, 221)');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("ld").addEventListener("click", toggleDark, false);
});