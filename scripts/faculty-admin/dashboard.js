document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded');

    // Placeholder for dashboard-specific code
    // Add your dashboard functionality here

    // Dropdown menu code
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');

    listBtn.addEventListener('click', () => {
        listDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
            listDropdown.classList.add('hidden');
        }
    });
});