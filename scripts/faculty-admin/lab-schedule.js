document.addEventListener('DOMContentLoaded', () => {
  console.log('Lab Schedule loaded');

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

  // Add session modal
  const addSessionBtn = document.getElementById('add-session-btn');
  const addModal = document.getElementById('add-session-modal');
  const closeModal = document.getElementById('close-modal');
  const addForm = document.getElementById('add-session-form');
  const modalTitle = document.getElementById('modal-title');
  const schedulesBody = document.getElementById('schedules-body');

  addSessionBtn.addEventListener('click', () => {
    addForm.reset();
    modalTitle.textContent = 'Add Lab Session';
    addForm.dataset.mode = 'add';
    addModal.classList.remove('hidden');
  });

  closeModal.addEventListener('click', () => {
    addModal.classList.add('hidden');
  });

  // Fetch and display schedules
  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules?page=1&limit=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { schedules, total } = await response.json();
      if (response.ok) {
        schedulesBody.innerHTML = '';
        if (schedules.length === 0) {
          schedulesBody.innerHTML = '<tr><td colspan="9" class="p-2 text-center">No schedules found</td></tr>';
        } else {
          schedules.forEach(schedule => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td class="p-2">${schedule.schedule_id}</td>
              <td class="p-2">${schedule.course_id} - ${schedule.course_name}</td>
              <td class="p-2">${schedule.lecturer_id}</td>
              <td class="p-2">${schedule.lecturer}</td>
              <td class="p-2">${schedule.lab}</td>
              <td class="p-2">${schedule.batch}</td>
              <td class="p-2">${schedule.schedule_date}</td>
              <td class="p-2">${schedule.start_time} - ${schedule.end_time}</td>
              <td class="p-2">${schedule.status}</td>
            `;
            schedulesBody.appendChild(row);
          });
        }
      } else {
        console.error('Fetch schedules error:', schedules.message);
        schedulesBody.innerHTML = '<tr><td colspan="9" class="p-2 text-center">Error loading schedules</td></tr>';
      }
    } catch (err) {
      console.error('Fetch schedules error:', err);
      schedulesBody.innerHTML = '<tr><td colspan="9" class="p-2 text-center">Error loading schedules</td></tr>';
    }
  };

  // Form submission
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mode = addForm.dataset.mode;
    const schedule_id = addForm.querySelector('[name="schedule_id"]').value;

    // Validate status
    const status = addForm.querySelector('[name="status"]').value;
    const validStatuses = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      alert('Status must be one of: Pending, Scheduled, Completed, Cancelled');
      return;
    }

    // Prepare data as JSON
    const formData = {
      schedule_id: addForm.querySelector('[name="schedule_id"]').value,
      course_id: addForm.querySelector('[name="course_id"]').value,
      course_name: addForm.querySelector('[name="course_name"]').value,
      lecturer_id: addForm.querySelector('[name="lecturer_id"]').value,
      lecturer: addForm.querySelector('[name="lecturer"]').value,
      lab: addForm.querySelector('[name="lab"]').value,
      batch: addForm.querySelector('[name="batch"]').value,
      schedule_date: addForm.querySelector('[name="schedule_date"]').value,
      start_time: addForm.querySelector('[name="start_time"]').value,
      end_time: addForm.querySelector('[name="end_time"]').value,
      equipment: addForm.querySelector('[name="equipment"]').value,
      notes: addForm.querySelector('[name="notes"]').value,
      status
    };

    console.log('Submitting lab session form:', formData);

    try {
      const url = mode === 'add' ? '/api/schedules' : `/api/schedules/${schedule_id}`;
      const method = mode === 'add' ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (response.ok) {
        alert(`Lab session ${mode === 'add' ? 'added' : 'updated'} successfully!`);
        addModal.classList.add('hidden');
        addForm.reset();
        fetchSchedules(); // Refresh table
      } else {
        alert(result.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Form submit error:', err);
      alert('Something went wrong: ' + err.message);
    }
  });

  // Initialize
  fetchSchedules();
});