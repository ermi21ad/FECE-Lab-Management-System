
document.addEventListener('DOMContentLoaded', () => {
  // Authentication check
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  console.log('Requests page loaded', {
    token: token ? '[Present]' : '[Missing]',
    role,
    userId,
    userName
  });

  // Set user info in header
  if (userName) {
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-initial').textContent = userName.charAt(0).toUpperCase();
  }

  // Redirect if not authenticated or wrong role
  const normalizedRole = role ? role.trim().toLowerCase() : null;
  if (!token || normalizedRole !== 'faculty-admin') {
    console.warn('No token or incorrect role, redirecting to login', {
      token: token ? '[Present]' : '[Missing]',
      role,
      normalizedRole
    });
    localStorage.clear();
    window.location.href = '/login.html';
    return;
  }

  // DOM elements
  const lecturerRequestsBody = document.getElementById('lecturer-requests-body');
  const studentLabRequestsBody = document.getElementById('student-lab-requests-body');
  const studentEquipmentRequestsBody = document.getElementById('student-equipment-requests-body');
  const listBtn = document.getElementById('list-btn');
  const listDropdown = document.getElementById('list-dropdown');
  const logoutBtn = document.querySelector('[href="/login.html"]');

  // Verify DOM elements
  const elements = {
    lecturerRequestsBody,
    studentLabRequestsBody,
    studentEquipmentRequestsBody,
    listBtn,
    listDropdown,
    logoutBtn
  };
  Object.entries(elements).forEach(([key, value]) => {
    console.log(`DOM element ${key}: ${value ? 'Found' : 'Not found'}`);
  });

  // Data storage
  let lecturerRequests = [];
  let studentRequests = [];

  // Event listeners
  listBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Toggling dropdown');
    listDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!listBtn.contains(e.target) && !listDropdown.contains(e.target) && !listDropdown.classList.contains('hidden')) {
      console.log('Closing dropdown');
      listDropdown.classList.add('hidden');
    }
  });

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Logging out');
    localStorage.clear();
    window.location.href = '/login.html';
  });

  // Tab switching functions
  const showStudentRequests = () => {
    console.log('Switching to student requests tab');
    document.getElementById('student-requests').classList.remove('hidden');
    document.getElementById('lecturer-requests').classList.add('hidden');
  };

  const showLecturerRequests = () => {
    console.log('Switching to lecturer requests tab');
    document.getElementById('lecturer-requests').classList.remove('hidden');
    document.getElementById('student-requests').classList.add('hidden');
  };

  document.querySelector('button[onclick="showStudentRequests()"]').addEventListener('click', showStudentRequests);
  document.querySelector('button[onclick="showLecturerRequests()"]').addEventListener('click', showLecturerRequests);

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      console.log('Fetching requests');
      const response = await fetch('/api/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Requests fetch response', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      lecturerRequests = data.filter(request => request.user_type === 'lecturer');
      studentRequests = data.filter(request => request.user_type === 'student');

      const labRequests = studentRequests.filter(req => req.type === 'Lab Booking');
      const equipmentRequests = studentRequests.filter(req => req.type === 'Equipment Booking');

      console.log('Requests fetched', {
        lecturerCount: lecturerRequests.length,
        studentLabCount: labRequests.length,
        studentEquipmentCount: equipmentRequests.length,
        sample: data[0]
      });

      renderRequests(lecturerRequests, lecturerRequestsBody);
      renderRequests(labRequests, studentLabRequestsBody);
      renderRequests(equipmentRequests, studentEquipmentRequestsBody);
    } catch (err) {
      console.error('Error fetching requests:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
      alert(`Error fetching requests: ${err.message}`);
      if (err.message.includes('401') || err.message.includes('403')) {
        console.warn('Unauthorized or forbidden, redirecting to login');
        localStorage.clear();
        window.location.href = '/login.html';
      }
    }
  };

  // Render requests to a table
  const renderRequests = (requests, tableBody) => {
    if (!tableBody) {
      console.error('Table body not found');
      return;
    }

    tableBody.innerHTML = requests.length
      ? ''
      : '<tr><td colspan="6" class="p-4 text-center text-gray-500">No requests found</td></tr>';

    requests.forEach(request => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      row.innerHTML = `
        <td class="p-3 border">${request.request_id}</td>
        <td class="p-3 border">${request.type}</td>
        <td class="p-3 border">${request.requested_by_name} (${request.requested_by_id})</td>
        <td class="p-3 border max-w-xs truncate">${request.details}</td>
        <td class="p-3 border">
          <span class="px-2 py-1 rounded text-xs ${
            request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            request.status === 'Approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }">${request.status}</span>
        </td>
        <td class="p-3 border">
          ${request.status === 'Pending' ? `
            <button class="approve-btn px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 mr-1" 
                    data-id="${request.request_id}">
              Approve
            </button>
            <button class="reject-btn px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 mr-1" 
                    data-id="${request.request_id}">
              Reject
            </button>
          ` : ''}
          <button class="view-btn px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" 
                  data-id="${request.request_id}">
            View
          </button>
        </td>
      `;
      tableBody.appendChild(row);

      // Add event listeners to action buttons
      const approveBtn = row.querySelector('.approve-btn');
      const rejectBtn = row.querySelector('.reject-btn');
      const viewBtn = row.querySelector('.view-btn');

      if (approveBtn) {
        approveBtn.addEventListener('click', (e) => handleRequestAction(e, 'approve'));
      }
      if (rejectBtn) {
        rejectBtn.addEventListener('click', (e) => handleRequestAction(e, 'reject'));
      }
      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => viewRequestDetails(e));
      }
    });
  };

  // Handle approve/reject actions
  // const handleRequestAction = async (e, action) => {
  //   e.stopPropagation();
  //   const requestId = e.target.dataset.id;

  //   if (!confirm(`Are you sure you want to ${action} this request?`)) {
  //     return;
  //   }

  //   try {
  //     console.log(`Submitting ${action} for request`, { requestId });
  //     const response = await fetch(`/api/requests/${requestId}/${action}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ notes: `Request ${action}d by ${userName}` })
  //     });

  //     console.log(`${action} request response`, { status: response.status, ok: response.ok });

  //     if (!response.ok) {
  //       const data = await response.json();
  //       throw new Error(data.message || `Failed to ${action} request`);
  //     }

  //     const data = await response.json();
  //     alert(`Request ${action}d successfully!`);
  //     fetchRequests(); // Refresh the list
  //   } catch (err) {
  //     console.error(`Error ${action}ing request:`, {
  //       message: err.message,
  //       stack: err.stack,
  //       timestamp: new Date().toISOString()
  //     });
  //     alert(`Error: ${err.message}`);
  //   }
  // };
const handleRequestAction = async (e, action) => {
  e.stopPropagation();
  const requestId = e.target.dataset.id;
  
  if (!confirm(`Are you sure you want to ${action} this request?`)) {
    return;
  }

  try {
    let requestBody = {};
    if (action === 'reject') {
      const reason = prompt('Please enter a reason for rejection:') || 'No reason provided';
      requestBody = { reason };
    }

    // Encode the request ID to handle slashes properly
    const encodedRequestId = encodeURIComponent(requestId);
    const response = await fetch(`/api/requests/${encodedRequestId}/${action}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Failed to ${action} request (HTTP ${response.status})`);
    }

    alert(`Request ${action}d successfully!`);
    await fetchRequests(); // Refresh the list

  } catch (err) {
    console.error(`${action} error:`, err);
    alert(`Error: ${err.message}`);
  }
};
  // View request details
  const viewRequestDetails = (e) => {
    e.stopPropagation();
    const requestId = e.target.dataset.id;

    const allRequests = [...lecturerRequests, ...studentRequests];
    const request = allRequests.find(req => req.request_id === requestId);

    if (!request) {
      console.error('Request not found', { requestId });
      alert('Request details not found');
      return;
    }

    console.log('Opening request details modal', { requestId });

    const modalHtml = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Request Details</h3>
            <button class="close-modal text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold">Request ID:</h4>
              <p>${request.request_id}</p>
            </div>
            <div>
              <h4 class="font-semibold">Type:</h4>
              <p>${request.type}</p>
            </div>
            <div>
              <h4 class="font-semibold">Requested By:</h4>
              <p>${request.requested_by_name} (${request.requested_by_id})</p>
            </div>
            <div>
              <h4 class="font-semibold">Status:</h4>
              <p class="${request.status === 'Approved' ? 'text-green-600' :
                          request.status === 'Rejected' ? 'text-red-600' :
                          'text-yellow-600'}">
                ${request.status}
              </p>
            </div>
            <div>
              <h4 class="font-semibold">Submitted On:</h4>
              <p>${new Date(request.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h4 class="font-semibold">Details:</h4>
              <p class="whitespace-pre-wrap">${request.details}</p>
            </div>
            ${request.notes ? `
            <div>
              <h4 class="font-semibold">Admin Notes:</h4>
              <p class="whitespace-pre-wrap">${request.notes}</p>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    modalContainer.querySelector('.close-modal').addEventListener('click', () => {
      console.log('Closing request details modal');
      document.body.removeChild(modalContainer);
    });
  };

  // Initialize the page
  console.log('Initializing requests page');
  fetchRequests();
});