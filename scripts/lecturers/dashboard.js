
document.addEventListener('DOMContentLoaded', () => {
    console.log('Lecturer Dashboard loaded');

    // Dropdown menu
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
    listBtn.addEventListener('click', () => listDropdown.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
            listDropdown.classList.add('hidden');
        }
    });

    // Mock interactivity for widgets (e.g., clicking for details)
    document.querySelectorAll('.bg-white').forEach(widget => {
        widget.addEventListener('click', () => {
            const title = widget.querySelector('h3').textContent;
            alert(`Clicked on "${title}" - More details coming soon!`);
        });
    });
});