document.addEventListener('DOMContentLoaded', () => {
    console.log('Audit Logs loaded');

    const logCategorySelect = document.getElementById('log-category');
    const exportTypeSelect = document.getElementById('export-type');

    logCategorySelect.addEventListener('change', () => {
        alert(`Filtering logs by: ${logCategorySelect.value}`);
    });

    exportTypeSelect.addEventListener('change', () => {
        const format = exportTypeSelect.value;
        if (format !== 'Export as...') {
            alert(`Logs exported as ${format}!`);
            exportTypeSelect.value = 'Export as...';
        }
    });

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