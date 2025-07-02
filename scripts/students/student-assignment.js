document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  console.log('Assignment page loaded', { token: token ? '[Present]' : '[Missing]', role });

  if (!token || role !== 'student') {
    console.warn('No token or incorrect role, redirecting to login');
    window.location.href = '/login.html';
    return;
  }

  const submissionForm = document.getElementById('submission-form');
  const userName = document.getElementById('user-name');
  const userInitial = document.getElementById('user-initial');

  // Fetch student profile for name and initial
  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/student-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        userName.textContent = data.full_name || 'Student';
        userInitial.textContent = data.full_name ? data.full_name[0].toUpperCase() : 'S';
      } else {
        console.error('Profile fetch failed:', data.message);
      }
    } catch (err) {
      console.error('Profile fetch error:', err.message);
    }
  };

  // Handle form submission
  submissionForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(submissionForm);
    
    console.log('Submitting assignment', Object.fromEntries(formData.entries()));

    try {
      const response = await fetch('/api/student-assignments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log('Submission response:', data);

      if (response.ok) {
        alert('Lab report submitted successfully!');
        submissionForm.reset();
      } else {
        console.error('Submission failed:', data.message);
        alert(`Failed to submit: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Submission error:', err.message);
      alert(`Failed to submit: ${err.message || 'Network error'}`);
    }
  });

  // Initialize
  fetchProfile();
});