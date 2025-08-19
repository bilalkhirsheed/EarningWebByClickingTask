let toggle = true;

function showsidebar() {
    toggle = !toggle; 
    render(); 

function render() {
    const toggleDiv = document.querySelector('.toggle-div'); // Assuming you give a class 'toggle-div' to your toggle div

    if (toggle === false) {
        toggleDiv.style.display = 'block'; // Show the toggle div
       
        document.getElementById('close-icon').classList.remove('hidden');
        document.getElementById('bars-icon').classList.add('hidden');
    } else {
        toggleDiv.style.display = 'none'; // Hide the toggle div
        document.getElementById('close-icon').classList.add('hidden');
        document.getElementById('bars-icon').classList.remove('hidden');
    }
}
}