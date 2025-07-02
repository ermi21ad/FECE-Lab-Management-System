document.addEventListener('DOMContentLoaded', () => {
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');

    listBtn.addEventListener('click', () => {
        listDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!listBtn.contains(event.target) && !listDropdown.contains(event.target)) {
            listDropdown.classList.add('hidden');
        }
    });
});