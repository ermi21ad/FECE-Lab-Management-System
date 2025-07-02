document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Lab Technician Profile page loaded', { 
    token: token ? '[Present]' : '[Missing]', 
    role, 
    roleLength: role ? role.length : 0, 
    roleType: typeof role 
  });

  // Normalize role for comparison
  const normalizedRole = role ? role.trim().toLowerCase() : null;
  if (!token || normalizedRole !== 'lab-technician') {
    console.warn('No token or incorrect role, redirecting to login', { 
      token: token ? '[Truncated]' : '[Missing]', 
      role, 
      normalizedRole 
    });
    localStorage.clear();
    window.location.href = '/login.html';
    return;
  }

  const userName = document.getElementById('user-name');
  const userInitial = document.getElementById('user-initial');
  const profileForm = document.getElementById('profile-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const profilePic = document.getElementById('profile-pic');
  const profilePicUpload = document.getElementById('profile-pic-upload');
  const listBtn = document.getElementById('list-btn');
  const listDropdown = document.getElementById('list-dropdown');
  const fullNameInput = profileForm.querySelector('input[name="full_name"]');
  const emailInput = profileForm.querySelector('input[name="email"]');
  const assignedLabInput = profileForm.querySelector('input[name="assigned_lab_id"]');
  const currentPasswordInput = profileForm.querySelector('input[name="current_password"]');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Fallback for profile picture
  profilePic.onerror = () => {
    console.warn('Profile picture not found, using fallback');
    profilePic.src = 'https://via.placeholder.com/96?text=Profile';
  };

  // Toggle dropdown
  listBtn.addEventListener('click', () => {
    listDropdown.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
      listDropdown.classList.add('hidden');
    }
  });

  // Fetch profile
  const fetchProfile = async () => {
    try {
      console.log('Fetching profile with token:', token ? '[Truncated]' : '[Missing]');
      const response = await fetch('/api/lab-technician-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Profile fetch response:', { status: response.status, data });
      if (response.ok) {
        console.log('Profile fetched:', data);
        fullNameInput.value = data.full_name || '';
        emailInput.value = data.email || '';
        assignedLabInput.value = data.assigned_lab_id || '';
        userName.textContent = data.full_name || 'Technician';
        userInitial.textContent = data.full_name ? data.full_name[0].toUpperCase() : 'T';
        if (data.profile_picture) {
          profilePic.src = `data:image/jpeg;base64,${data.profile_picture}`;
        }
      } else {
        console.error('Profile fetch failed:', { status: response.status, message: data.message, token: token ? '[Truncated]' : '[Missing]' });
        alert(`Failed to load profile: ${data.message || 'Unknown error'}`);
        if (response.status === 401 || response.status === 403) {
          console.warn('Unauthorized or forbidden, redirecting to login');
          localStorage.clear();
          window.location.href = '/login.html';
        }
      }
    } catch (err) {
      console.error('Profile fetch error:', err.message, err.stack);
      alert(`Failed to load profile: ${err.message || 'Network error'}`);
    }
  };

  // Preview profile picture
  profilePicUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        profilePic.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file');
      profilePicUpload.value = '';
    }
  });

  // Reset form
  cancelBtn.addEventListener('click', () => {
    fetchProfile();
    profileForm.reset();
    profilePic.src = '/assets/images/default-profile.jpg';
  });

  // Submit profile updates
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('full_name', fullNameInput.value);
    formData.append('email', emailInput.value);
    if (currentPasswordInput.value) formData.append('current_password', currentPasswordInput.value);
    if (newPasswordInput.value) formData.append('new_password', newPasswordInput.value);
    if (confirmPasswordInput.value) formData.append('confirm_password', confirmPasswordInput.value);
    if (profilePicUpload.files[0]) formData.append('profile_picture', profilePicUpload.files[0]);

    console.log('Submitting profile update', Object.fromEntries(formData.entries()));

    try {
      const response = await fetch('/api/lab-technician-profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log('Profile update response:', { status: response.status, data });

      if (response.ok) {
        alert('Profile updated successfully!');
        profileForm.reset();
        profilePic.src = '/assets/images/default-profile.jpg';
        fetchProfile();
      } else {
        console.error('Profile update failed:', { status: response.status, message: data.message });
        alert(`Failed to update profile: ${data.message || 'Unknown error'}`);
        if (response.status === 401 || response.status === 403) {
          console.warn('Unauthorized or forbidden, redirecting to login');
          localStorage.clear();
          window.location.href = '/login.html';
        }
      }
    } catch (err) {
      console.error('Profile update error:', err.message, err.stack);
      alert(`Failed to update profile: ${err.message || 'Network error'}`);
    }
  });

  // Initialize
  fetchProfile();
});