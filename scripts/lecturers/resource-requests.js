document.addEventListener('DOMContentLoaded', () => {
  console.log('Resource Requests loaded');

  // Check if logged in
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'lecturer') {
    console.warn('No token or incorrect role, redirecting to login');
    window.location.href = '/login.html';
    return;
  }

  // DOM elements
  const requestsTableBody = document.querySelector('table tbody');
  const newRequestBtn = document.getElementById('new-request-btn');
  const newRequestModal = document.getElementById('new-request-modal');
  const newRequestForm = document.getElementById('new-request-form');
  const closeNewRequestModal = document.getElementById('close-new-request-modal');
  const prevPageBtn = document.querySelector('.pagination-prev');
  const nextPageBtn = document.querySelector('.pagination-next');
  const paginationInfo = document.querySelector('.text-gray-700');
  const listBtn = document.getElementById('list-btn');
  const listDropdown = document.getElementById('list-dropdown');

  // Verify DOM elements
  if (!newRequestBtn || !newRequestModal || !newRequestForm || !closeNewRequestModal) {
    console.error('Missing DOM elements:', {
      newRequestBtn: !!newRequestBtn,
      newRequestModal: !!newRequestModal,
      newRequestForm: !!newRequestForm,
      closeNewRequestModal: !!closeNewRequestModal
    });
    return;
  }

  let currentPage = 1;
  const limit = 10;
  let totalPages = 1;

  // Set user data (static for now, replace with /api/profile later)
  let userId = 'LEC/001';
  let userName = 'Abebe Kebede';
  const setUserData = () => {
    document.getElementById('user-name').textContent = userName;
    const idInput = document.getElementById('requested_by_id');
    const nameInput = document.getElementById('requested_by_name');
    if (idInput) idInput.value = userId;
    if (nameInput) nameInput.value = userName;
  };

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/lecturer-requests?page=${currentPage}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
      }
      const { requests, pagination } = await response.json();

      // Update table
      requestsTableBody.innerHTML = '';
      requests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="p-2">${request.request_id}</td>
          <td class="p-2">${request.type}</td>
          <td class="p-2">${request.requested_by_name}</td>
          <td class="p-2">${request.details}</td>
          <td class="p-2 text-${request.status === 'Pending' ? 'yellow' : request.status === 'Accepted' ? 'green' : 'red'}-600">${request.status}</td>
          <td class="p-2">${new Date(request.created_at).toLocaleString()}</td>
          <td class="p-2">${new Date(request.updated_at).toLocaleString()}</td>
        `;
        requestsTableBody.appendChild(row);
      });

      // Update pagination
      totalPages = pagination.totalPages;
      paginationInfo.textContent = `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`;
      prevPageBtn.disabled = pagination.page === 1;
      nextPageBtn.disabled = pagination.page === pagination.totalPages;
    } catch (err) {
      console.error('Fetch requests error:', err.message);
      alert('Failed to load requests: ' + err.message);
    }
  };

  // Open new request modal
  newRequestBtn.addEventListener('click', () => {
    console.log('New Request button clicked');
    newRequestForm.reset();
    newRequestForm.querySelector('#requested_by_id').value = userId;
    newRequestForm.querySelector('#requested_by_name').value = userName;
    newRequestModal.classList.remove('hidden');
  });

  // Close new request modal
  closeNewRequestModal.addEventListener('click', () => {
    console.log('Close modal button clicked');
    newRequestModal.classList.add('hidden');
    newRequestForm.reset();
    newRequestForm.querySelector('#requested_by_id').value = userId;
    newRequestForm.querySelector('#requested_by_name').value = userName;
  });

  // Submit new request
  newRequestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const formData = new FormData(newRequestForm);
    const requestData = {
      request_id: formData.get('request_id'),
      type: formData.get('type'),
      details: formData.get('details')
    };
    console.log('Submitting request:', requestData);

    try {
      const response = await fetch('/api/lecturer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();

      if (response.ok) {
        alert('Request added successfully');
        newRequestModal.classList.add('hidden');
        newRequestForm.reset();
        newRequestForm.querySelector('#requested_by_id').value = userId;
        newRequestForm.querySelector('#requested_by_name').value = userName;
        fetchRequests();
      } else {
        console.error('Add request error:', result.message, { status: response.status });
        alert(`Failed to add request: ${result.message}`);
      }
    } catch (err) {
      console.error('Add request error:', err.message);
      alert('Failed to add request: Network error');
    }
  });

  // Toggle list dropdown
  listBtn.addEventListener('click', () => {
    console.log('List button clicked');
    listDropdown.classList.toggle('hidden');
  });

  // Pagination
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchRequests();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchRequests();
    }
  });

  // Initialize
  setUserData();
  fetchRequests();
});