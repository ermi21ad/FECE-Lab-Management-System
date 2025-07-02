// lab-management-system/scripts/global.js
document.addEventListener('DOMContentLoaded', () => {
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
    const userName = document.getElementById('user-name');
  
    if (listBtn && listDropdown) {
      listBtn.addEventListener('click', () => {
        listDropdown.classList.toggle('hidden');
      });
  
      document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
          listDropdown.classList.add('hidden');
        }
      });
    }
  
    // Mock user name (replace with backend fetch later)
    if (userName) {
      userName.textContent = localStorage.getItem('role')?.replace('-', ' ') || 'User';
    }
  });