document.addEventListener('DOMContentLoaded', () => {
    console.log('Equipment Management loaded');
  
    // Check if logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'faculty-admin') {
      window.location.href = '/login.html';
      return;
    }
  
    // Dropdown menu
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
    listBtn.addEventListener('click', () => {
      listDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
        listDropdown.classList.add('hidden');
      }
    });
  
    // Filter panel toggle
    const toggleFilter = document.getElementById('toggle-filter');
    const filterPanel = document.getElementById('filter-panel');
    toggleFilter.addEventListener('click', () => {
      filterPanel.classList.toggle('hidden');
    });
  
    // Fetch and display equipment
    const tbody = document.querySelector('table tbody');
    const fetchEquipment = async () => {
      try {
        const response = await fetch('/api/equipment', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const { equipment } = await response.json();
        console.log('Equipment API response:', equipment);
  
        tbody.innerHTML = '';
        if (equipment.length === 0) {
          tbody.innerHTML = '<tr><td colspan="11" class="p-2 text-center">No equipment found</td></tr>';
          return;
        }
  
        equipment.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="p-2"><input type="checkbox" data-id="${item.equipment_id}"></td>
            <td class="p-2">${item.equipment_id}</td>
            <td class="p-2">${item.name}</td>
            <td class="p-2">${item.category || '-'}</td>
            <td class="p-2">${item.assigned_lab || '-'}</td>
            <td class="p-2">${item.quantity}</td>
            <td class="p-2">${item.status}</td>
            <td class="p-2">${item.condition}</td>
            <td class="p-2">${item.manufacturer || '-'}</td>
            <td class="p-2">${item.date_added || '-'}</td>
            <td class="p-2">
              <button class="text-gray-700 hover:text-gray-900 mr-2 view-btn" data-id="${item.equipment_id}" title="View"><i class="fas fa-eye"></i></button>
              <button class="text-gray-700 hover:text-gray-900 mr-2 edit-btn" data-id="${item.equipment_id}" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="text-gray-700 hover:text-gray-900 mr-2 delete-btn" data-id="${item.equipment_id}" title="Delete"><i class="fas fa-trash"></i></button>
              <button class="text-gray-700 hover:text-gray-900 history-btn" data-id="${item.equipment_id}" title="History"><i class="fas fa-history"></i></button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error('Fetch equipment error:', err);
        tbody.innerHTML = '<tr><td colspan="11" class="p-2 text-center text-red-600">Error loading equipment</td></tr>';
      }
    };
  
    // Add equipment modal
    const addEquipmentBtn = document.getElementById('add-equipment-btn');
    const addModal = document.getElementById('add-equipment-modal');
    const closeModal = document.getElementById('close-modal');
    const addForm = document.getElementById('add-equipment-form');
  
    addEquipmentBtn.addEventListener('click', () => {
      addForm.reset();
      addForm.dataset.mode = 'add';
      addModal.classList.remove('hidden');
    });
    closeModal.addEventListener('click', () => {
      addModal.classList.add('hidden');
    });
  
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addForm);
      const mode = addForm.dataset.mode;
      const equipment_id = formData.get('serial_number');
      formData.set('equipment_id', equipment_id);
      console.log('Submitting equipment form:', Array.from(formData.entries()));
  
      try {
        const url = mode === 'add' ? '/api/equipment' : `/api/equipment/${equipment_id}`;
        const method = mode === 'add' ? 'POST' : 'PUT';
        const response = await fetch(url, {
          method,
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const result = await response.json();
        console.log('Equipment API response:', result);
  
        if (response.ok) {
          alert(`Equipment ${mode === 'add' ? 'added' : 'updated'} successfully!`);
          addModal.classList.add('hidden');
          addForm.reset();
          fetchEquipment();
        } else {
          alert(result.message || 'Operation failed');
        }
      } catch (err) {
        console.error('Equipment submit error:', err);
        alert('Something went wrong: ' + err.message);
      }
    });
  
    // Edit equipment
    tbody.addEventListener('click', async (e) => {
      if (e.target.closest('.edit-btn')) {
        const equipment_id = e.target.closest('.edit-btn').dataset.id;
        try {
          const response = await fetch(`/api/equipment`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { equipment } = await response.json();
          const item = equipment.find(eq => eq.equipment_id === equipment_id);
          if (!item) {
            alert('Equipment not found');
            return;
          }
  
          addForm.querySelector('[name="serial_number"]').value = item.equipment_id;
          addForm.querySelector('[name="name"]').value = item.name;
          addForm.querySelector('[name="category"]').value = item.category || '';
          addForm.querySelector('[name="assigned_lab"]').value = item.assigned_lab || '';
          addForm.querySelector('[name="quantity"]').value = item.quantity;
          addForm.querySelector('[name="condition"]').value = item.condition;
          addForm.querySelector('[name="status"]').value = item.status;
          addForm.querySelector('[name="date_added"]').value = item.date_added || '';
          addForm.querySelector('[name="manufacturer"]').value = item.manufacturer || '';
          addForm.querySelector('[name="notes"]').value = item.notes || '';
          addForm.dataset.mode = 'edit';
          addModal.classList.remove('hidden');
        } catch (err) {
          console.error('Fetch equipment error:', err);
          alert('Failed to load equipment: ' + err.message);
        }
      }
    });
  
    // Delete equipment
    tbody.addEventListener('click', async (e) => {
      if (e.target.closest('.delete-btn')) {
        const equipment_id = e.target.closest('.delete-btn').dataset.id;
        if (!confirm('Are you sure you want to delete this equipment?')) return;
  
        try {
          const response = await fetch(`/api/equipment/${equipment_id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await response.json();
          console.log('Delete API response:', result);
  
          if (response.ok) {
            alert('Equipment deleted successfully!');
            fetchEquipment();
          } else {
            alert(result.message || 'Delete failed');
          }
        } catch (err) {
          console.error('Delete error:', err);
          alert('Something went wrong: ' + err.message);
        }
      }
    });
  
    // View and History (mock for now)
    tbody.addEventListener('click', (e) => {
      if (e.target.closest('.view-btn')) {
        alert('View functionality not implemented yet!');
      }
      if (e.target.closest('.history-btn')) {
        alert('History functionality not implemented yet!');
      }
    });
  
const bulkImportBtn = document.getElementById('bulk-import-btn');
const bulkModal = document.getElementById('bulk-import-modal');
const closeImportModal = document.getElementById('close-import-modal');
const importFile = document.getElementById('bulk-import-file');
const importPreview = document.getElementById('import-preview');
const previewTbody = document.getElementById('preview-tbody');
const confirmImport = document.getElementById('confirm-import');

bulkImportBtn.addEventListener('click', () => {
    bulkModal.classList.remove('hidden');
    // Reset the modal state
    importFile.value = '';
    importPreview.classList.add('hidden');
    previewTbody.innerHTML = '';
});

closeImportModal.addEventListener('click', () => {
    bulkModal.classList.add('hidden');
});

importFile.addEventListener('change', () => {
    if (importFile.files.length === 0) return;

    const file = importFile.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        const headers = rows.shift(); // Remove header row

        previewTbody.innerHTML = '';
        rows.forEach((row, index) => {
            if (row.length < headers.length) return; // Skip incomplete rows

            const data = {};
            headers.forEach((header, i) => {
                data[header] = row[i] || '';
            });

            let errors = '';
            if (!data.equipment_id || !data.name) {
                errors = 'Missing equipment_id or name';
            } else if (!['Available', 'In Use', 'Under Maintenance', 'Lost'].includes(data.status) && data.status) {
                errors = 'Invalid status';
            } else if (!['New', 'Good', 'Worn', 'Needs Repair'].includes(data.condition) && data.condition) {
                errors = 'Invalid condition';
            } else if (data.quantity && isNaN(parseInt(data.quantity))) {
                errors = 'Invalid quantity';
            }

            const tr = document.createElement('tr');
            tr.className = errors ? 'bg-red-100' : '';
            tr.innerHTML = `
                <td class="p-2">${data.equipment_id || '-'}</td>
                <td class="p-2">${data.name || '-'}</td>
                <td class="p-2">${data.category || '-'}</td>
                <td class="p-2">${data.assigned_lab || '-'}</td>
                <td class="p-2">${data.quantity || '-'}</td>
                <td class="p-2">${data.status || '-'}</td>
                <td class="p-2">${data.condition || '-'}</td>
                <td class="p-2">${data.manufacturer || '-'}</td>
                <td class="p-2">${data.date_added || '-'}</td>
                <td class="p-2">${data.notes || '-'}</td>
                <td class="p-2 ${errors ? 'text-red-600' : 'text-green-600'}">${errors || 'None'}</td>
            `;
            previewTbody.appendChild(tr);
        });
        importPreview.classList.remove('hidden');
    };
    reader.readAsText(file);
});

    confirmImport.addEventListener('click', async () => {
      const rows = Array.from(previewTbody.children).map(tr => {
        const cells = tr.children;
        return {
          equipment_id: cells[0].textContent,
          name: cells[1].textContent,
          category: cells[2].textContent === '-' ? '' : cells[2].textContent,
          assigned_lab: cells[3].textContent === '-' ? '' : cells[3].textContent,
          quantity: cells[4].textContent === '-' ? '' : cells[4].textContent,
          status: cells[5].textContent === '-' ? '' : cells[5].textContent,
          condition: cells[6].textContent === '-' ? '' : cells[6].textContent,
          manufacturer: cells[7].textContent === '-' ? '' : cells[7].textContent,
          date_added: cells[8].textContent === '-' ? '' : cells[8].textContent,
          notes: cells[9].textContent === '-' ? '' : cells[9].textContent,
          errors: cells[10].textContent,
        };
      });
  
      let successCount = 0;
      let errorCount = 0;
  
      for (const row of rows) {
        if (row.errors !== 'None') {
          errorCount++;
          continue;
        }
  
        const formData = new FormData();
        Object.entries(row).forEach(([key, value]) => {
          if (key !== 'errors' && value) {
            formData.append(key, value);
          }
        });
  
        try {
          const response = await fetch('/api/equipment', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          console.error('Bulk import error:', err);
          errorCount++;
        }
      }
  
      alert(`Bulk import complete: ${successCount} added, ${errorCount} failed`);
      bulkModal.classList.add('hidden');
      importPreview.classList.add('hidden');
      previewTbody.innerHTML = '';
      fetchEquipment();
    });
  
    // Select all checkbox
    const selectAll = document.getElementById('select-all');
    selectAll.addEventListener('change', () => {
      document.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => {
        cb.checked = selectAll.checked;
      });
    });
  
    // Initial fetch
    fetchEquipment();
  });