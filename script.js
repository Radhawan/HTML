// ERP Dashboard JavaScript
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
    
    // Load sample data
    loadSampleData();
    
    // Setup real-time updates simulation
    setupRealTimeUpdates();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
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
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
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
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
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
                            color: '#f1f5f9'
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
                }
            }
        });
    }
    
    // Products Chart
    const productsCtx = document.getElementById('productsChart');
    if (productsCtx) {
        window.productsChart = new Chart(productsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6',
                        '#ef4444'
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
function loadSampleData() {
    // Load orders table
    loadOrdersTable();
    
    // Load stock alerts
    loadStockAlerts();
    
    // Load activity feed
    loadActivityFeed();
}

// Load orders table data
function loadOrdersTable() {
    const ordersData = [
        { id: 'ORD-001', customer: 'John Smith', product: 'Laptop Pro', amount: '$1,299', status: 'completed', date: '2024-01-15' },
        { id: 'ORD-002', customer: 'Sarah Johnson', product: 'Wireless Headphones', amount: '$199', status: 'processing', date: '2024-01-15' },
        { id: 'ORD-003', customer: 'Mike Wilson', product: 'Smart Watch', amount: '$399', status: 'pending', date: '2024-01-14' },
        { id: 'ORD-004', customer: 'Emily Davis', product: 'Tablet Air', amount: '$599', status: 'completed', date: '2024-01-14' },
        { id: 'ORD-005', customer: 'David Brown', product: 'Gaming Mouse', amount: '$79', status: 'processing', date: '2024-01-13' }
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

// Load stock alerts
function loadStockAlerts() {
    const stockData = [
        { product: 'Gaming Keyboard', sku: 'KB-001', current: 5, min: 10 },
        { product: 'USB Cable', sku: 'USB-002', current: 3, min: 15 },
        { product: 'Phone Case', sku: 'PC-003', current: 8, min: 20 },
        { product: 'Bluetooth Speaker', sku: 'BS-004', current: 2, min: 12 },
        { product: 'Power Bank', sku: 'PB-005', current: 4, min: 8 }
    ];
    
    const tbody = document.getElementById('stockTableBody');
    if (tbody) {
        tbody.innerHTML = stockData.map(item => `
            <tr>
                <td>${item.product}</td>
                <td>${item.sku}</td>
                <td>${item.current}</td>
                <td>${item.min}</td>
                <td><button class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Reorder</button></td>
            </tr>
        `).join('');
    }
}

// Load activity feed
function loadActivityFeed() {
    const activities = [
        { type: 'order', title: 'New Order Received', description: 'Order ORD-006 from Alice Cooper', time: '2 minutes ago' },
        { type: 'inventory', title: 'Low Stock Alert', description: 'Gaming Keyboard stock below minimum', time: '15 minutes ago' },
        { type: 'customer', title: 'New Customer Registration', description: 'Robert Taylor joined the platform', time: '1 hour ago' },
        { type: 'system', title: 'System Update', description: 'Dashboard updated to version 2.1.0', time: '2 hours ago' },
        { type: 'order', title: 'Order Shipped', description: 'Order ORD-003 has been shipped', time: '3 hours ago' }
    ];
    
    const feed = document.getElementById('activityFeed');
    if (feed) {
        feed.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
}

// Get activity icon based on type
function getActivityIcon(type) {
    const icons = {
        order: 'shopping-cart',
        inventory: 'box',
        customer: 'user',
        system: 'cog'
    };
    return icons[type] || 'info';
}

// Generate date labels for charts
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

// Generate revenue data
function generateRevenueData(days) {
    const data = [];
    let baseRevenue = 3000;
    
    for (let i = 0; i < days; i++) {
        const variation = (Math.random() - 0.5) * 1000;
        const trend = Math.sin(i / days * Math.PI) * 500;
        const revenue = Math.max(0, baseRevenue + variation + trend);
        data.push(Math.round(revenue));
    }
    
    return data;
}

// Update revenue chart based on period
function updateRevenueChart(period) {
    if (!window.revenueChart) return;
    
    let days;
    switch (period) {
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

// Search functionality
function performSearch(query) {
    if (query.length < 2) return;
    
    // Simulate search - in a real app, this would make an API call
    console.log('Searching for:', query);
    
    // You could implement actual search logic here
    // For now, we'll just log the search term
}

// Show notifications
function showNotifications() {
    // In a real app, this would show a dropdown with notifications
    alert('Notifications:\n• New order received\n• Low stock alert\n• System maintenance scheduled');
}

// Setup real-time updates simulation
function setupRealTimeUpdates() {
    // Simulate real-time data updates every 30 seconds
    setInterval(() => {
        updateStats();
        addRandomActivity();
    }, 30000);
}

// Update stats with random variations
function updateStats() {
    const statCards = document.querySelectorAll('.stat-card h3');
    
    statCards.forEach(card => {
        const currentValue = card.textContent;
        const isCurrency = currentValue.includes('$');
        const isNumber = !isNaN(parseInt(currentValue.replace(/[$,]/g, '')));
        
        if (isNumber) {
            const value = parseInt(currentValue.replace(/[$,]/g, ''));
            const variation = Math.floor((Math.random() - 0.5) * value * 0.05); // ±5% variation
            const newValue = Math.max(0, value + variation);
            
            if (isCurrency) {
                card.textContent = '$' + newValue.toLocaleString();
            } else {
                card.textContent = newValue.toLocaleString();
            }
        }
    });
}

// Add random activity to feed
function addRandomActivity() {
    const activities = [
        { type: 'order', title: 'New Order Received', description: 'Order ORD-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0') + ' from Customer', time: 'Just now' },
        { type: 'inventory', title: 'Stock Updated', description: 'Inventory levels updated for multiple products', time: 'Just now' },
        { type: 'customer', title: 'Customer Activity', description: 'Customer profile updated', time: 'Just now' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const feed = document.getElementById('activityFeed');
    
    if (feed) {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
            <div class="activity-icon ${randomActivity.type}">
                <i class="fas fa-${getActivityIcon(randomActivity.type)}"></i>
            </div>
            <div class="activity-content">
                <h4>${randomActivity.title}</h4>
                <p>${randomActivity.description}</p>
                <div class="activity-time">${randomActivity.time}</div>
            </div>
        `;
        
        feed.insertBefore(activityElement, feed.firstChild);
        
        // Remove oldest activity if more than 10
        const activities = feed.querySelectorAll('.activity-item');
        if (activities.length > 10) {
            feed.removeChild(activities[activities.length - 1]);
        }
    }
}

// Load dashboard data (placeholder for API calls)
function loadDashboardData() {
    // Simulate loading delay
    setTimeout(() => {
        console.log('Dashboard data loaded');
        
        // Update loading states
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => el.remove());
        
    }, 1000);
}

// Utility function to format numbers
function formatNumber(num) {
    return num.toLocaleString();
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export functions for potential external use
window.ERP_Dashboard = {
    updateRevenueChart,
    performSearch,
    showNotifications,
    loadDashboardData
};