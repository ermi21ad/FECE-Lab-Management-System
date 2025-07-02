document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  console.log('Profile Settings loaded', { token: token ? '[Present]' : '[Missing]', role });

  if (!token || role !== 'lecturer') {
    console.warn('No token or incorrect role, redirecting to login');
    window.location.href = '/login.html';
    return;
  }

  const profileForm = document.getElementById('profile-form');
  const userName = document.getElementById('user-name');
  const profileInitial = document.getElementById('profile-initial');
  const profilePicture = document.getElementById('profile-picture');
  const listBtn = document.getElementById('list-btn');
  const listDropdown = document.getElementById('list-dropdown');

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      console.log('Fetching profile data with token:', token.slice(0, 10) + '...');
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Profile fetch status:', response.status, response.statusText);

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('JSON parse error:', err.message, response.statusText);
        throw new Error('Invalid response format');
      }

      console.log('Profile response data:', data);

      if (!response.ok) {
        console.error('Fetch failed:', { status: response.status, message: data?.message });
        if (response.status === 404) {
          throw new Error('Profile endpoint not found');
        }
        throw new Error(data?.message || `HTTP error: ${response.status}`);
      }

      if (!data || typeof data !== 'object') {
        console.error('Invalid response data:', data);
        throw new Error('No profile data returned');
      }

      // Populate form
      profileForm.querySelector('[name="full_name"]').value = data.full_name || '';
      profileForm.querySelector('[name="email"]').value = data.email || '';
      profileForm.querySelector('[name="assigned_courses"]').value = data.assigned_courses || '';

      // Update header
      userName.textContent = data.full_name || 'Lecturer';
      profileInitial.textContent = data.full_name ? data.full_name[0].toUpperCase() : 'L';
      profilePicture.textContent = data.full_name ? data.full_name[0].toUpperCase() : 'A';

      console.log('Profile populated successfully');
    } catch (err) {
      console.error('Fetch profile error:', err.message, err);
      alert(`Failed to load profile: ${err.message || 'Network error'}`);
    }
  };

  // Handle form submission
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(profileForm);
    
    const data = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      assigned_courses: formData.get('assigned_courses'),
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      profile_picture: formData.get('profile_picture') ? 'uploaded' : null,
    };

    // Validate passwords
    const confirmNewPassword = formData.get('confirmNewPassword');
    if (data.newPassword && data.newPassword !== confirmNewPassword) {
      console.warn('Password confirmation does not match');
      alert('New password and confirmation do not match');
      return;
    }

    console.log('Submitting profile update:', {
      full_name: data.full_name,
      email: data.email,
      assigned_courses: data.assigned_courses,
      currentPassword: data.currentPassword ? '[Provided]' : '[Not provided]',
      newPassword: data.newPassword ? '[Provided]' : '[Not provided]',
      profile_picture: data.profile_picture || '[Not provided]'
    });

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Update response:', { status: response.status, result });

      if (response.ok) {
        alert('Profile updated successfully');
        fetchProfile();
      } else {
        console.error('Update failed:', result.message);
        alert(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err.message, err);
      alert(`Failed to update profile: ${err.message || 'Network error'}`);
    }
  });

  // Dropdown toggle
  listBtn.addEventListener('click', () => {
    console.log('Toggling dropdown');
    listDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
      console.log('Closing dropdown');
      listDropdown.classList.add('hidden');
    }
  });

  // Initialize
  fetchProfile();
});