document.addEventListener('DOMContentLoaded', () => {
    const issueTableBody = document.getElementById('issue-table-body');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let issues = [];

    // Fetch issue reports
    async function fetchIssues() {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found. Please log in.');

            const response = await fetch('/api/faculty-issue', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            issues = data;
            renderIssues('all');
        } catch (err) {
            console.error('Error fetching issues:', err);
            alert('Failed to load issue reports: ' + err.message);
        }
    }

    // Render issues based on status filter
    function renderIssues(status) {
        issueTableBody.innerHTML = '';
        const filteredIssues = status === 'all' ? issues : issues.filter(issue => issue.status === status);

        filteredIssues.forEach(issue => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3">${issue.issue_id}</td>
                <td class="p-3">${issue.technician_id}</td>
                <td class="p-3">${issue.issue_type}</td>
                <td class="p-3">${issue.description}</td>
                <td class="p-3">${issue.priority}</td>
                <td class="p-3">${issue.equipment_name || '-'}</td>
                <td class="p-3">
                    <span class="px-2 py-1 rounded text-white ${
                        issue.status === 'Open' ? 'bg-red-500' :
                        issue.status === 'In Progress' ? 'bg-yellow-500' :
                        issue.status === 'Resolved' ? 'bg-green-500' :
                        'bg-gray-500'
                    }">${issue.status}</span>
                </td>
                <td class="p-3">${new Date(issue.created_at).toLocaleString()}</td>
                <td class="p-3">${new Date(issue.updated_at).toLocaleString()}</td>
                <td class="p-3">${issue.feedback || '-'}</td>
                <td class="p-3">
                    <button class="feedback-btn bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600" data-id="${issue.issue_id}">
                        <i class="fas fa-comment"></i> Feedback
                    </button>
                </td>
            `;
            issueTableBody.appendChild(row);
        });
    }

    // Handle filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('bg-gray-600'));
            button.classList.add('bg-gray-600');
            const status = button.dataset.status;
            renderIssues(status);
        });
    });

    // Handle feedback button clicks
    issueTableBody.addEventListener('click', async (e) => {
        if (e.target.closest('.feedback-btn')) {
            const issueId = e.target.closest('.feedback-btn').dataset.id;
            const issue = issues.find(iss => iss.issue_id === issueId);

            // Create feedback modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
            modal.innerHTML = `
                <div class="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 class="text-lg font-semibold mb-4">Feedback for ${issueId}</h2>
                    <form id="feedback-form">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" class="mt-1 w-full p-2 border rounded-md">
                                <option value="Open" ${issue.status === 'Open' ? 'selected' : ''}>Open</option>
                                <option value="In Progress" ${issue.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Resolved" ${issue.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                <option value="Closed" ${issue.status === 'Closed' ? 'selected' : ''}>Closed</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700">Feedback</label>
                            <textarea name="feedback" class="mt-1 w-full p-2 border rounded-md" rows="4">${issue.feedback || ''}</textarea>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" class="cancel-btn bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                            <button type="submit" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Save</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            // Handle form submission
            const form = modal.querySelector('#feedback-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const updatedStatus = formData.get('status');
                const feedback = formData.get('feedback');

                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/faculty-issue/${issueId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ status: updatedStatus, feedback })
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message);

                    alert('Feedback saved successfully');
                    modal.remove();
                    await fetchIssues();
                } catch (err) {
                    console.error('Error saving feedback:', err);
                    alert('Failed to save feedback: ' + err.message);
                }
            });

            // Handle cancel button
            modal.querySelector('.cancel-btn').addEventListener('click', () => {
                modal.remove();
            });
        }
    });

    // Handle dropdown toggle
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

    // Initial load
    fetchIssues();
});