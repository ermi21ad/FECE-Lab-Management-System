document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Assignment Management page loaded', { 
    token: token ? '[Present]' : '[Missing]', 
    role, 
    roleLength: role ? role.length : 0, 
    roleType: typeof role 
  });

  // Normalize role for comparison
  const normalizedRole = role ? role.trim().toLowerCase() : null;
  if (!token || normalizedRole !== 'lecturer') {
    console.warn('No token or incorrect role, redirecting to login', { 
      token: token ? '[Truncated]' : '[Missing]', 
      role, 
      normalizedRole 
    });
    localStorage.clear();
    window.location.href = '/login.html';
    return;
  }

  // DOM elements
  const assignmentTableBody = document.getElementById('assignment-table-body');
  const paginationInfo = document.getElementById('pagination-info');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const searchBar = document.getElementById('search-bar');
  const submissionsModal = document.getElementById('submissions-modal');
  const modalTitle = document.getElementById('modal-title');
  const submissionsTableBody = document.getElementById('submissions-table-body');
  const closeSubmissionsModalBtn = document.getElementById('close-submissions-modal');
  const gradeModal = document.getElementById('grade-modal');
  const gradeForm = document.getElementById('grade-form');
  const closeGradeModal = document.getElementById('close-grade-modal');
  const listBtn = document.getElementById('list-btn');
  const listDropdown = document.getElementById('list-dropdown');
  const pdfViewerModal = document.getElementById('pdf-viewer-modal');
  const pdfCanvas = document.getElementById('pdf-canvas');
  const prevPdfPage = document.getElementById('prev-pdf-page');
  const nextPdfPage = document.getElementById('next-pdf-page');
  const pdfPageInfo = document.getElementById('pdf-page-info');
  const closePdfModal = document.getElementById('close-pdf-modal');

  // Verify DOM elements
  const elements = { assignmentTableBody, paginationInfo, prevPageBtn, nextPageBtn, searchBar, submissionsModal, modalTitle, submissionsTableBody, closeSubmissionsModalBtn, gradeModal, gradeForm, closeGradeModal, listBtn, listDropdown, pdfViewerModal, pdfCanvas, prevPdfPage, nextPdfPage, pdfPageInfo, closePdfModal };
  Object.entries(elements).forEach(([key, value]) => {
    console.log(`DOM element ${key}: ${value ? 'Found' : 'Not found'}`);
  });

  if (!listBtn || !listDropdown) {
    console.error('Critical DOM elements missing', { listBtn: !!listBtn, listDropdown: !!listDropdown });
    return;
  }

  let assignments = [];
  let submissions = [];
  let totalAssignments = 0;
  let totalSubmissions = 0;
  let currentPage = 1;
  let submissionsPage = 1;
  const itemsPerPage = 10;
  let searchQuery = '';
  let pdfDocument = null;
  let currentPdfPage = 1;
  let totalPdfPages = 0;

  // Toggle dropdown
  listBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Toggling dropdown');
    listDropdown.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!listBtn.contains(e.target) && !listDropdown.contains(e.target) && !listDropdown.classList.contains('hidden')) {
      console.log('Closing dropdown');
      listDropdown.classList.add('hidden');
    }
  });

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      console.log('Fetching assignments', { page: currentPage, limit: itemsPerPage, search: searchQuery });
      const response = await fetch(`/api/lecturer-assignments?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Assignments fetch response', { status: response.status, ok: response.ok, data });

      if (response.ok) {
        assignments = data.assignments || [];
        totalAssignments = data.total || 0;
        currentPage = data.page || 1;
        console.log('Assignments fetched', { count: assignments.length, total: totalAssignments, page: currentPage, sample: assignments[0] });
        renderAssignmentTable();
      } else {
        console.error('Assignments fetch failed', { status: response.status, data });
        alert(`Failed to load assignments: ${data.message || 'Unknown error'}`);
        if (response.status === 401 || response.status === 403) {
          console.warn('Unauthorized or forbidden, redirecting to login');
          localStorage.clear();
          window.location.href = '/login.html';
        }
      }
    } catch (err) {
      console.error('Assignments fetch error', { message: err.message, stack: err.stack });
      alert(`Failed to load assignments: ${err.message || 'Network error'}`);
    }
  };

  // Render assignment table
  const renderAssignmentTable = () => {
    if (!assignmentTableBody || !paginationInfo) {
      console.error('Cannot render table: DOM elements missing', { assignmentTableBody: !!assignmentTableBody, paginationInfo: !!paginationInfo });
      return;
    }
    assignmentTableBody.innerHTML = assignments.length ? '' : '<tr><td colspan="6" class="p-2 text-center">No assignments found</td></tr>';
    assignments.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${item.title || 'N/A'}</td>
        <td class="p-2">${item.course || 'N/A'}</td>
        <td class="p-2">${item.batch || 'N/A'}</td>
        <td class="p-2">${item.due_date || 'N/A'}</td>
        <td class="p-2">${item.submissions}/${item.total_students}</td>
        <td class="p-2">
          <button class="view-btn text-gray-700 hover:text-gray-900 mr-2" title="View Submissions" data-id="${item.title}"><i class="fas fa-eye"></i></button>
          <button class="download-btn text-gray-700 hover:text-gray-900" title="Download All" data-id="${item.title}"><i class="fas fa-download"></i></button>
        </td>
      `;
      assignmentTableBody.appendChild(row);
    });

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalAssignments);
    paginationInfo.textContent = `Showing ${start}-${end} of ${totalAssignments}`;
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage * itemsPerPage >= totalAssignments;
  };

  // Fetch submissions for an assignment
  const fetchSubmissions = async (assignmentId) => {
    if (!submissionsTableBody || !modalTitle) {
      console.error('Cannot fetch submissions: DOM elements missing', { submissionsTableBody: !!submissionsTableBody, modalTitle: !!modalTitle });
      return;
    }
    try {
      console.log('Fetching submissions for assignment', { assignmentId });
      const response = await fetch(`/api/lecturer-assignments/${encodeURIComponent(assignmentId)}/submissions?page=${submissionsPage}&limit=${itemsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Submissions fetch response', { status: response.status, ok: response.ok, data });

      if (response.ok) {
        submissions = data.submissions || [];
        totalSubmissions = data.total || 0;
        submissionsPage = data.page || 1;
        console.log('Submissions fetched', { count: submissions.length, total: totalSubmissions, page: submissionsPage, sample: submissions[0] });
        renderSubmissionsTable(assignmentId);
      } else {
        console.error('Submissions fetch failed', { status: response.status, data });
        alert(`Failed to load submissions: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Submissions fetch error', { message: err.message, stack: err.stack });
      alert(`Failed to load submissions: ${err.message || 'Network error'}`);
    }
  };

  // Render submissions table
  const renderSubmissionsTable = (assignmentId) => {
    modalTitle.textContent = `Submissions: ${assignmentId}`;
    submissionsTableBody.innerHTML = submissions.length ? '' : '<tr><td colspan="5" class="p-2 text-center">No submissions found</td></tr>';
    submissions.forEach(item => {
      const row = document.createElement('tr');
      const statusClass = item.status === 'Graded' ? 'text-green-600' : item.status === 'Rejected' ? 'text-red-600' : 'text-gray-600';
      row.innerHTML = `
        <td class="p-2">${item.student_id || 'N/A'}</td>
        <td class="p-2">${new Date(item.created_at).toLocaleString()}</td>
        <td class="p-2 ${statusClass}">${item.status || 'N/A'}</td>
        <td class="p-2">${item.grade || 'N/A'}</td>
        <td class="p-2">
          <button class="preview-btn text-gray-700 hover:text-gray-900 mr-2" title="Preview" data-id="${item.submission_id}" data-filename="${item.file_name}"><i class="fas fa-eye"></i></button>
          <button class="grade-btn text-gray-700 hover:text-gray-900 mr-2" title="Grade" data-id="${item.submission_id}"><i class="fas fa-edit"></i></button>
          <p class="text-sm text-gray-600">${item.feedback || 'No feedback'}</p>
        </td>
      `;
      submissionsTableBody.appendChild(row);
    });
    openSubmissionsModal();
  };

  // PDF viewer rendering
  const renderPdfPage = async (pageNum) => {
    if (!pdfDocument || !pdfCanvas) return;
    currentPdfPage = pageNum;
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvasContext = pdfCanvas.getContext('2d');
    pdfCanvas.height = viewport.height;
    pdfCanvas.width = viewport.width;
    await page.render({ canvasContext, viewport }).promise;
    pdfPageInfo.textContent = `Page ${currentPdfPage} of ${totalPdfPages}`;
    prevPdfPage.disabled = currentPdfPage === 1;
    nextPdfPage.disabled = currentPdfPage === totalPdfPages;
  };

  // Preview submission with PDF viewer
  if (submissionsTableBody) {
    submissionsTableBody.addEventListener('click', async (e) => {
      const previewBtn = e.target.closest('.preview-btn');
      if (previewBtn) {
        const submissionId = previewBtn.dataset.id;
        const fileName = previewBtn.dataset.filename;
        try {
          console.log('Fetching submission file', { submissionId, fileName });
          const response = await fetch(`/api/lecturer-assignments/submissions/${submissionId}/download`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('File fetch response', { status: response.status, ok: response.ok });

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            pdfDocument = await pdfjsLib.getDocument(url).promise;
            totalPdfPages = pdfDocument.numPages;
            currentPdfPage = 1;
            openPdfViewerModal();
            await renderPdfPage(currentPdfPage);
            console.log('PDF viewer opened', { submissionId, fileName });
          } else {
            // Clone response to read body safely
            const clonedResponse = response.clone();
            let errorData = { message: `Server error (status ${response.status})` };
            try {
              errorData = await clonedResponse.json();
            } catch (jsonErr) {
              console.error('Non-JSON response received', { status: response.status });
            }
            console.error('File fetch failed', { status: response.status, errorData });
            alert(`Failed to open PDF: ${errorData.message}`);
            if (response.status === 401 || response.status === 403) {
              console.warn('Unauthorized or forbidden, redirecting to login');
              localStorage.clear();
              window.location.href = '/login.html';
            }
          }
        } catch (err) {
          console.error('File fetch error', { message: err.message, stack: err.stack });
          alert(`Failed to open PDF: ${err.message || 'Network error'}`);
        }
      }
    });
  }

  // PDF navigation
  if (prevPdfPage) {
    prevPdfPage.addEventListener('click', () => {
      if (currentPdfPage > 1) {
        renderPdfPage(currentPdfPage - 1);
      }
    });
  }

  if (nextPdfPage) {
    nextPdfPage.addEventListener('click', () => {
      if (currentPdfPage < totalPdfPages) {
        renderPdfPage(currentPdfPage + 1);
      }
    });
  }

  if (closePdfModal) {
    closePdfModal.addEventListener('click', () => {
      console.log('Closing PDF viewer modal');
      closePdfViewerModal();
      if (pdfDocument) {
        pdfDocument.destroy();
        pdfDocument = null;
      }
      if (pdfCanvas.src) window.URL.revokeObjectURL(pdfCanvas.src);
    });
  }

  // Pagination handlers
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        console.log('Previous page clicked', { newPage: currentPage });
        fetchAssignments();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (currentPage * itemsPerPage < totalAssignments) {
        currentPage++;
        console.log('Next page clicked', { newPage: currentPage });
        fetchAssignments();
      }
    });
  }

  // Search handler
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      currentPage = 1;
      console.log('Search query updated', { searchQuery });
      fetchAssignments();
    });
  }

  // View submissions handler
  if (assignmentTableBody) {
    assignmentTableBody.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.view-btn');
      if (viewBtn) {
        const assignmentId = viewBtn.dataset.id;
        submissionsPage = 1;
        console.log('View submissions clicked', { assignmentId });
        fetchSubmissions(assignmentId);
      }
    });
  }

  // Download all submissions
  if (assignmentTableBody) {
    assignmentTableBody.addEventListener('click', async (e) => {
      const downloadBtn = e.target.closest('.download-btn');
      if (downloadBtn) {
        const assignmentId = downloadBtn.dataset.id;
        try {
          console.log('Fetching all submissions for assignment', { assignmentId });
          const response = await fetch(`/api/lecturer-assignments/${encodeURIComponent(assignmentId)}/download-all`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Download all response', { status: response.status, ok: response.ok });

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${assignmentId.replace(/\s+/g, '_')}_submissions.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            console.log('All submissions downloaded', { assignmentId });
          } else {
            const data = await response.json();
            console.error('Download all failed', { status: response.status, data });
            alert(`Failed to download submissions: ${data.message || 'Unknown error'}`);
          }
        } catch (err) {
          console.error('Download all error', { message: err.message, stack: err.stack });
          alert(`Failed to download submissions: ${err.message || 'Network error'}`);
        }
      }
    });
  }

  // Grade submission
  if (submissionsTableBody && gradeForm) {
    submissionsTableBody.addEventListener('click', (e) => {
      const gradeBtn = e.target.closest('.grade-btn');
      if (gradeBtn) {
        const submissionId = gradeBtn.dataset.id;
        const submission = submissions.find(s => s.submission_id === submissionId);
        if (submission) {
          gradeForm.querySelector('[name="submission_id"]').value = submissionId;
          gradeForm.querySelector('[name="status"]').value = submission.status || 'Submitted';
          gradeForm.querySelector('[name="grade"]').value = submission.grade || '';
          gradeForm.querySelector('[name="feedback"]').value = submission.feedback || '';
          console.log('Opening grade modal', { submissionId });
          gradeModal.classList.remove('hidden');
        }
      }
    });
  }

  // Close submissions modal
  if (closeSubmissionsModalBtn) {
    closeSubmissionsModalBtn.addEventListener('click', () => {
      console.log('Closing submissions modal');
      closeSubmissionsModal();
    });
  } else {
    console.warn('closeSubmissionsModalBtn not found; modal cannot be closed via button');
  }

  // Close grade modal
  if (closeGradeModal) {
    closeGradeModal.addEventListener('click', () => {
      console.log('Closing grade modal');
      gradeModal.classList.add('hidden');
      if (gradeForm) gradeForm.reset();
    });
  }

  // Submit grade form
  if (gradeForm) {
    gradeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(gradeForm);
      const submissionData = {
        status: formData.get('status'),
        grade: formData.get('grade') ? parseFloat(formData.get('grade')) : null,
        feedback: formData.get('feedback') || null
      };
      const submissionId = formData.get('submission_id');

      if (!submissionData.status) {
        alert('Status is required');
        return;
      }

      try {
        console.log('Submitting grade update', { submissionId, submissionData });
        const response = await fetch(`/api/lecturer-assignments/submissions/${submissionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(submissionData)
        });
        const data = await response.json();
        console.log('Grade update response', { status: response.status, data });

        if (response.ok) {
          alert('Submission updated successfully!');
          gradeModal.classList.add('hidden');
          gradeForm.reset();
          fetchSubmissions(submissions[0]?.name); // Refresh submissions
        } else {
          console.error('Grade update failed', { status: response.status, data });
          alert(`Failed to update submission: ${data.message || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Grade update error', { message: err.message, stack: err.stack });
        alert(`Failed to update submission: ${err.message || 'Network error'}`);
      }
    });
  }

  // Initialize
  console.log('Initializing page');
  fetchAssignments();
});