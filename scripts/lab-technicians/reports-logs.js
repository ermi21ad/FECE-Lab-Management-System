document.addEventListener('DOMContentLoaded', () => {
    console.log('Reports & Logs loaded');

    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
    listBtn.addEventListener('click', () => listDropdown.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) listDropdown.classList.add('hidden');
    });

    document.getElementById('equipment-report-btn').addEventListener('click', () => alert('Generating Equipment Usage Report...'));
    document.getElementById('session-report-btn').addEventListener('click', () => alert('Generating Lab Session Report...'));
    document.getElementById('maintenance-report-btn').addEventListener('click', () => alert('Generating Maintenance Logs...'));
    document.getElementById('audit-report-btn').addEventListener('click', () => alert('Generating Audit Logs...'));
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => alert('Downloading report...'));
    });
});