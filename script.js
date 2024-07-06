let toggle = false;

function showsidebar() {
    toggle = !toggle; 
    render(); 

function render() {
    const toggleDiv = document.querySelector('.toggle-div'); // Assuming you give a class 'toggle-div' to your toggle div

    if (toggle === false) {
        toggleDiv.style.display = 'block'; // Show the toggle div
    } else {
        toggleDiv.style.display = 'none'; // Hide the toggle div
    }
}
}