// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial data
    loadDashboardData();
});

// Initialize dashboard components
function initializeDashboard() {
    // Initialize charts
    initializeCharts();
    
    // Load table data
    loadTableData();
    
    // Setup real-time updates
    setupRealTimeUpdates();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Revenue period selector
    const revenuePeriod = document.getElementById('revenuePeriod');
    if (revenuePeriod) {
        revenuePeriod.addEventListener('change', function() {
            updateRevenueChart(this.value);
        });
    }
    
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            handleQuickAction(action);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            handleSearch(this.value);
        });
    }
    
    // Notification click
    const notifications = document.querySelector('.notifications');
    if (notifications) {
        notifications.addEventListener('click', function() {
            showNotifications();
        });
    }
}

// Initialize charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        window.revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: generateDateLabels(30),
                datasets: [{
                    label: 'Revenue',
                    data: generateRevenueData(30),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        window.categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#667eea',
                        '#f093fb',
                        '#4facfe',
                        '#43e97b',
                        '#ffd700'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Generate sample data
function generateDateLabels(days) {
    const labels = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return labels;
}

function generateRevenueData(days) {
    const data = [];
    let baseValue = 1000;
    
    for (let i = 0; i < days; i++) {
        const variation = (Math.random() - 0.5) * 200;
        const trend = Math.sin(i / 7) * 100;
        const value = baseValue + variation + trend;
        data.push(Math.max(0, Math.round(value)));
        baseValue = value;
    }
    
    return data;
}

// Update revenue chart based on period
function updateRevenueChart(period) {
    if (!window.revenueChart) return;
    
    let days, data;
    switch(period) {
        case '7d':
            days = 7;
            break;
        case '30d':
            days = 30;
            break;
        case '90d':
            days = 90;
            break;
        default:
            days = 30;
    }
    
    window.revenueChart.data.labels = generateDateLabels(days);
    window.revenueChart.data.datasets[0].data = generateRevenueData(days);
    window.revenueChart.update();
}

// Load table data
function loadTableData() {
    loadOrdersTable();
    loadCustomersTable();
}

function loadOrdersTable() {
    const ordersData = [
        { id: 'ORD-001', customer: 'John Smith', product: 'Laptop Pro', amount: '$1,299', status: 'completed', date: '2024-01-15' },
        { id: 'ORD-002', customer: 'Sarah Johnson', product: 'Wireless Headphones', amount: '$199', status: 'processing', date: '2024-01-14' },
        { id: 'ORD-003', customer: 'Mike Wilson', product: 'Smart Watch', amount: '$399', status: 'pending', date: '2024-01-13' },
        { id: 'ORD-004', customer: 'Emily Davis', product: 'Tablet Air', amount: '$599', status: 'completed', date: '2024-01-12' },
        { id: 'ORD-005', customer: 'David Brown', product: 'Gaming Mouse', amount: '$79', status: 'completed', date: '2024-01-11' }
    ];
    
    const tbody = document.getElementById('ordersTableBody');
    if (tbody) {
        tbody.innerHTML = ordersData.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.product}</td>
                <td>${order.amount}</td>
                <td><span class="status ${order.status}">${order.status}</span></td>
                <td>${order.date}</td>
            </tr>
        `).join('');
    }
}

function loadCustomersTable() {
    const customersData = [
        { name: 'John Smith', orders: 12, total: '$2,450', lastOrder: '2024-01-15' },
        { name: 'Sarah Johnson', orders: 8, total: '$1,890', lastOrder: '2024-01-14' },
        { name: 'Mike Wilson', orders: 15, total: '$3,200', lastOrder: '2024-01-13' },
        { name: 'Emily Davis', orders: 6, total: '$1,200', lastOrder: '2024-01-12' },
        { name: 'David Brown', orders: 9, total: '$1,750', lastOrder: '2024-01-11' }
    ];
    
    const tbody = document.getElementById('customersTableBody');
    if (tbody) {
        tbody.innerHTML = customersData.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.orders}</td>
                <td>${customer.total}</td>
                <td>${customer.lastOrder}</td>
            </tr>
        `).join('');
    }
}

// Handle quick actions
function handleQuickAction(action) {
    const actions = {
        'New Order': () => showModal('Create New Order', 'Order creation form would open here'),
        'Add Customer': () => showModal('Add New Customer', 'Customer registration form would open here'),
        'Add Product': () => showModal('Add New Product', 'Product creation form would open here'),
        'Generate Report': () => showModal('Generate Report', 'Report generation options would appear here')
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

// Show modal (placeholder)
function showModal(title, content) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${content}</p>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        .modal-content {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
}

// Handle search
function handleSearch(query) {
    console.log('Searching for:', query);
    // Implement search functionality
    // This would typically filter the displayed data
}

// Show notifications
function showNotifications() {
    const notifications = [
        'New order received from John Smith',
        'Low stock alert for Laptop Pro',
        'Payment received for ORD-001'
    ];
    
    showModal('Notifications', notifications.map(n => `• ${n}`).join('<br>'));
}

// Setup real-time updates
function setupRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        updateStats();
    }, 30000); // Update every 30 seconds
}

// Update stats with animation
function updateStats() {
    const statCards = document.querySelectorAll('.stat-card h3');
    statCards.forEach(card => {
        const currentValue = parseInt(card.textContent.replace(/[^0-9]/g, ''));
        const variation = Math.floor((Math.random() - 0.5) * 100);
        const newValue = Math.max(0, currentValue + variation);
        
        // Animate the change
        animateValue(card, currentValue, newValue, 1000);
    });
}

// Animate value change
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const isCurrency = element.textContent.includes('$');
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = isCurrency ? '$' + current.toLocaleString() : current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading
    const loadingElements = document.querySelectorAll('.stat-card, .chart-container, .table-container');
    loadingElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    });
    
    // Animate elements in
    setTimeout(() => {
        loadingElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Export functions for potential external use
window.Dashboard = {
    updateRevenueChart,
    loadTableData,
    handleQuickAction,
    showModal
};