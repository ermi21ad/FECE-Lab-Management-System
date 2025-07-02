// // lab-management-system/scripts/login.js
// document.addEventListener('DOMContentLoaded', () => {
//   const loginForm = document.getElementById('login-form');

//   if (!loginForm) {
//     console.error('Login form not found');
//     return;
//   }

//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = new FormData(loginForm);
//     const id_number = formData.get('id_number');
//     const password = formData.get('password');

//     console.log('Form data:', { id_number, password });

//     if (!id_number || !password) {
//       alert('Please enter both ID Number and Password');
//       return;
//     }

//     const data = { id_number, password };

//     console.log('Sending login request:', data);

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       console.log('Login response:', result);

//       if (response.ok) {
//         localStorage.setItem('token', result.token);
//         localStorage.setItem('role', result.role);

//         switch (result.role) {
//           case 'student':
//             window.location.href = '/pages/students/dashboard.html';
//             break;
//           case 'lecturer':
//             window.location.href = '/pages/lecturers/dashboard.html';
//             break;
//           case 'lab-technician':
//             window.location.href = '/pages/lab-technicians/dashboard.html';
//             break;
//           case 'faculty-admin':
//             window.location.href = '/pages/faculty-admin/dashboard.html';
//             break;
//           default:
//             alert('Unknown role');
//         }
//       } else {
//         alert(result.message || 'Login failed');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       alert('Something went wrong');
//     }
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (!loginForm) {
    console.error('Login form not found');
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const id_number = formData.get('id_number');
    const password = formData.get('password');

    console.log('Form data:', { id_number, password });

    if (!id_number || !password) {
      alert('Please enter both ID Number and Password');
      return;
    }

    const data = { id_number, password };

    console.log('Sending login request:', data);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Login response:', { 
        token: result.token ? '[Present]' : '[Missing]', 
        role: result.role, 
        roleLength: result.role ? result.role.length : 0 
      });

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        console.log('Stored in localStorage:', { 
          token: localStorage.getItem('token') ? '[Present]' : '[Missing]', 
          role: localStorage.getItem('role') 
        });

        switch (result.role) {
          case 'student':
            window.location.href = '/pages/students/dashboard.html';
            break;
          case 'lecturer':
            window.location.href = '/pages/lecturers/dashboard.html';
            break;
          case 'lab-technician':
            window.location.href = '/pages/lab-technicians/dashboard.html';
            break;
          case 'faculty-admin':
            window.location.href = '/pages/faculty-admin/dashboard.html';
            break;
          default:
            alert('Unknown role');
        }
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err.message, err.stack);
      alert('Something went wrong');
    }
  });
});