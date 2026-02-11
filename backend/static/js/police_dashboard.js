document.addEventListener('DOMContentLoaded', function () {
    console.log('Police Dashboard Initialized');

    // Initialize Charts if on dashboard
    const chartCanvas = document.getElementById('crimeChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Reported Crimes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Crime Trends (Last 6 Months)'
                    }
                }
            }
        });
    }

    // Modal Logic
    window.openReviewModal = function (firId) {
        // Fetch FIR details via API or just show placeholder for now
        alert('Review functionality for FIR #' + firId + ' coming soon via API integration.');
    };
});
