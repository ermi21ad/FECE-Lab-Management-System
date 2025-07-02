document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('Lab Schedule loaded', { token: token ? '[Present]' : '[Missing]', role });
  
    if (!token || role !== 'student') {
      console.warn('No token or incorrect role, redirecting to login');
      window.location.href = '/login.html';
      return;
    }
  
    const schedulesTableBody = document.getElementById('schedules-body');
    const viewSelect = document.getElementById('view-select');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const paginationInfo = document.getElementById('pagination-info');
    const userName = document.getElementById('user-name');
    const userInitial = document.getElementById('user-initial');
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');
  
    let currentPage = 1;
    const limit = 10;
    let totalPages = 1;
    let currentView = viewSelect.value.toLowerCase().replace(' view', '');
  
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
  
    // Fetch schedules
    const fetchSchedules = async () => {
      try {
        console.log('Fetching schedules:', { view: currentView, page: currentPage, limit });
        const response = await fetch(`/api/student-schedules?view=${currentView}&page=${currentPage}&limit=${limit}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('Schedules fetch status:', response.status, response.statusText);
  
        let data;
        try {
          data = await response.json();
        } catch (err) {
          console.error('JSON parse error:', err.message, response.statusText);
          const text = await response.text();
          console.error('Response text:', text.slice(0, 100));
          throw new Error('Invalid response format: ' + err.message);
        }
  
        if (!response.ok) {
          console.error('Fetch schedules failed:', { status: response.status, message: data?.message });
          if (response.status === 401) {
            console.warn('Authentication failed, redirecting to login');
            localStorage.clear();
            window.location.href = '/login.html';
            return;
          }
          if (response.status === 404) {
            throw new Error('Schedules endpoint not found');
          }
          throw new Error(data?.message || `HTTP error: ${response.status}`);
        }
  
        console.log('Schedules response data:', data);
        console.log('Schedules count:', data.schedules.length);
  
        // Populate table
        schedulesTableBody.innerHTML = '';
        if (data.schedules.length === 0) {
          console.log('No schedules found for current view');
          const row = document.createElement('tr');
          row.innerHTML = `<td colspan="9" class="p-2 text-center">No schedules available</td>`;
          schedulesTableBody.appendChild(row);
        } else {
          data.schedules.forEach(schedule => {
            console.log('Adding schedule:', schedule);
            const row = document.createElement('tr');
            row.innerHTML = `
              <td class="p-2">${schedule.schedule_id}</td>
              <td class="p-2">${schedule.course}</td>
              <td class="p-2">${schedule.lecturer_id}</td>
              <td class="p-2">${schedule.lecturer_name}</td>
              <td class="p-2">${schedule.lab}</td>
              <td class="p-2">${schedule.batch}</td>
              <td class="p-2">${schedule.date}</td>
              <td class="p-2">${schedule.time}</td>
              <td class="p-2">${schedule.status}</td>
            `;
            schedulesTableBody.appendChild(row);
          });
        }
  
        // Update pagination
        totalPages = data.totalPages;
        paginationInfo.textContent = `Showing ${(currentPage - 1) * limit + 1}-${Math.min(currentPage * limit, data.total)} of ${data.total}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
  
        console.log('Schedules populated successfully');
      } catch (err) {
        console.error('Fetch schedules error:', err.message);
        alert(`Failed to load schedules: ${err.message || 'Network error'}`);
      }
    };
  
    // Handle view change
    viewSelect.addEventListener('change', () => {
      currentView = viewSelect.value.toLowerCase().replace(' view', '');
      currentPage = 1;
      console.log('View changed:', currentView);
      fetchSchedules();
    });
  
    // Handle pagination
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        console.log('Previous page:', currentPage);
        fetchSchedules();
      }
    });
  
    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        console.log('Next page:', currentPage);
        fetchSchedules();
      }
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
    fetchSchedules();
  });