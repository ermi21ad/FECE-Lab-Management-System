document.addEventListener('DOMContentLoaded', () => {
    console.log('Reports & Logs loaded');

    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
    listBtn.addEventListener('click', () => listDropdown.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) listDropdown.classList.add('hidden');
    });

    document.querySelectorAll('button.bg-gray-500').forEach(btn => {
        btn.addEventListener('click', () => alert('Exporting report as PDF/Excel...'));
    });
});
