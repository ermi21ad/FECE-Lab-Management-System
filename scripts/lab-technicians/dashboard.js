document.addEventListener('DOMContentLoaded', () => {
    console.log('Lab Technician Dashboard loaded');

    // Dropdown menu
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');

    listBtn.addEventListener('click', () => {
        listDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
            listDropdown.classList.add('hidden');
        }
    });

    // Mock user name (replace with actual data from backend)
    document.getElementById('user-name').textContent = 'Technician Ermias'; // Example

    // Button actions (mock)
    document.querySelectorAll('.bg-gray-500').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim().split(' ').slice(1).join(' ');
            alert(`${action} clicked! Redirecting to respective page...`);
            // Add navigation logic here (e.g., window.location.href = 'lab-booking-requests.html')
        });
    });
});