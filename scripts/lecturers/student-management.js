document.addEventListener('DOMContentLoaded', () => {
    console.log('Student Management loaded');

    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
    listBtn.addEventListener('click', () => listDropdown.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) listDropdown.classList.add('hidden');
    });

    const noteModal = document.getElementById('note-modal');
    const closeNoteModal = document.getElementById('close-note-modal');
    const noteForm = document.getElementById('note-form');

    document.querySelectorAll('.msg-btn').forEach(btn => {
        btn.addEventListener('click', () => alert('Messaging student...'));
    });

    document.querySelectorAll('.note-btn').forEach(btn => {
        btn.addEventListener('click', () => noteModal.classList.remove('hidden'));
    });
    closeNoteModal.addEventListener('click', () => noteModal.classList.add('hidden'));
    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Note added successfully!');
        noteModal.classList.add('hidden');
    });
});
