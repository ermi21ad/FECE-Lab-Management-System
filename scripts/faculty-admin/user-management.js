// document.addEventListener('DOMContentLoaded', () => {
//   // Check if logged in
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');
//   if (!token || role !== 'faculty-admin') {
//     window.location.href = '/login.html';
//     return;
//   }

//   console.log('User Management loaded');

//   // Tab switching
//   const individualTab = document.getElementById('individual-tab');
//   const bulkTab = document.getElementById('bulk-tab');
//   const usersTab = document.getElementById('users-tab');
//   const individualContent = document.getElementById('individual-content');
//   const bulkContent = document.getElementById('bulk-content');
//   const usersContent = document.getElementById('users-content');

//   individualTab.addEventListener('click', () => {
//     individualTab.classList.add('border-b-2', 'border-gray-500');
//     bulkTab.classList.remove('border-b-2', 'border-gray-500');
//     usersTab.classList.remove('border-b-2', 'border-gray-500');
//     individualContent.classList.remove('hidden');
//     bulkContent.classList.add('hidden');
//     usersContent.classList.add('hidden');
//   });

//   bulkTab.addEventListener('click', () => {
//     bulkTab.classList.add('border-b-2', 'border-gray-500');
//     individualTab.classList.remove('border-b-2', 'border-gray-500');
//     usersTab.classList.remove('border-b-2', 'border-gray-500');
//     bulkContent.classList.remove('hidden');
//     individualContent.classList.add('hidden');
//     usersContent.classList.add('hidden');
//   });

//   usersTab.addEventListener('click', () => {
//     usersTab.classList.add('border-b-2', 'border-gray-500');
//     individualTab.classList.remove('border-b-2', 'border-gray-500');
//     bulkTab.classList.remove('border-b-2', 'border-gray-500');
//     usersContent.classList.remove('hidden');
//     individualContent.classList.add('hidden');
//     bulkContent.classList.add('hidden');
//     fetchUsers();
//   });

//   // Role form switching
//   const roleSelect = document.getElementById('role-select');
//   const labTechnicianForm = document.getElementById('lab-technician-form');
//   const lecturerForm = document.getElementById('lecturer-form');
//   const studentForm = document.getElementById('student-form');

//   roleSelect.addEventListener('change', () => {
//     labTechnicianForm.classList.add('hidden');
//     lecturerForm.classList.add('hidden');
//     studentForm.classList.add('hidden');

//     if (roleSelect.value === 'lab-technician') {
//       labTechnicianForm.classList.remove('hidden');
//     } else if (roleSelect.value === 'lecturer') {
//       lecturerForm.classList.remove('hidden');
//     } else if (roleSelect.value === 'student') {
//       studentForm.classList.remove('hidden');
//     }
//   });

//   // Individual registration
//   const submitForm = async (form, role) => {
//     const formData = new FormData(form);
//     const data = {
//       role,
//       full_name: formData.get('full_name'),
//       id: formData.get('id_number'),
//       email: formData.get('email'),
//       password: formData.get('password') || 'temp123',
//       extra: {},
//     };

//     if (role === 'student') {
//       data.extra.batch = formData.get('batch');
//     } else if (role === 'lab-technician') {
//       data.extra.assigned_lab_id = formData.get('assigned_lab_id');
//     } else if (role === 'lecturer') {
//       data.extra.assigned_courses = formData.get('courses_assigned');
//     }

//     console.log('Submitting:', data);

//     try {
//       const response = await fetch('/api/users/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       console.log('Response:', result);

//       if (response.ok) {
//         alert('User registered successfully!');
//         form.reset();
//       } else {
//         alert(result.message || 'Registration failed');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       alert('Something went wrong');
//     }
//   };

//   labTechnicianForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     submitForm(labTechnicianForm, 'lab-technician');
//   });

//   lecturerForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     submitForm(lecturerForm, 'lecturer');
//   });

//   studentForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     submitForm(studentForm, 'student');
//   });

//   // Bulk registration
//   const uploadBtn = document.getElementById('upload-btn');
//   const csvUpload = document.getElementById('csv-upload');
//   const previewTable = document.getElementById('preview-table');
//   const confirmImport = document.getElementById('confirm-import');

//   let csvData = [];

//   uploadBtn.addEventListener('click', async () => {
//     if (csvUpload.files.length === 0) {
//       alert('Please select a CSV file');
//       return;
//     }

//     const file = csvUpload.files[0];
//     csvData = [];

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const text = e.target.result;
//       const lines = text.split('\n').filter(line => line.trim());
//       const headers = lines[0].split(',').map(h => h.trim());
//       csvData = lines.slice(1).map(line => {
//         const values = line.split(',').map(v => v.trim());
//         const row = {};
//         headers.forEach((header, i) => {
//           row[header] = values[i] || '';
//         });
//         return {
//           full_name: row.full_name || '',
//           id: row.student_id || row.technician_id || row.lecturer_id || '',
//           email: row.email || '',
//           role: roleSelect.value,
//           status: row.student_id || row.technician_id || row.lecturer_id ? 'Valid' : 'Invalid',
//         };
//       });

//       const tbody = previewTable.querySelector('tbody');
//       tbody.innerHTML = '';
//       csvData.forEach(row => {
//         const tr = document.createElement('tr');
//         tr.className = row.status === 'Invalid' ? 'bg-red-100' : '';
//         tr.innerHTML = `
//           <td class="p-2">${row.full_name}</td>
//           <td class="p-2">${row.id}</td>
//           <td class="p-2">${row.email}</td>
//           <td class="p-2">${row.role}</td>
//           <td class="p-2 ${row.status === 'Invalid' ? 'text-red-600' : 'text-green-600'}">${row.status}</td>
//         `;
//         tbody.appendChild(tr);
//       });

//       previewTable.classList.remove('hidden');
//     };
//     reader.readAsText(file);
//   });

//   confirmImport.addEventListener('click', async () => {
//     if (csvUpload.files.length === 0) {
//       alert('Please select a CSV file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', csvUpload.files[0]);
//     formData.append('role', roleSelect.value);

//     console.log('Uploading CSV for role:', roleSelect.value);

//     try {
//       const response = await fetch('/api/users/bulk-register', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const result = await response.json();
//       console.log('Bulk import response:', result);

//       if (response.ok) {
//         alert(`Bulk import completed! Errors: ${result.errors.length}`);
//         if (result.errors.length > 0) {
//           console.log('Import errors:', result.errors);
//         }
//         previewTable.classList.add('hidden');
//         csvUpload.value = '';
//       } else {
//         alert(result.message || 'Bulk import failed');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       alert('Something went wrong');
//     }
//   });

//   const fetchUsers = async () => {
//     const roles = ['student', 'lab-technician', 'lecturer'];
//     const tables = {
//       student: document.querySelector('#students-table tbody'),
//       'lab-technician': document.querySelector('#technicians-table tbody'),
//       lecturer: document.querySelector('#lecturers-table tbody'),
//     };

//     for (const role of roles) {
//       try {
//         console.log(`Fetching users for role: ${role}`);
//         const response = await fetch(`/api/users/list?role=${role}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const { users, fields } = await response.json();
//         console.log(`Users for ${role}:`, users);

//         const tbody = tables[role];
//         tbody.innerHTML = '';

//         if (users.length === 0) {
//           const tr = document.createElement('tr');
//           tr.innerHTML = `<td colspan="5" class="p-2 text-center">No users found</td>`;
//           tbody.appendChild(tr);
//           continue;
//         }

//         users.forEach(user => {
//           const tr = document.createElement('tr');
//           if (role === 'student') {
//             tr.innerHTML = `
//               <td class="p-2">${user.student_id}</td>
//               <td class="p-2">${user.full_name || '-'}</td>
//               <td class="p-2">${user.batch || '-'}</td>
//               <td class="p-2">${new Date(user.created_at).toLocaleString()}</td>
//               <td class="p-2">
//                 <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2" data-role="student" data-id="${user.student_id}" data-fullname="${user.full_name || ''}" data-extra="${user.batch || ''}">Edit</button>
//                 <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-role="student" data-id="${user.student_id}">Delete</button>
//               </td>
//             `;
//           } else if (role === 'lab-technician') {
//             tr.innerHTML = `
//               <td class="p-2">${user.technician_id}</td>
//               <td class="p-2">${user.full_name || '-'}</td>
//               <td class="p-2">${user.assigned_lab_id || '-'}</td>
//               <td class="p-2">${new Date(user.created_at).toLocaleString()}</td>
//               <td class="p-2">
//                 <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2" data-role="lab-technician" data-id="${user.technician_id}" data-fullname="${user.full_name || ''}" data-extra="${user.assigned_lab_id || ''}">Edit</button>
//                 <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-role="lab-technician" data-id="${user.technician_id}">Delete</button>
//               </td>
//             `;
//           } else if (role === 'lecturer') {
//             tr.innerHTML = `
//               <td class="p-2">${user.lecturer_id}</td>
//               <td class="p-2">${user.full_name || '-'}</td>
//               <td class="p-2">${user.assigned_courses || '-'}</td>
//               <td class="p-2">${new Date(user.created_at).toLocaleString()}</td>
//               <td class="p-2">
//                 <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2" data-role="lecturer" data-id="${user.lecturer_id}" data-fullname="${user.full_name || ''}" data-extra="${user.assigned_courses || ''}">Edit</button>
//                 <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-role="lecturer" data-id="${user.lecturer_id}">Delete</button>
//               </td>
//             `;
//           }
//           tbody.appendChild(tr);
//         });

//         // Attach event listeners for delete buttons
//         document.querySelectorAll('.delete-btn').forEach(btn => {
//           btn.addEventListener('click', async () => {
//             const role = btn.dataset.role;
//             const id = btn.dataset.id;
//             if (confirm(`Are you sure you want to delete ${role} with ID ${id}?`)) {
//               try {
//                 const response = await fetch('/api/users/delete', {
//                   method: 'DELETE',
//                   headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                   },
//                   body: JSON.stringify({ role, id }),
//                 });

//                 const result = await response.json();
//                 if (response.ok) {
//                   alert('User deleted successfully');
//                   fetchUsers();
//                 } else {
//                   alert(result.message || 'Deletion failed');
//                 }
//               } catch (err) {
//                 console.error('Delete error:', err);
//                 alert('Something went wrong');
//               }
//             }
//           });
//         });

//         // Attach event listeners for edit buttons
//         const editModal = document.getElementById('edit-modal');
//         const editForm = document.getElementById('edit-form');
//         const cancelEdit = document.getElementById('cancel-edit');
//         const extraField = document.getElementById('extra-field');

//         document.querySelectorAll('.edit-btn').forEach(btn => {
//           btn.addEventListener('click', () => {
//             const role = btn.dataset.role;
//             const id = btn.dataset.id;
//             const fullName = btn.dataset.fullname;
//             const extra = btn.dataset.extra;

//             editForm.querySelector('[name="role"]').value = role;
//             editForm.querySelector('[name="id_number"]').value = id;
//             editForm.querySelector('[name="full_name"]').value = fullName;

//             extraField.innerHTML = '';
//             if (role === 'student') {
//               extraField.innerHTML = `
//                 <div>
//                   <label class="block text-sm font-medium text-gray-700">Batch</label>
//                   <input type="text" name="batch" value="${extra}" class="mt-1 w-full p-2 border rounded-md">
//                 </div>
//               `;
//             } else if (role === 'lab-technician') {
//               extraField.innerHTML = `
//                 <div>
//                   <label class="block text-sm font-medium text-gray-700">Assigned Lab ID</label>
//                   <input type="text" name="assigned_lab_id" value="${extra}" class="mt-1 w-full p-2 border rounded-md">
//                 </div>
//               `;
//             } else if (role === 'lecturer') {
//               extraField.innerHTML = `
//                 <div>
//                   <label class="block text-sm font-medium text-gray-700">Assigned Courses</label>
//                   <input type="text" name="assigned_courses" value="${extra}" class="mt-1 w-full p-2 border rounded-md">
//                 </div>
//               `;
//             }

//             editModal.classList.remove('hidden');
//           });
//         });

//         cancelEdit.addEventListener('click', () => {
//           editModal.classList.add('hidden');
//         });

//         editForm.addEventListener('submit', async (e) => {
//           e.preventDefault();
//           const formData = new FormData(editForm);
//           const data = {
//             role: formData.get('role'),
//             id: formData.get('id_number'),
//             full_name: formData.get('full_name'),
//             extra: {},
//           };

//           if (data.role === 'student') {
//             data.extra.batch = formData.get('batch');
//           } else if (data.role === 'lab-technician') {
//             data.extra.assigned_lab_id = formData.get('assigned_lab_id');
//           } else if (data.role === 'lecturer') {
//             data.extra.assigned_courses = formData.get('assigned_courses');
//           }

//           try {
//             const response = await fetch('/api/users/edit', {
//               method: 'PUT',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify(data),
//             });

//             const result = await response.json();
//             if (response.ok) {
//               alert('User updated successfully');
//               editModal.classList.add('hidden');
//               fetchUsers();
//             } else {
//               alert(result.message || 'Update failed');
//             }
//           } catch (err) {
//             console.error('Edit error:', err);
//             alert('Something went wrong');
//           }
//         });
//       } catch (err) {
//         console.error(`Error fetching ${role} users:`, err.message);
//         const tbody = tables[role];
//         tbody.innerHTML = `<tr><td colspan="5" class="p-2 text-center text-red-600">Error loading users: ${err.message}</td></tr>`;
//       }
//     }
//   };

//   // Dropdown toggle
//   const listBtn = document.getElementById('list-btn');
//   const listDropdown = document.getElementById('list-dropdown');

//   listBtn.addEventListener('click', () => {
//     listDropdown.classList.toggle('hidden');
//   });

//   document.addEventListener('click', (e) => {
//     if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
//       listDropdown.classList.add('hidden');
//     }
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  // Check if logged in
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'faculty-admin') {
    console.warn('No token or incorrect role, redirecting to login');
    window.location.href = '/login.html';
    return;
  }

  console.log('User Management loaded');
  console.log('Token:', token);
  console.log('Role:', role);

  // Tab switching
  const individualTab = document.getElementById('individual-tab');
  const bulkTab = document.getElementById('bulk-tab');
  const usersTab = document.getElementById('users-tab');
  const individualContent = document.getElementById('individual-content');
  const bulkContent = document.getElementById('bulk-content');
  const usersContent = document.getElementById('users-content');

  individualTab.addEventListener('click', () => {
    individualTab.classList.add('border-b-2', 'border-gray-500');
    bulkTab.classList.remove('border-b-2', 'border-gray-500');
    usersTab.classList.remove('border-b-2', 'border-gray-500');
    individualContent.classList.remove('hidden');
    bulkContent.classList.add('hidden');
    usersContent.classList.add('hidden');
  });

  bulkTab.addEventListener('click', () => {
    bulkTab.classList.add('border-b-2', 'border-gray-500');
    individualTab.classList.remove('border-b-2', 'border-gray-500');
    usersTab.classList.remove('border-b-2', 'border-gray-500');
    bulkContent.classList.remove('hidden');
    individualContent.classList.add('hidden');
    usersContent.classList.add('hidden');
  });

  usersTab.addEventListener('click', () => {
    usersTab.classList.add('border-b-2', 'border-gray-500');
    individualTab.classList.remove('border-b-2', 'border-gray-500');
    bulkTab.classList.remove('border-b-2', 'border-gray-500');
    usersContent.classList.remove('hidden');
    individualContent.classList.add('hidden');
    bulkContent.classList.add('hidden');
    fetchUsers();
  });

  // Role form switching
  const roleSelect = document.getElementById('role-select');
  const labTechnicianForm = document.getElementById('lab-technician-form');
  const lecturerForm = document.getElementById('lecturer-form');
  const studentForm = document.getElementById('student-form');

  roleSelect.addEventListener('change', () => {
    labTechnicianForm.classList.add('hidden');
    lecturerForm.classList.add('hidden');
    studentForm.classList.add('hidden');

    if (roleSelect.value === 'lab-technician') {
      labTechnicianForm.classList.remove('hidden');
    } else if (roleSelect.value === 'lecturer') {
      lecturerForm.classList.remove('hidden');
    } else if (roleSelect.value === 'student') {
      studentForm.classList.remove('hidden');
    }
  });

  // Individual registration
  const submitForm = async (form, role) => {
    const formData = new FormData(form);
    const data = {
      role,
      full_name: formData.get('full_name'),
      id_number: formData.get('id_number'),
      email: formData.get('email'),
      password: formData.get('password') || 'temp123',
      extra: {},
    };

    if (role === 'student') {
      data.extra.batch = formData.get('batch');
    } else if (role === 'lab-technician') {
      data.extra.assigned_lab_id = formData.get('assigned_lab_id');
    } else if (role === 'lecturer') {
      data.extra.assigned_courses = formData.get('courses_assigned');
    }

    console.log('Submitting:', data);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok) {
        alert('User registered successfully!');
        form.reset();
        fetchUsers();
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err.message);
      alert('Something went wrong: ' + err.message);
    }
  };

  labTechnicianForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(labTechnicianForm, 'lab-technician');
  });

  lecturerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(lecturerForm, 'lecturer');
  });

  studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(studentForm, 'student');
  });

  // Bulk registration
  const uploadBtn = document.getElementById('upload-btn');
  const csvUpload = document.getElementById('csv-upload');
  const previewTable = document.getElementById('preview-table');
  const confirmImport = document.getElementById('confirm-import');

  let csvData = [];

  uploadBtn.addEventListener('click', async () => {
    if (csvUpload.files.length === 0) {
      alert('Please select a CSV file');
      return;
    }

    const file = csvUpload.files[0];
    csvData = [];

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      csvData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        const id = row.id_number || row.student_id || row.technician_id || row.lecturer_id || '';
        return {
          full_name: row.full_name || '',
          id_number: id,
          email: row.email || '',
          role: roleSelect.value,
          extra: {
            batch: row.batch || '',
            assigned_lab_id: row.assigned_lab_id || '',
            assigned_courses: row.assigned_courses || '',
          },
          status: id ? 'Valid' : 'Invalid',
        };
      });

      const tbody = previewTable.querySelector('tbody');
      tbody.innerHTML = '';
      csvData.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = row.status === 'Invalid' ? 'bg-red-100' : '';
        tr.innerHTML = `
          <td class="p-2">${row.full_name}</td>
          <td class="p-2">${row.id_number}</td>
          <td class="p-2">${row.email}</td>
          <td class="p-2">${row.role}</td>
          <td class="p-2 ${row.status === 'Invalid' ? 'text-red-600' : 'text-green-600'}">${row.status}</td>
        `;
        tbody.appendChild(tr);
      });

      previewTable.classList.remove('hidden');
    };
    reader.readAsText(file);
  });

  confirmImport.addEventListener('click', async () => {
    if (csvUpload.files.length === 0) {
      alert('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvUpload.files[0]);
    formData.append('role', roleSelect.value);

    console.log('Uploading CSV for role:', roleSelect.value);

    try {
      const response = await fetch('/api/users/bulk-register', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Bulk import response:', result);

      if (response.ok) {
        alert(`Bulk import completed! Errors: ${result.errors.length}`);
        if (result.errors.length > 0) {
          console.log('Import errors:', result.errors);
          alert('Some records failed: Check console for details');
        }
        previewTable.classList.add('hidden');
        csvUpload.value = '';
        fetchUsers();
      } else {
        alert(result.message || 'Bulk import failed');
      }
    } catch (err) {
      console.error('Bulk import error:', err.message);
      alert('Something went wrong: ' + err.message);
    }
  });

  const fetchUsers = async () => {
    const roles = ['student', 'lab-technician', 'lecturer'];
    const tables = {
      student: document.querySelector('#students-table tbody'),
      'lab-technician': document.querySelector('#technicians-table tbody'),
      lecturer: document.querySelector('#lecturers-table tbody'),
    };

    for (const role of roles) {
      try {
        console.log(`Fetching users for role: ${role}`);
        const response = await fetch(`/api/users/list?role=${role}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const { users, fields } = await response.json();
        console.log(`Users for ${role}:`, users);

        const tbody = tables[role];
        tbody.innerHTML = '';

        if (users.length === 0) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td colspan="5" class="p-2 text-center">No users found</td>`;
          tbody.appendChild(tr);
          continue;
        }

        users.forEach(user => {
          const tr = document.createElement('tr');
          if (role === 'student') {
            tr.innerHTML = `
              <td class="p-2">${user.id}</td>
              <td class="p-2">${user.full_name || '-'}</td>
              <td class="p-2">${user.email || '-'}</td>
              <td class="p-2">${user.batch || '-'}</td>
              <td class="p-2">${new Date(user.created_at).toLocaleString()}</td>
              <td class="p-2">
                <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2" data-role="student" data-id="${user.id}" data-fullname="${user.full_name || ''}" data-email="${user.email || ''}" data-extra="${user.batch || ''}">Edit</button>
                <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-role="student" data-id="${user.id}">Delete</button>
              </td>
            `;
          } else if (role === 'lab-technician') {
            tr.innerHTML = `
              <td class="p-2">${user.id}</td>
              <td class="p-2">${user.full_name || '-'}</td>
              <td class="p-2">${user.email || '-'}</td>
              <td class="p-2">${user.assigned_lab_id || '-'}</td>
              <td class="p-2">${new Date(user.created_at).toLocaleString()}</td>
              <td class="p-2">
                <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2" data-role="lab-technician" data-id="${user.id}" data-fullname="${user.full_name || ''}" data-email="${user.email || ''}" data-extra="${user.assigned_lab_id || ''}">Edit</button>
                <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-role="lab-technician" data-id="${user.id}">Delete</button>
              </td>
            `;
          } else if (role === 'lecturer') {
            tr.innerHTML = `
              <td class="p-2">${user.id}</td>
              <td class="p-2">${user.full_name || '-'}</td>
              <td class="p-2">${user.email || '-'}</td>
              <td class="p-2">${user.assigned_courses || '-'}</td>
              <td class="p-2">${new Date(user.created_at).toLocaleString()}</td>
              <td class="p-2">
                <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2" data-role="lecturer" data-id="${user.id}" data-fullname="${user.full_name || ''}" data-email="${user.email || ''}" data-extra="${user.assigned_courses || ''}">Edit</button>
                <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-role="lecturer" data-id="${user.id}">Delete</button>
              </td>
            `;
          }
          tbody.appendChild(tr);
        });

        // Attach event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const role = btn.dataset.role;
            const id = btn.dataset.id;
            if (confirm(`Are you sure you want to delete ${role} with ID ${id}?`)) {
              try {
                const response = await fetch('/api/users/delete', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ role, id }),
                });

                const result = await response.json();
                if (response.ok) {
                  alert('User deleted successfully');
                  fetchUsers();
                } else {
                  alert(result.message || 'Deletion failed');
                }
              } catch (err) {
                console.error('Delete error:', err.message);
                alert('Something went wrong: ' + err.message);
              }
            }
          });
        });

        // Attach event listeners for edit buttons
        const editModal = document.getElementById('edit-modal');
        const editForm = document.getElementById('edit-form');
        const cancelEdit = document.getElementById('cancel-edit');
        const extraField = document.getElementById('extra-field');

        document.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            const id = btn.dataset.id;
            const fullName = btn.dataset.fullname;
            const email = btn.dataset.email;
            const extra = btn.dataset.extra;

            editForm.querySelector('[name="role"]').value = role;
            editForm.querySelector('[name="id_number"]').value = id;
            editForm.querySelector('[name="full_name"]').value = fullName;
            editForm.querySelector('[name="email"]').value = email;

            extraField.innerHTML = '';
            if (role === 'student') {
              extraField.innerHTML = `
                <div>
                  <label class="block text-sm font-medium text-gray-700">Batch</label>
                  <input type="text" name="batch" value="${extra}" class="mt-1 w-full p-2 border rounded-md">
                </div>
              `;
            } else if (role === 'lab-technician') {
              extraField.innerHTML = `
                <div>
                  <label class="block text-sm font-medium text-gray-700">Assigned Lab ID</label>
                  <input type="text" name="assigned_lab_id" value="${extra}" class="mt-1 w-full p-2 border rounded-md">
                </div>
              `;
            } else if (role === 'lecturer') {
              extraField.innerHTML = `
                <div>
                  <label class="block text-sm font-medium text-gray-700">Assigned Courses</label>
                  <input type="text" name="assigned_courses" value="${extra}" class="mt-1 w-full p-2 border rounded-md">
                </div>
              `;
            }

            editModal.classList.remove('hidden');
          });
        });

        cancelEdit.addEventListener('click', () => {
          editModal.classList.add('hidden');
        });

        editForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(editForm);
          const data = {
            role: formData.get('role'),
            id: formData.get('id_number'),
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            extra: {},
          };

          if (data.role === 'student') {
            data.extra.batch = formData.get('batch');
          } else if (data.role === 'lab-technician') {
            data.extra.assigned_lab_id = formData.get('assigned_lab_id');
          } else if (data.role === 'lecturer') {
            data.extra.assigned_courses = formData.get('assigned_courses');
          }

          console.log('Editing user:', data);

          try {
            const response = await fetch('/api/users/edit', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
              alert('User updated successfully');
              editModal.classList.add('hidden');
              fetchUsers();
            } else {
              alert(result.message || 'Update failed');
            }
          } catch (err) {
            console.error('Edit error:', err.message);
            alert('Something went wrong: ' + err.message);
          }
        });
      } catch (err) {
        console.error(`Error fetching ${role} users:`, err.message);
        const tbody = tables[role];
        tbody.innerHTML = `<tr><td colspan="5" class="p-2 text-center text-red-600">Error loading users: ${err.message}</td></tr>`;
      }
    }
  };

  // Dropdown toggle
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

  // Initialize
  roleSelect.dispatchEvent(new Event('change')); // Show student form by default
  fetchUsers();
});