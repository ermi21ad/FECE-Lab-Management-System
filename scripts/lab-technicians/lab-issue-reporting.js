document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Issue Reporting page loaded', { 
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

  const issuesTableBody = document.getElementById('issues-table-body');
  const newIssueBtn = document.getElementById('new-issue-btn');
  const newIssueModal = document.getElementById('new-issue-modal');
  const closeNewIssueModal = document.getElementById('close-new-issue-modal');
  const newIssueForm = document.getElementById('new-issue-form');
  const issueDetailsModal = document.getElementById('issue-details-modal');
  const issueDetailsContent = document.getElementById('issue-details-content');
  const closeIssueDetailsModal = document.getElementById('close-issue-details-modal');
  const listBtn = document.getElementById('list-btn');
  const listDropdown = document.getElementById('list-dropdown');

  let issues = [];

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

  // Fetch issues
  const fetchIssues = async () => {
    try {
      console.log('Fetching issues with token:', token ? '[Truncated]' : '[Missing]');
      const response = await fetch('/api/lab-technician-issues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Issues fetch response:', { status: response.status, data });

      if (response.ok) {
        issues = data.issues || [];
        console.log('Issues fetched:', { count: issues.length });
        renderIssues();
      } else {
        console.error('Issues fetch failed:', { status: response.status, message: data.message });
        alert(`Failed to load issues: ${data.message || 'Unknown error'}`);
        if (response.status === 401 || response.status === 403) {
          console.warn('Unauthorized or forbidden, redirecting to login');
          localStorage.clear();
          window.location.href = '/login.html';
        }
      }
    } catch (err) {
      console.error('Issues fetch error:', err.message, err.stack);
      alert(`Failed to load issues: ${err.message || 'Network error'}`);
    }
  };

  // Render issues table
  const renderIssues = () => {
    issuesTableBody.innerHTML = '';
    issues.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${item.issue_type || 'N/A'}</td>
        <td class="p-2">${item.description || 'N/A'}</td>
        <td class="p-2 ${item.priority === 'High' || item.priority === 'Urgent' ? 'text-red-600' : ''}">${item.priority || 'N/A'}</td>
        <td class="p-2">${item.equipment_name || 'N/A'}</td>
        <td class="p-2">${item.status || 'N/A'}</td>
        <td class="p-2">
          <button class="view-btn text-gray-700 hover:text-gray-900 mr-2" title="View Details" data-id="${item.issue_id}"><i class="fas fa-eye"></i></button>
          <button class="chat-btn text-gray-700 hover:text-gray-900" title="Communicate" data-id="${item.issue_id}"><i class="fas fa-comment"></i></button>
        </td>
      `;
      issuesTableBody.appendChild(row);
    });
  };

  // Open new issue modal
  newIssueBtn.addEventListener('click', () => {
    newIssueModal.classList.remove('hidden');
  });

  // Close new issue modal
  closeNewIssueModal.addEventListener('click', () => {
    newIssueModal.classList.add('hidden');
    newIssueForm.reset();
  });

  // Submit new issue
  newIssueForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(newIssueForm);
    const issueData = {
      issue_type: formData.get('issue_type'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      equipment_name: formData.get('equipment_name') || null
    };

    try {
      console.log('Submitting new issue:', issueData);
      const response = await fetch('/api/lab-technician-issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(issueData)
      });
      const data = await response.json();
      console.log('Issue submission response:', { status: response.status, data });

      if (response.ok) {
        alert('Issue reported successfully!');
        newIssueForm.reset();
        newIssueModal.classList.add('hidden');
        fetchIssues(); // Refresh table
      } else {
        console.error('Issue submission failed:', { status: response.status, message: data.message });
        alert(`Failed to report issue: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Issue submission error:', err.message, err.stack);
      alert(`Failed to report issue: ${err.message || 'Network error'}`);
    }
  });

  // Open issue details modal
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.view-btn');
    if (viewBtn) {
      const issueId = viewBtn.dataset.id;
      const issue = issues.find(i => i.issue_id === issueId);
      if (issue) {
        issueDetailsContent.innerHTML = `
          <p><strong>Issue ID:</strong> ${issue.issue_id || 'N/A'}</p>
          <p><strong>Type:</strong> ${issue.issue_type || 'N/A'}</p>
          <p><strong>Description:</strong> ${issue.description || 'N/A'}</p>
          <p><strong>Priority:</strong> ${issue.priority || 'N/A'}</p>
          <p><strong>Equipment:</strong> ${issue.equipment_name || 'N/A'}</p>
          <p><strong>Status:</strong> ${issue.status || 'N/A'}</p>
          <p><strong>Created At:</strong> ${issue.created_at ? new Date(issue.created_at).toLocaleString() : 'N/A'}</p>
          <p><strong>Updated At:</strong> ${issue.updated_at ? new Date(issue.updated_at).toLocaleString() : 'N/A'}</p>
        `;
        issueDetailsModal.classList.remove('hidden');
      }
    }
  });

  // Close issue details modal
  closeIssueDetailsModal.addEventListener('click', () => {
    issueDetailsModal.classList.add('hidden');
    issueDetailsContent.innerHTML = '';
  });

  // Placeholder for chat button
  document.addEventListener('click', (e) => {
    const chatBtn = e.target.closest('.chat-btn');
    if (chatBtn) {
      const issueId = chatBtn.dataset.id;
      console.log('Chat clicked for issue:', issueId);
      alert('Chat functionality not implemented yet.');
    }
  });

  // Initialize
  fetchIssues();
});