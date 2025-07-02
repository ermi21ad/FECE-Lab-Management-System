document.addEventListener('DOMContentLoaded', () => {
    console.log('Reports and Analytics loaded');

    const reportTypeSelect = document.getElementById('report-type');
    const reportContent = document.getElementById('report-content');
    const refreshBtn = document.getElementById('refresh-btn');
    const exportTypeSelect = document.getElementById('export-type');

    const reportTemplates = {
        'User Activity Report': '<h3 class="text-md font-semibold text-ece-gray">User Activity Report</h3><p class="text-gray-700 mt-2">Shows login frequency and peak usage times.</p><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Bar Chart: Login Frequency]</div><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Line Graph: Usage Trends]</div>',
        'Equipment Usage Report': '<h3 class="text-md font-semibold text-ece-gray">Equipment Usage Report</h3><p class="text-gray-700 mt-2">Tracks equipment usage and status.</p><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Pie Chart: Equipment Status]</div><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Line Chart: Usage Frequency]</div>',
        'Lab Booking Report': '<h3 class="text-md font-semibold text-ece-gray">Lab Booking Report</h3><p class="text-gray-700 mt-2">Shows lab booking trends and efficiency.</p><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Heatmap: Booking Times]</div><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Bar Chart: Popular Labs]</div>',
        'Resource Usage Report': '<h3 class="text-md font-semibold text-ece-gray">Resource Usage Report</h3><p class="text-gray-700 mt-2">Tracks resource downloads and views.</p><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Pie Chart: Resource Type Distribution]</div><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Line Graph: Downloads Over Time]</div>',
        'Faculty/Staff Performance Report': '<h3 class="text-md font-semibold text-ece-gray">Faculty/Staff Performance Report</h3><p class="text-gray-700 mt-2">Analyzes faculty activity and grading.</p><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Bar Chart: Assignments per Lecturer]</div><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Line Graph: Grading Time]</div>',
        'Student Performance & Attendance Report': '<h3 class="text-md font-semibold text-ece-gray">Student Performance & Attendance Report</h3><p class="text-gray-700 mt-2">Evaluates student grades and attendance.</p><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Line Chart: Student Grades]</div><div class="h-64 bg-gray-300 mt-4 flex items-center justify-center">[Attendance Heatmap]</div>'
    };

    reportTypeSelect.addEventListener('change', () => {
        reportContent.innerHTML = `<div class="bg-gray-200 p-4 rounded-lg">${reportTemplates[reportTypeSelect.value]}</div>`;
    });

    refreshBtn.addEventListener('click', () => {
        alert('Data refreshed!');
    });

    exportTypeSelect.addEventListener('change', () => {
        const format = exportTypeSelect.value;
        if (format !== 'Export as...') {
            alert(`Report exported as ${format}!`);
            exportTypeSelect.value = 'Export as...';
        }
    });

    // Dropdown menu code
    const listBtn = document.getElementById('list-btn');
    const listDropdown = document.getElementById('list-dropdown');

    listBtn.addEventListener('click', () => {
        listDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!listBtn.contains(e.target) && !listDropdown.contains(e.target)) {
            listDropdown.classList.add('hidden');
        }
    });
});