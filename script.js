// ERP Dashboard JavaScript

// Global variables
let salesChart, categoryChart;
let currentTimeframe = '7D';

// DOM Elements
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');
const ordersTableBody = document.getElementById('ordersTableBody');
const productsTableBody = document.getElementById('productsTableBody');
const activityFeed = document.getElementById('activityFeed');

// Sample data
const sampleData = {
    orders: [
        { id: '#ORD-001', customer: 'Alice Johnson', amount: '$1,234.56', status: 'completed', date: '2024-10-07' },
        { id: '#ORD-002', customer: 'Bob Smith', amount: '$987.65', status: 'processing', date: '2024-10-07' },
        { id: '#ORD-003', customer: 'Carol Davis', amount: '$2,345.67', status: 'pending', date: '2024-10-06' },
        { id: '#ORD-004', customer: 'David Wilson', amount: '$567.89', status: 'completed', date: '2024-10-06' },
        { id: '#ORD-005', customer: 'Eva Brown', amount: '$1,876.54', status: 'processing', date: '2024-10-05' }
    ],
    products: [
        { name: 'Wireless Headphones', sales: 1234, revenue: '$45,678', stock: 89 },
        { name: 'Smartphone Case', sales: 987, revenue: '$23,456', stock: 156 },
        { name: 'Bluetooth Speaker', sales: 756, revenue: '$34,567', stock: 67 },
        { name: 'USB Cable', sales: 654, revenue: '$12,345', stock: 234 },
        { name: 'Power Bank', sales: 543, revenue: '$28,901', stock: 45 }
    ],
    activities: [
        { type: 'sale', title: 'New sale completed', description: 'Order #ORD-001 for $1,234.56', time: '2 minutes ago' },
        { type: 'user', title: 'New customer registered', description: 'Alice Johnson joined the platform', time: '15 minutes ago' },
        { type: 'order', title: 'Order status updated', description: 'Order #ORD-002 is now processing', time: '32 minutes ago' },
        { type: 'inventory', title: 'Low stock alert', description: 'Power Bank stock is running low (45 units)', time: '1 hour ago' },
        { type: 'sale', title: 'Bulk order received', description: 'Corporate order for $5,678.90', time: '2 hours ago' },
        { type: 'user', title: 'Customer support ticket', description: 'New ticket from Bob Smith', time: '3 hours ago' }
    ],
    salesData: {
        '7D': {
            labels: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7'],
            data: [12000, 15000, 18000, 14000, 22000, 19000, 25000]
        },
        '30D': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [85000, 92000, 78000, 105000]
        },
        '90D': {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            data: [280000, 320000, 295000]
        }
    },
    categoryData: {
        labels: ['Electronics', 'Accessories', 'Audio', 'Mobile', 'Computing'],
        data: [35, 25, 20, 15, 5],
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    }
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeCharts();
    populateTables();
    populateActivityFeed();
    initializeTimeframeButtons();
    animateMetrics();
    
    // Simulate real-time updates
    setInterval(updateMetrics, 30000); // Update every 30 seconds
    setInterval(addNewActivity, 60000); // Add new activity every minute
});

// Sidebar functionality
function initializeSidebar() {
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Store sidebar state in localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
    
    // Restore sidebar state from localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Handle responsive sidebar
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else if (!localStorage.getItem('sidebarCollapsed')) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial load
}

// Initialize charts
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: sampleData.salesData[currentTimeframe].labels,
            datasets: [{
                label: 'Sales',
                data: sampleData.salesData[currentTimeframe].data,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
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
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    
    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: sampleData.categoryData.labels,
            datasets: [{
                data: sampleData.categoryData.data,
                backgroundColor: sampleData.categoryData.colors,
                borderWidth: 0,
                cutout: '60%'
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
                        usePointStyle: true,
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

// Populate tables
function populateTables() {
    // Populate orders table
    ordersTableBody.innerHTML = '';
    sampleData.orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td><strong>${order.amount}</strong></td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${formatDate(order.date)}</td>
        `;
        ordersTableBody.appendChild(row);
    });
    
    // Populate products table
    productsTableBody.innerHTML = '';
    sampleData.products.forEach(product => {
        const row = document.createElement('tr');
        const stockClass = product.stock < 50 ? 'style="color: #ef4444; font-weight: 600;"' : '';
        row.innerHTML = `
            <td><strong>${product.name}</strong></td>
            <td>${product.sales.toLocaleString()}</td>
            <td><strong>${product.revenue}</strong></td>
            <td ${stockClass}>${product.stock}</td>
        `;
        productsTableBody.appendChild(row);
    });
}

// Populate activity feed
function populateActivityFeed() {
    activityFeed.innerHTML = '';
    sampleData.activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        activityFeed.appendChild(activityItem);
    });
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        sale: 'dollar-sign',
        order: 'shopping-bag',
        user: 'user',
        inventory: 'box'
    };
    return icons[type] || 'info-circle';
}

// Initialize timeframe buttons
function initializeTimeframeButtons() {
    const timeframeButtons = document.querySelectorAll('.chart-btn');
    
    timeframeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            timeframeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current timeframe
            currentTimeframe = this.textContent;
            
            // Update chart data
            updateSalesChart();
        });
    });
}

// Update sales chart
function updateSalesChart() {
    if (salesChart && sampleData.salesData[currentTimeframe]) {
        salesChart.data.labels = sampleData.salesData[currentTimeframe].labels;
        salesChart.data.datasets[0].data = sampleData.salesData[currentTimeframe].data;
        salesChart.update('active');
    }
}

// Animate metrics on page load
function animateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach(metric => {
        const finalValue = metric.textContent;
        const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
        const prefix = finalValue.replace(/[0-9.,]/g, '');
        
        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            const formattedValue = prefix + currentValue.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            
            metric.textContent = formattedValue;
        }, 30);
    });
}

// Update metrics with random data
function updateMetrics() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach(card => {
        const valueElement = card.querySelector('.metric-value');
        const changeElement = card.querySelector('.metric-change');
        
        if (valueElement && changeElement) {
            // Generate random change
            const randomChange = (Math.random() * 10 - 5).toFixed(1);
            const isPositive = randomChange > 0;
            
            // Update change indicator
            changeElement.className = `metric-change ${isPositive ? 'positive' : 'negative'}`;
            changeElement.innerHTML = `
                <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
                ${Math.abs(randomChange)}%
            `;
            
            // Add subtle animation
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

// Add new activity
function addNewActivity() {
    const newActivities = [
        { type: 'sale', title: 'New sale completed', description: `Order #ORD-${Math.floor(Math.random() * 1000)} for $${(Math.random() * 2000 + 500).toFixed(2)}`, time: 'Just now' },
        { type: 'user', title: 'New customer registered', description: 'A new customer joined the platform', time: 'Just now' },
        { type: 'order', title: 'Order status updated', description: `Order #ORD-${Math.floor(Math.random() * 1000)} status changed`, time: 'Just now' },
        { type: 'inventory', title: 'Stock updated', description: 'Inventory levels have been updated', time: 'Just now' }
    ];
    
    const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
    
    // Add to the beginning of activities array
    sampleData.activities.unshift(randomActivity);
    
    // Keep only the latest 10 activities
    if (sampleData.activities.length > 10) {
        sampleData.activities = sampleData.activities.slice(0, 10);
    }
    
    // Re-populate activity feed
    populateActivityFeed();
    
    // Add notification
    showNotification('New activity added!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #4f46e5;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

// Handle navigation clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.nav-link')) {
        e.preventDefault();
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked nav item
        e.target.closest('.nav-item').classList.add('active');
        
        // You can add page navigation logic here
        const navText = e.target.closest('.nav-link').querySelector('span').textContent;
        console.log(`Navigating to: ${navText}`);
    }
});

// Handle search functionality
document.querySelector('.search-box input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    console.log(`Searching for: ${searchTerm}`);
    
    // You can implement search functionality here
    // For now, we'll just log the search term
});

// Handle user profile dropdown (placeholder)
document.querySelector('.user-profile').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('User profile clicked - dropdown menu would appear here');
});

// Handle notification click (placeholder)
document.querySelector('.notification-icon').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Notifications clicked - notification panel would appear here');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Toggle sidebar with Ctrl/Cmd + B
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        sidebarToggle.click();
    }
    
    // Focus search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-box input').focus();
    }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    if (salesChart) {
        salesChart.resize();
    }
    if (categoryChart) {
        categoryChart.resize();
    }
});

// Export functions for potential external use
window.ERPDashboard = {
    updateMetrics,
    addNewActivity,
    showNotification,
    updateSalesChart
};