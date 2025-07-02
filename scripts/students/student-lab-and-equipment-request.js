document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  console.log('Lab & Equipment Booking page loaded', { token: token ? '[Present]' : '[Missing]', role });

  if (!token || role !== 'student') {
    console.warn('No token or incorrect role, redirecting to login');
    window.location.href = '/login.html';
    return;
  }

  const userName = document.getElementById('user-name');
  const userInitial = document.getElementById('user-initial');
  const showLabBookingBtn = document.getElementById('show-lab-booking');
  const showEquipmentBookingBtn = document.getElementById('show-equipment-booking');
  const labBookingSection = document.getElementById('lab-booking-section');
  const equipmentBookingSection = document.getElementById('equipment-booking-section');
  const newLabBookingBtn = document.getElementById('new-lab-booking-btn');
  const newEquipmentBookingBtn = document.getElementById('new-equipment-booking-btn');
  const labBookingModal = document.getElementById('lab-booking-modal');
  const equipmentBookingModal = document.getElementById('equipment-booking-modal');
  const closeLabBookingModal = document.getElementById('close-lab-booking-modal');
  const closeEquipmentBookingModal = document.getElementById('close-equipment-booking-modal');
  const labBookingForm = document.getElementById('lab-booking-form');
  const equipmentBookingForm = document.getElementById('equipment-booking-form');
  const labBookingHistory = document.getElementById('lab-booking-history').querySelector('tbody');
  const equipmentRequests = document.getElementById('equipment-requests').querySelector('tbody');

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

  // Fetch booking requests
  const fetchBookingRequests = async () => {
    try {
      const response = await fetch('/api/student-booking-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Booking requests fetched:', data.requests);
        updateBookingHistory(data.requests);
      } else {
        console.error('Fetch booking requests failed:', data.message);
        alert(`Failed to load booking requests: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Fetch booking requests error:', err.message);
      alert(`Failed to load booking requests: ${err.message || 'Network error'}`);
    }
  };

  // Update booking history tables
  const updateBookingHistory = (requests) => {
    labBookingHistory.innerHTML = '';
    equipmentRequests.innerHTML = '';

    requests.forEach(request => {
      if (request.request_type === 'Lab') {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="p-2">${request.purpose}</td>
          <td class="p-2">${request.booking_date} ${request.start_time}</td>
          <td class="p-2">${request.lab_room}</td>
          <td class="p-2 text-${request.status === 'Pending' ? 'yellow' : request.status === 'Approved' ? 'green' : 'red'}-600">${request.status}</td>
        `;
        labBookingHistory.appendChild(tr);
      } else {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="p-2">${request.equipment_name}</td>
          <td class="p-2">${request.start_date} to ${request.end_date}</td>
          <td class="p-2 text-${request.status === 'Pending' ? 'yellow' : request.status === 'Approved' ? 'green' : 'red'}-600">${request.status}</td>
        `;
        equipmentRequests.appendChild(tr);
      }
    });
  };

  // Toggle sections
  showLabBookingBtn.addEventListener('click', () => {
    labBookingSection.classList.remove('hidden');
    equipmentBookingSection.classList.add('hidden');
  });

  showEquipmentBookingBtn.addEventListener('click', () => {
    equipmentBookingSection.classList.remove('hidden');
    labBookingSection.classList.add('hidden');
  });

  // Open modals
  newLabBookingBtn.addEventListener('click', () => {
    labBookingModal.classList.remove('hidden');
  });

  newEquipmentBookingBtn.addEventListener('click', () => {
    equipmentBookingModal.classList.remove('hidden');
  });

  // Close modals
  closeLabBookingModal.addEventListener('click', () => {
    labBookingModal.classList.add('hidden');
  });

  closeEquipmentBookingModal.addEventListener('click', () => {
    equipmentBookingModal.classList.add('hidden');
  });

  // Submit lab booking
  labBookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(labBookingForm);
    const data = {
      request_type: 'Lab',
      purpose: formData.get('purpose'),
      course_name: formData.get('course_name'),
      lab_room: formData.get('lab_room'),
      booking_date: formData.get('booking_date'),
      start_time: formData.get('start_time'),
      duration_hours: parseInt(formData.get('duration_hours')),
      group_members: formData.get('group_members')
    };

    console.log('Submitting lab booking:', data);

    try {
      const response = await fetch('/api/student-booking-requests', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Lab booking response:', result);

      if (response.ok) {
        alert('Lab booking request submitted successfully!');
        labBookingForm.reset();
        labBookingModal.classList.add('hidden');
        fetchBookingRequests();
      } else {
        console.error('Lab booking failed:', result.message);
        alert(`Failed to submit lab booking: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Lab booking error:', err.message);
      alert(`Failed to submit lab booking: ${err.message || 'Network error'}`);
    }
  });

  // Submit equipment booking
  equipmentBookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(equipmentBookingForm);
    const data = {
      request_type: 'Equipment',
      purpose: formData.get('purpose'),
      equipment_name: formData.get('equipment_name'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      location: formData.get('location')
    };

    console.log('Submitting equipment booking:', data);

    try {
      const response = await fetch('/api/student-booking-requests', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Equipment booking response:', result);

      if (response.ok) {
        alert('Equipment booking request submitted successfully!');
        equipmentBookingForm.reset();
        equipmentBookingModal.classList.add('hidden');
        fetchBookingRequests();
      } else {
        console.error('Equipment booking failed:', result.message);
        alert(`Failed to submit equipment booking: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Equipment booking error:', err.message);
      alert(`Failed to submit equipment booking: ${err.message || 'Network error'}`);
    }
  });

  // Initialize
  fetchProfile();
  fetchBookingRequests();
});