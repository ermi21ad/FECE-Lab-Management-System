document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('Profile Settings loaded', { token: token ? '[Present]' : '[Missing]', role });
  
    if (!token || role !== 'student') {
      console.warn('No token or incorrect role, redirecting to login');
      window.location.href = '/login.html';
      return;
    }
  
    const personalInfoForm = document.getElementById('personal-info-form');
    const passwordForm = document.getElementById('password-form');
    const userName = document.getElementById('user-name');
    const profilePicture = document.querySelector('.w-10.h-10.rounded-full');
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const downloadQrBtn = document.getElementById('download-qr-btn');
    const qrCodeDiv = document.getElementById('qrcode');
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
  
    if (!personalInfoForm) {
      console.error('Personal info form not found: #personal-info-form');
      alert('Error: Profile form not found');
      return;
    }
  
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile data with token:', token.slice(0, 10) + '...');
        const response = await fetch('/api/student-profile', {
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
          if (response.status === 401) {
            console.warn('Authentication failed, redirecting to login');
            localStorage.clear();
            window.location.href = '/login.html';
            return;
          }
          throw new Error(data?.message || `HTTP error: ${response.status}`);
        }
  
        if (!data || typeof data !== 'object') {
          console.error('Invalid response data:', data);
          throw new Error('No profile data returned');
        }
  
        // Populate form
        const fullNameInput = personalInfoForm.querySelector('#fullName');
        const studentIdInput = personalInfoForm.querySelector('#studentId');
        const emailInput = personalInfoForm.querySelector('input[name="email"]');
        const batchInput = personalInfoForm.querySelector('input[name="batch"]');
  
        if (!fullNameInput || !studentIdInput || !emailInput || !batchInput) {
          console.error('Form inputs missing:', {
            fullName: !!fullNameInput,
            studentId: !!studentIdInput,
            email: !!emailInput,
            batch: !!batchInput
          });
          throw new Error('One or more form inputs not found');
        }
  
        fullNameInput.value = data.full_name || '';
        studentIdInput.value = data.student_id || '';
        emailInput.value = data.email || '';
        batchInput.value = data.batch || '';
  
        // Update header
        userName.textContent = data.full_name || 'Student';
        profilePicture.textContent = data.full_name ? data.full_name[0].toUpperCase() : 'S';
  
        console.log('Profile populated successfully');
        return data;
      } catch (err) {
        console.error('Fetch profile error:', err.message, err);
        alert(`Failed to load profile: ${err.message || 'Network error'}`);
        return null;
      }
    };
  
    // Handle personal info form submission
    personalInfoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(personalInfoForm);
      
      const data = {
        full_name: formData.get('fullName'),
        email: formData.get('email'),
        batch: formData.get('batch'),
        profile_picture: document.getElementById('profile-pic-upload').files.length ? 'uploaded' : null,
      };
  
      console.log('Submitting personal info update:', {
        full_name: data.full_name,
        email: data.email,
        batch: data.batch,
        profile_picture: data.profile_picture || '[Not provided]'
      });
  
      try {
        const response = await fetch('/api/student-profile', {
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
          if (response.status === 401) {
            console.warn('Authentication failed, redirecting to login');
            localStorage.clear();
            window.location.href = '/login.html';
            return;
          }
          alert(result.message || 'Failed to update profile');
        }
      } catch (err) {
        console.error('Update profile error:', err.message, err);
        alert(`Failed to update profile: ${err.message || 'Network error'}`);
      }
    });
  
    // Handle password form submission
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
  
      if (newPassword !== confirmPassword) {
        console.warn('Password confirmation does not match');
        alert('New password and confirmation do not match');
        return;
      }
  
      const data = {
        currentPassword,
        newPassword
      };
  
      console.log('Submitting password update:', {
        currentPassword: currentPassword ? '[Provided]' : '[Not provided]',
        newPassword: newPassword ? '[Provided]' : '[Not provided]'
      });
  
      try {
        const response = await fetch('/api/student-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
        console.log('Password update response:', { status: response.status, result });
  
        if (response.ok) {
          alert('Password updated successfully');
        } else {
          console.error('Password update failed:', result.message);
          if (response.status === 401) {
            console.warn('Authentication failed, redirecting to login');
            localStorage.clear();
            window.location.href = '/login.html';
            return;
          }
          alert(result.message || 'Failed to update password');
        }
      } catch (err) {
        console.error('Password update error:', err.message, err);
        alert(`Failed to update password: ${err.message || 'Network error'}`);
      }
    });
  
    // QR Code Generator
    generateQrBtn.addEventListener('click', async () => {
      const data = await fetchProfile();
      if (!data) {
        console.error('Cannot generate QR code: No profile data');
        alert('Failed to generate QR code: No profile data');
        return;
      }
  
      const qrData = `Name: ${data.full_name}\nStudent ID: ${data.student_id}`;
      console.log('Generating QR code with data:', qrData);
  
      qrCodeDiv.innerHTML = '';
      new QRCode(qrCodeDiv, {
        text: qrData,
        width: 200,
        height: 200
      });
    });
  
    // Download QR Code
    downloadQrBtn.addEventListener('click', () => {
      const canvas = qrCodeDiv.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        console.log('QR code downloaded');
      } else {
        console.error('No QR code canvas found');
        alert('No QR code to download');
      }
    });
  
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
      button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
      });
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