document.addEventListener('DOMContentLoaded', () => {
    console.log('Student Dashboard loaded');

    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
    listBtn.addEventListener('click', () => listDropdown.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) listDropdown.classList.add('hidden');
    });

    document.querySelectorAll('button.text-blue-600').forEach(btn => {
        btn.addEventListener('click', () => alert('Viewing feedback details...'));
    });
});
