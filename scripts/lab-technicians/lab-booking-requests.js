document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Booking Requests page loaded', { 
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

  const studentEquipmentTableBody = document.getElementById('student-equipment-table-body');
  const studentLabTableBody = document.getElementById('student-lab-table-body');
  const lecturerTableBody = document.getElementById('lecturer-table-body');
  const bookingModal = document.getElementById('booking-modal');
  const modalContent = document.getElementById('modal-content');
  const closeBookingModal = document.getElementById('close-booking-modal');
  const approveBooking = document.getElementById('approve-booking');
  const rejectBooking = document.getElementById('reject-booking');
  const listBtn = document.getElementById('list-btn');
  const listDropdown = document.getElementById('list-dropdown');

  let studentEquipmentRequests = [];
  let studentLabRequests = [];
  let lecturerRequests = [];

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

  // Fetch requests
  const fetchRequests = async () => {
    try {
      console.log('Fetching requests with token:', token ? '[Truncated]' : '[Missing]');
      const response = await fetch('/api/lab-technician-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Requests fetch response:', { status: response.status, data });

      if (response.ok) {
        studentEquipmentRequests = data.studentEquipmentRequests || [];
        studentLabRequests = data.studentLabRequests || [];
        lecturerRequests = data.lecturerRequests || [];
        console.log('Requests fetched:', {
          studentEquipment: studentEquipmentRequests.length,
          studentLab: studentLabRequests.length,
          lecturer: lecturerRequests.length
        });
        renderTables();
      } else {
        console.error('Requests fetch failed:', { status: response.status, message: data.message });
        alert(`Failed to load requests: ${data.message || 'Unknown error'}`);
        if (response.status === 401 || response.status === 403) {
          console.warn('Unauthorized or forbidden, redirecting to login');
          localStorage.clear();
          window.location.href = '/login.html';
        }
      }
    } catch (err) {
      console.error('Requests fetch error:', err.message, err.stack);
      alert(`Failed to load requests: ${err.message || 'Network error'}`);
    }
  };

  // Render tables
  const renderTables = () => {
    // Student Equipment Requests
    studentEquipmentTableBody.innerHTML = '';
    studentEquipmentRequests.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${item.student_id || 'N/A'}</td>
        <td class="p-2">${item.equipment_name || 'N/A'}</td>
        <td class="p-2">${item.purpose || 'N/A'}</td>
        <td class="p-2">${item.duration_hours || 'N/A'}</td>
        <td class="p-2">${item.status || 'N/A'}</td>
        <td class="p-2">
          <button class="view-btn text-gray-700 hover:text-gray-900 mr-2" title="View Details" data-id="${item.request_id}" data-type="student-equipment"><i class="fas fa-eye"></i></button>
          <button class="reject-btn text-gray-700 hover:text-gray-900" title="Reject" data-id="${item.request_id}" data-type="student-equipment"><i class="fas fa-times"></i></button>
        </td>
      `;
      studentEquipmentTableBody.appendChild(row);
    });

    // Student Lab Requests
    studentLabTableBody.innerHTML = '';
    studentLabRequests.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${item.purpose || 'N/A'}</td>
        <td class="p-2">${item.date_time ? new Date(item.date_time).toLocaleString() : 'N/A'}</td>
        <td class="p-2">${item.lab || 'N/A'}</td>
        <td class="p-2">${item.group_members || 'N/A'}</td>
        <td class="p-2">${item.status || 'N/A'}</td>
        <td class="p-2">
          <button class="view-btn text-gray-700 hover:text-gray-900 mr-2" title="View Details" data-id="${item.request_id}" data-type="student-lab"><i class="fas fa-eye"></i></button>
          <button class="reject-btn text-gray-700 hover:text-gray-900" title="Reject" data-id="${item.request_id}" data-type="student-lab"><i class="fas fa-times"></i></button>
        </td>
      `;
      studentLabTableBody.appendChild(row);
    });

    // Lecturer Requests
    lecturerTableBody.innerHTML = '';
    lecturerRequests.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${item.request_id || 'N/A'}</td>
        <td class="p-2">${item.type || 'N/A'}</td>
        <td class="p-2">${item.requested_by || 'N/A'}</td>
        <td class="p-2">${item.details || 'N/A'}</td>
        <td class="p-2">${item.status || 'N/A'}</td>
        <td class="p-2">${item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</td>
        <td class="p-2">${item.updated_at ? new Date(item.updated_at).toLocaleString() : 'N/A'}</td>
      `;
      lecturerTableBody.appendChild(row);
    });
  };

  // Open booking modal
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.view-btn');
    if (viewBtn) {
      const requestId = viewBtn.dataset.id;
      const requestType = viewBtn.dataset.type;
      let request;

      if (requestType === 'student-equipment') {
        request = studentEquipmentRequests.find(r => r.request_id === requestId);
        modalContent.innerHTML = `
          <p><strong>Request ID:</strong> ${request.request_id || 'N/A'}</p>
          <p><strong>Student ID:</strong> ${request.student_id || 'N/A'}</p>
          <p><strong>Equipment:</strong> ${request.equipment_name || 'N/A'}</p>
          <p><strong>Purpose:</strong> ${request.purpose || 'N/A'}</p>
          <p><strong>Duration (Hours):</strong> ${request.duration_hours || 'N/A'}</p>
          <p><strong>Status:</strong> ${request.status || 'N/A'}</p>
          <div><label class="block text-sm font-medium text-gray-700">Preparation Notes</label><textarea class="mt-1 w-full p-2 border rounded-md" rows="3" placeholder="e.g., Check equipment availability"></textarea></div>
          <div><label class="block text-sm font-medium text-gray-700">Rejection Reason</label><input type="text" class="mt-1 w-full p-2 border rounded-md" placeholder="e.g., Equipment unavailable"></div>
        `;
      } else if (requestType === 'student-lab') {
        request = studentLabRequests.find(r => r.request_id === requestId);
        modalContent.innerHTML = `
          <p><strong>Request ID:</strong> ${request.request_id || 'N/A'}</p>
          <p><strong>Purpose:</strong> ${request.purpose || 'N/A'}</p>
          <p><strong>Date & Time:</strong> ${request.date_time ? new Date(request.date_time).toLocaleString() : 'N/A'}</p>
          <p><strong>Lab:</strong> ${request.lab || 'N/A'}</p>
          <p><strong>Group Members:</strong> ${request.group_members || 'N/A'}</p>
          <p><strong>Status:</strong> ${request.status || 'N/A'}</p>
          <div><label class="block text-sm font-medium text-gray-700">Preparation Notes</label><textarea class="mt-1 w-full p-2 border rounded-md" rows="3" placeholder="e.g., Prepare lab setup"></textarea></div>
          <div><label class="block text-sm font-medium text-gray-700">Rejection Reason</label><input type="text" class="mt-1 w-full p-2 border rounded-md" placeholder="e.g., Lab unavailable"></div>
        `;
      } else if (requestType === 'lecturer') {
        request = lecturerRequests.find(r => r.request_id === requestId);
        modalContent.innerHTML = `
          <p><strong>Request ID:</strong> ${request.request_id || 'N/A'}</p>
          <p><strong>Type:</strong> ${request.type || 'N/A'}</p>
          <p><strong>Requested By:</strong> ${request.requested_by || 'N/A'}</p>
          <p><strong>Details:</strong> ${request.details || 'N/A'}</p>
          <p><strong>Status:</strong> ${request.status || 'N/A'}</p>
          <p><strong>Created At:</strong> ${request.created_at ? new Date(request.created_at).toLocaleString() : 'N/A'}</p>
          <p><strong>Updated At:</strong> ${request.updated_at ? new Date(request.updated_at).toLocaleString() : 'N/A'}</p>
          <div><label class="block text-sm font-medium text-gray-700">Preparation Notes</label><textarea class="mt-1 w-full p-2 border rounded-md" rows="3" placeholder="e.g., Check requirements"></textarea></div>
          <div><label class="block text-sm font-medium text-gray-700">Rejection Reason</label><input type="text" class="mt-1 w-full p-2 border rounded-md" placeholder="e.g., Request conflicts"></div>
        `;
      }

      if (request) {
        bookingModal.classList.remove('hidden');
      }
    }
  });

  // Close booking modal
  closeBookingModal.addEventListener('click', () => {
    bookingModal.classList.add('hidden');
    modalContent.innerHTML = '';
  });

  // Initialize
  fetchRequests();
});