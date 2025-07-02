document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Equipment Management page loaded', { 
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

  const equipmentTableBody = document.getElementById('equipment-table-body');
  const paginationInfo = document.getElementById('pagination-info');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const searchBar = document.getElementById('search-bar');
  const filterBtn = document.getElementById('filter-btn');
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const closeEditModal = document.getElementById('close-edit-modal');
  const imageModal = document.getElementById('image-modal');
  const imageUpload = document.getElementById('image-upload');
  const closeImageModal = document.getElementById('close-image-modal');
  const saveImage = document.getElementById('save-image');
  const listBtn = document.getElementById('list-btn');
  const listDropdown = document.getElementById('list-dropdown');

  let equipment = [];
  let total = 0;
  let currentPage = 1;
  const itemsPerPage = 5;
  let searchQuery = '';

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

  // Fetch equipment
    const fetchEquipment = async () => {
    try {
      console.log('Fetching equipment with token:', token ? '[Truncated]' : '[Missing]');
      const response = await fetch(`/api/lab-technician-equipment?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Equipment fetch response:', { status: response.status, data });

      if (response.ok) {
        equipment = data.equipment || [];
        total = data.total || 0;
        currentPage = data.page || 1;
        console.log('Equipment fetched:', { count: equipment.length, total, page: currentPage });
        renderTable();
      } else {
        console.error('Equipment fetch failed:', { status: response.status, data });
        alert(`Failed to load equipment: ${data.message || 'Unknown error'}`);
        if (response.status === 401 || response.status === 403) {
          console.warn('Unauthorized or forbidden, redirecting to login');
          localStorage.clear();
          window.location.href = '/login.html';
        }
      }
    } catch (err) {
      console.error('Equipment fetch error:', { message: err.message, stack: err.stack });
      alert(`Failed to load equipment: ${err.message || 'Network error'}`);
    }
  };


  // Render table
  const renderTable = () => {
    equipmentTableBody.innerHTML = '';
    equipment.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${item.name || 'N/A'}</td>
        <td class="p-2">${item.category || 'N/A'}</td>
        <td class="p-2">${item.condition || 'N/A'}</td>
        <td class="p-2">${item.quantity || 'N/A'}</td>
        <td class="p-2">${item.assigned_lab || 'N/A'}</td>
        <td class="p-2">${item.status || 'N/A'}</td>
        <td class="p-2">
          <button class="edit-btn text-gray-700 hover:text-gray-900 mr-2" title="Edit" data-id="${item.equipment_id}"><i class="fas fa-edit"></i></button>
          <button class="image-btn text-gray-700 hover:text-gray-900" title="Upload Image" data-id="${item.equipment_id}"><i class="fas fa-image"></i></button>
        </td>
      `;
      equipmentTableBody.appendChild(row);
    });

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    paginationInfo.textContent = `Showing ${start}-${end} of ${total}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage * itemsPerPage >= total;
  };

  // Pagination handlers
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchEquipment();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (currentPage * itemsPerPage < total) {
      currentPage++;
      fetchEquipment();
    }
  });

  // Search handler
  searchBar.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    currentPage = 1;
    fetchEquipment();
  });

  // Filter button (placeholder)
  filterBtn.addEventListener('click', () => {
    console.log('Filter clicked');
    alert('Filter functionality not implemented yet.');
  });

  // Edit button handler
  equipmentTableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      const equipmentId = editBtn.dataset.id;
      const item = equipment.find(i => i.equipment_id === equipmentId);
      if (item) {
        editForm.querySelector('[name="equipment_id"]').value = item.equipment_id;
        editForm.querySelector('[name="condition"]').value = item.condition;
        editForm.querySelector('[name="status"]').value = item.status;
        editForm.querySelector('[name="assigned_lab"]').value = item.assigned_lab || '';
        editForm.querySelector('[name="notes"]').value = item.notes || '';
        editModal.classList.remove('hidden');
      }
    }
  });

  // Image button handler
  equipmentTableBody.addEventListener('click', (e) => {
    const imageBtn = e.target.closest('.image-btn');
    if (imageBtn) {
      const equipmentId = imageBtn.dataset.id;
      imageUpload.dataset.equipmentId = equipmentId;
      imageModal.classList.remove('hidden');
    }
  });

  // Close edit modal
  closeEditModal.addEventListener('click', () => {
    editModal.classList.add('hidden');
    editForm.reset();
  });

  // Submit edit form
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const equipmentData = {
      condition: formData.get('condition'),
      status: formData.get('status'),
      assigned_lab: formData.get('assigned_lab'),
      notes: formData.get('notes') || null
    };
    const equipmentId = formData.get('equipment_id');

    try {
      console.log('Submitting equipment update:', { equipmentId, equipmentData });
      const response = await fetch(`/api/lab-technician-equipment/${equipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(equipmentData)
      });
      const data = await response.json();
      console.log('Equipment update response:', { status: response.status, data });

      if (response.ok) {
        alert('Equipment updated successfully!');
        editModal.classList.add('hidden');
        editForm.reset();
        fetchEquipment();
      } else {
        console.error('Equipment update failed:', { status: response.status, message: data.message });
        alert(`Failed to update equipment: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Equipment update error:', err.message, err.stack);
      alert(`Failed to update equipment: ${err.message || 'Network error'}`);
    }
  });

  // Close image modal
  closeImageModal.addEventListener('click', () => {
    imageModal.classList.add('hidden');
    imageUpload.value = '';
  });

  // Upload image
  saveImage.addEventListener('click', async () => {
    const equipmentId = imageUpload.dataset.equipmentId;
    const file = imageUpload.files[0];
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Uploading image for equipment:', { equipmentId });
      const response = await fetch(`/api/lab-technician-equipment/${equipmentId}/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      console.log('Image upload response:', { status: response.status, data });

      if (response.ok) {
        alert('Image uploaded successfully!');
        imageModal.classList.add('hidden');
        imageUpload.value = '';
        fetchEquipment();
      } else {
        console.error('Image upload failed:', { status: response.status, message: data.message });
        alert(`Failed to upload image: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Image upload error:', err.message, err.stack);
      alert(`Failed to upload image: ${err.message || 'Network error'}`);
    }
  });

  // Initialize
  fetchEquipment();
});