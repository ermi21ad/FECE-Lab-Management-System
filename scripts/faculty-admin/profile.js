document.addEventListener('DOMContentLoaded', () => {
  const userInitial = document.getElementById('user-initial');
  const userName = document.getElementById('user-name');
  const profilePic = document.getElementById('profile-pic');
  const fullNameInput = document.querySelector('input[name="full_name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneNumberInput = document.querySelector('input[name="phone_number"]');
  const addressInput = document.querySelector('input[name="address"]');
  const adminIdInput = document.querySelector('input[name="admin_id"]');

  // Fetch profile
  async function fetchProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch('/api/faculty-profile', {
        headers: { 'Authorization': `Bearer ${token}` }

      });
      const profile = await response.json();
      if (!response.ok) throw new Error(profile.message);

      // Populate fields
      fullNameInput.value = profile.full_name;
      emailInput.value = profile.email;
      phoneNumberInput.value = profile.phone_number;
      addressInput.value = profile.address;
      adminIdInput.value = profile.admin_id;
      profilePic.src = profile.profile_picture;

      // Update header
      userName.textContent = profile.full_name;
      userInitial.textContent = profile.full_name.charAt(0).toUpperCase();
    } catch (err) {
      console.error('Error fetching profile:', err);
      alert('Failed to load profile: ' + err.message);
    }
  }

  // Initial load
  fetchProfile();
});