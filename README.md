<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student - Profile</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script>
        tailwind.config = { theme: { extend: { colors: { 'ece-gray': '#4B5563' } } } }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../styles/global.css">
</head>
<body class="bg-gray-200 font-sans">
    <div class="flex h-screen">
        <aside class="w-64 bg-gray-300 text-ece-gray flex-shrink-0 flex flex-col h-screen">
            <div class="p-4 flex-1">
                <img src="../../assets/images/logo.png" alt="ECE Logo" class="h-12 mb-6">
                <nav>
                    <ul class="space-y-2">
                        <li><a href="dashboard.html" class="block p-2 bg-blue-500 text-white rounded flex items-center space-x-2"><i class="fas fa-tachometer-alt"></i><span>Dashboard</span></a></li>
                        <li><a href="lab-schedule.html" class="block p-2 hover:bg-gray-400 rounded flex items-center space-x-2"><i class="fas fa-calendar-alt"></i><span>Lab Schedule</span></a></li>
                        <li><a href="assignments.html" class="block p-2 hover:bg-gray-400 rounded flex items-center space-x-2"><i class="fas fa-tasks"></i><span>Assignments</span></a></li>
                        <li><a href="lab-equipment-booking.html" class="block p-2 hover:bg-gray-400 rounded flex items-center space-x-2"><i class="fas fa-flask"></i><span>Lab & Equipment Booking</span></a></li>
                        <li><a href="resources.html" class="block p-2 hover:bg-gray-400 rounded flex items-center space-x-2"><i class="fas fa-book"></i><span>Resources</span></a></li>
                        <li><a href="profile.html" class="block p-2 hover:bg-gray-400 rounded flex items-center space-x-2"><i class="fas fa-user"></i><span>Profile</span></a></li>
                    </ul>
                </nav>
            </div>
            <div class="p-4">
                <a href="../../login.html" class="block p-2 hover:bg-gray-400 rounded flex items-center space-x-2"><i class="fas fa-sign-out-alt"></i><span>Logout</span></a>
            </div>
        </aside>

        <div class="flex-1 flex flex-col">
            <header class="bg-gray-100 shadow p-4 flex justify-between items-center">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold">S</div>
                    <span class="text-ece-gray text-lg font-semibold" id="user-name">Student B</span>
                </div>
                <div class="relative">
                    <button id="list-btn" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center space-x-2"><i class="fas fa-bars"></i><span>List</span></button>
                    <div id="list-dropdown" class="absolute right-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-lg hidden">
                        <a href="profile.html" class="block px-4 py-2 text-ece-gray hover:bg-gray-200 flex items-center space-x-2"><i class="fas fa-user"></i><span>Profile</span></a>
                        <a href="../../login.html" class="block px-4 py-2 text-ece-gray hover:bg-gray-200 flex items-center space-x-2"><i class="fas fa-sign-out-alt"></i><span>Logout</span></a>
                    </div>
                </div>
            </header>

            <main class="p-6 flex-1 overflow-y-auto">
                <div class="bg-gray-100 p-4 rounded-lg shadow">
                    <h1 class="text-2xl font-bold text-ece-gray mb-6 flex items-center space-x-2"><i class="fas fa-user"></i><span>Profile</span></h1>

                    <div class="space-y-6">
                        <!-- Personal Information -->
                        <div>
                            <h2 class="text-lg font-semibold text-ece-gray mb-4">Personal Information</h2>
                            <form id="personal-info-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="fullName" class="mt-1 w-full p-2 border rounded-md" value="Bereket Alemayehu" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Student ID</label>
                                    <input type="text" id="studentId" class="mt-1 w-full p-2 border rounded-md" value="ECE123" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" class="mt-1 w-full p-2 border rounded-md" value="bereket@ece.edu" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="tel" class="mt-1 w-full p-2 border rounded-md" value="+251912345678">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Batch</label>
                                    <input type="text" class="mt-1 w-full p-2 border rounded-md" value="2023" required>
                                </div>
                                <div class="col-span-2 flex justify-end">
                                    <button type="submit" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center space-x-2"><i class="fas fa-save"></i><span>Save</span></button>
                                </div>
                            </form>
                        </div>

                        <!-- Profile Picture -->
                        <div>
                            <h2 class="text-lg font-semibold text-ece-gray mb-4">Profile Picture</h2>
                            <div class="flex items-center space-x-4">
                                <img src="https://via.placeholder.com/80" alt="Profile" class="w-20 h-20 rounded-full">
                                <input type="file" id="profile-pic-upload" class="mt-1" accept="image/jpeg,image/png" max-size="2000000">
                            </div>
                        </div>

                        <!-- Password Management -->
                        <div>
                            <h2 class="text-lg font-semibold text-ece-gray mb-4">Change Password</h2>
                            <form id="password-form" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Current Password</label>
                                    <div class="relative">
                                        <input type="password" id="current-password" class="mt-1 w-full p-2 border rounded-md" required>
                                        <button type="button" class="toggle-password absolute right-2 top-3 text-gray-600"><i class="fas fa-eye"></i></button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">New Password</label>
                                    <div class="relative">
                                        <input type="password" id="new-password" class="mt-1 w-full p-2 border rounded-md" required>
                                        <button type="button" class="toggle-password absolute right-2 top-3 text-gray-600"><i class="fas fa-eye"></i></button>
                                    </div>
                                    <div id="password-strength" class="text-sm mt-1"></div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <div class="relative">
                                        <input type="password" id="confirm-password" class="mt-1 w-full p-2 border rounded-md" required>
                                        <button type="button" class="toggle-password absolute right-2 top-3 text-gray-600"><i class="fas fa-eye"></i></button>
                                    </div>
                                </div>
                                <div class="flex justify-end">
                                    <button type="submit" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center space-x-2"><i class="fas fa-lock"></i><span>Update Password</span></button>
                                </div>
                            </form>
                        </div>

                        <!-- QR Code Generator -->
                        <div>
                            <h2 class="text-lg font-semibold text-ece-gray mb-4">QR Code Generator</h2>
                            <div class="bg-white p-4 rounded-lg flex flex-col items-center">
                                <div id="qrcode" class="mb-4"></div>
                                <button id="generate-qr-btn" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center space-x-2 mb-2">
                                    <i class="fas fa-qrcode"></i><span>Generate QR</span>
                                </button>
                                <button id="download-qr-btn" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2">
                                    <i class="fas fa-download"></i><span>Download QR</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        // QR Code Generator
        document.getElementById('generate-qr-btn').addEventListener('click', function() {
            const fullName = document.getElementById('fullName').value;
            const studentId = document.getElementById('studentId').value;
            const qrData = `Name: ${fullName}\nStudent ID: ${studentId}`;
            
            // Clear previous QR code
            document.getElementById('qrcode').innerHTML = '';
            
            // Generate new QR code
            new QRCode(document.getElementById('qrcode'), {
                text: qrData,
                width: 200,
                height: 200
            });
        });

        // Download QR Code
        document.getElementById('download-qr-btn').addEventListener('click', function() {
            const canvas = document.querySelector('#qrcode canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        });

        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                if (input.type === 'password') {
                    input.type = 'text';
                    this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    this.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });
    </script>
</body>
</html>
