document.addEventListener('DOMContentLoaded', () => {
  console.log('Lab Schedule Management loaded');

  // Check if logged in
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'lecturer') {
    window.location.href = '/login.html';
    return;
  }

  // DOM elements
  const schedulesTableBody = document.getElementById('schedules-body');
  const viewSelect = document.getElementById('view-select');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const paginationInfo = document.getElementById('pagination-info');

  let currentPage = 1;
  const limit = 10;
  let totalPages = 1;
  let currentView = viewSelect?.value || 'Weekly';

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const response = await fetch(`/api/lecturer-schedules?view=${currentView}&page=${currentPage}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { schedules, pagination } = await response.json();

      if (response.ok) {
        // Update table
        schedulesTableBody.innerHTML = '';
        schedules.forEach(schedule => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="p-2">${schedule.schedule_id}</td>
            <td class="p-2">${schedule.course_name} (${schedule.course_id})</td>
            <td class="p-2">${schedule.lecturer_id}</td>
            <td class="p-2">${schedule.lecturer}</td>
            <td class="p-2">${schedule.lab}</td>
            <td class="p-2">${schedule.batch}</td>
            <td class="p-2">${schedule.schedule_date}</td>
            <td class="p-2">${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}</td>
            <td class="p-2">
              <span class="px-2 py-1 rounded text-white 
                ${schedule.status === 'Scheduled' ? 'bg-green-500' : 
                  schedule.status === 'Pending' ? 'bg-yellow-500' : 
                  schedule.status === 'Completed' ? 'bg-blue-500' : 'bg-red-500'}">
                ${schedule.status}
              </span>
            </td>
          `;
          schedulesTableBody.appendChild(row);
        });

        // Update pagination
        totalPages = pagination.totalPages;
        paginationInfo.textContent = `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`;
        prevPageBtn.disabled = pagination.page === 1;
        nextPageBtn.disabled = pagination.page === pagination.totalPages;
      } else {
        console.error('Fetch schedules error:', schedules.message, { status: response.status });
        alert(`Failed to load schedules: ${schedules.message}`);
      }
    } catch (err) {
      console.error('Fetch schedules error:', err.message);
      alert('Failed to load schedules: Network error');
    }
  };

  // Event listeners
  viewSelect?.addEventListener('change', () => {
    currentView = viewSelect.value;
    currentPage = 1;
    fetchSchedules();
  });

  prevPageBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchSchedules();
    }
  });

  nextPageBtn?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchSchedules();
    }
  });

  // Initialize
  fetchSchedules();
});