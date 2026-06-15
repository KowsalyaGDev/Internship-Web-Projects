// Chart.js Global Configuration
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#666';
Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.1)';

// Sample Data
const salesData = {
    months: ['January', 'February', 'March', 'April', 'May', 'June'],
    barChartData: [65000, 78000, 72000, 85000, 92000, 88000],
    lineChartData: [45000, 52000, 48000, 61000, 68000, 72000],
    categories: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty'],
    categoryData: [28, 22, 18, 20, 12],
    segments: ['North Region', 'South Region', 'East Region', 'West Region'],
    segmentData: [30, 25, 25, 20],
    months_extended: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    revenueData: [45000, 52000, 48000, 61000, 68000, 72000],
    costData: [15000, 18000, 16000, 20000, 22000, 24000]
};

// Color Palettes
const primaryColors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
const chartColors = {
    purple: 'rgba(102, 126, 234, 0.7)',
    pink: 'rgba(240, 147, 251, 0.7)',
    blue: 'rgba(79, 172, 254, 0.7)',
    cyan: 'rgba(0, 242, 254, 0.7)',
    green: 'rgba(39, 174, 96, 0.7)',
    red: 'rgba(231, 76, 60, 0.7)'
};

// ============ BAR CHART ============
const barChartCtx = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(barChartCtx, {
    type: 'bar',
    data: {
        labels: salesData.months,
        datasets: [{
            label: 'Monthly Sales',
            data: salesData.barChartData,
            backgroundColor: [
                'rgba(102, 126, 234, 0.7)',
                'rgba(118, 75, 162, 0.7)',
                'rgba(240, 147, 251, 0.7)',
                'rgba(79, 172, 254, 0.7)',
                'rgba(0, 242, 254, 0.7)',
                'rgba(39, 174, 96, 0.7)'
            ],
            borderColor: [
                'rgba(102, 126, 234, 1)',
                'rgba(118, 75, 162, 1)',
                'rgba(240, 147, 251, 1)',
                'rgba(79, 172, 254, 1)',
                'rgba(0, 242, 254, 1)',
                'rgba(39, 174, 96, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(102, 126, 234, 0.9)',
            hoverBorderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    padding: 15,
                    font: { size: 13, weight: 'bold' }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        return 'Sales: $' + context.parsed.y.toLocaleString();
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + (value / 1000) + 'k';
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// ============ LINE CHART ============
const lineChartCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineChartCtx, {
    type: 'line',
    data: {
        labels: salesData.months,
        datasets: [{
            label: 'Sales Trend',
            data: salesData.lineChartData,
            borderColor: 'rgba(102, 126, 234, 1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(102, 126, 234, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: 'rgba(118, 75, 162, 1)',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    padding: 15,
                    font: { size: 13, weight: 'bold' }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return 'Trend: $' + context.parsed.y.toLocaleString();
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + (value / 1000) + 'k';
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// ============ PIE CHART ============
const pieChartCtx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(pieChartCtx, {
    type: 'pie',
    data: {
        labels: salesData.categories,
        datasets: [{
            data: salesData.categoryData,
            backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(118, 75, 162, 0.8)',
                'rgba(240, 147, 251, 0.8)',
                'rgba(79, 172, 254, 0.8)',
                'rgba(39, 174, 96, 0.8)'
            ],
            borderColor: [
                'rgba(102, 126, 234, 1)',
                'rgba(118, 75, 162, 1)',
                'rgba(240, 147, 251, 1)',
                'rgba(79, 172, 254, 1)',
                'rgba(39, 174, 96, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    font: { size: 12 }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                    }
                }
            }
        }
    }
});

// ============ DOUGHNUT CHART ============
const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');
const doughnutChart = new Chart(doughnutChartCtx, {
    type: 'doughnut',
    data: {
        labels: salesData.segments,
        datasets: [{
            data: salesData.segmentData,
            backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(240, 147, 251, 0.8)',
                'rgba(79, 172, 254, 0.8)',
                'rgba(39, 174, 96, 0.8)'
            ],
            borderColor: [
                'rgba(102, 126, 234, 1)',
                'rgba(240, 147, 251, 1)',
                'rgba(79, 172, 254, 1)',
                'rgba(39, 174, 96, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: { size: 12 }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                    }
                }
            }
        }
    }
});

// ============ AREA CHART ============
const areaChartCtx = document.getElementById('areaChart').getContext('2d');
const areaChart = new Chart(areaChartCtx, {
    type: 'line',
    data: {
        labels: salesData.months_extended,
        datasets: [
            {
                label: 'Revenue',
                data: salesData.revenueData,
                borderColor: 'rgba(39, 174, 96, 1)',
                backgroundColor: 'rgba(39, 174, 96, 0.2)',
                borderWidth: 3,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(39, 174, 96, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                tension: 0.4
            },
            {
                label: 'Cost',
                data: salesData.costData,
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderWidth: 3,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    padding: 15,
                    font: { size: 13, weight: 'bold' }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + (value / 1000) + 'k';
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// ============ INTERACTIVE FEATURES ============
// Add hover effect to KPI cards
document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
    });
});

// Chart animation on page load
window.addEventListener('load', function() {
    console.log('Sales Dashboard loaded successfully');
    console.log('Charts initialized with sample data');
});
