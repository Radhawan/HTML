// ERP Dashboard JavaScript

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');
const navItems = document.querySelectorAll('.nav-item a');
const contentSections = document.querySelectorAll('.content-section');
const searchInput = document.getElementById('searchInput');
const dateRange = document.getElementById('dateRange');

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    initializeInteractions();
    animateKPICards();
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // Navigation item clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.parentElement.classList.remove('active'));
            
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            const targetSection = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Close mobile menu
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('show', 'collapsed');
            mainContent.classList.remove('expanded');
        } else {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    });
}

// Chart Initialization
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Revenue',
                    data: [65000, 78000, 85000, 92000, 88000, 95000, 124580],
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
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'K';
                            },
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#4f46e5'
                    }
                }
            }
        });
    }

    // Category Chart (Doughnut)
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: [
                        '#4f46e5',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
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
                },
                cutout: '60%'
            }
        });
    }
}

// Interactive Features
function initializeInteractions() {
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        // Implement search logic here
        console.log('Searching for:', searchTerm);
    });

    // Date range change
    dateRange.addEventListener('change', function() {
        const selectedRange = this.value;
        updateDashboardData(selectedRange);
    });

    // Notification click
    const notifications = document.querySelector('.notifications');
    notifications.addEventListener('click', function() {
        showNotificationPanel();
    });

    // User profile click
    const userProfile = document.querySelector('.user-profile');
    userProfile.addEventListener('click', function() {
        showUserMenu();
    });

    // Chart action buttons
    const chartButtons = document.querySelectorAll('.btn-icon');
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').classList.contains('fa-download') ? 'download' : 'expand';
            handleChartAction(action, this.closest('.chart-container'));
        });
    });
}

// KPI Card Animation
function animateKPICards() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    kpiCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Update Dashboard Data
function updateDashboardData(range) {
    // Simulate data update based on date range
    const kpiData = {
        today: {
            revenue: '$12,450',
            orders: '124',
            customers: '8',
            inventory: '$89,420'
        },
        week: {
            revenue: '$124,580',
            orders: '1,247',
            customers: '89',
            inventory: '$89,420'
        },
        month: {
            revenue: '$485,230',
            orders: '4,892',
            customers: '342',
            inventory: '$89,420'
        },
        quarter: {
            revenue: '$1,245,680',
            orders: '12,847',
            customers: '1,089',
            inventory: '$89,420'
        }
    };

    const data = kpiData[range];
    if (data) {
        updateKPIValues(data);
    }
}

// Update KPI Values
function updateKPIValues(data) {
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues[0].textContent = data.revenue;
    kpiValues[1].textContent = data.orders;
    kpiValues[2].textContent = data.customers;
    kpiValues[3].textContent = data.inventory;

    // Animate the change
    kpiValues.forEach(value => {
        value.style.transform = 'scale(1.1)';
        setTimeout(() => {
            value.style.transform = 'scale(1)';
        }, 200);
    });
}

// Show Notification Panel
function showNotificationPanel() {
    // Create notification panel
    const existingPanel = document.querySelector('.notification-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    const panel = document.createElement('div');
    panel.className = 'notification-panel';
    panel.innerHTML = `
        <div class="notification-header">
            <h3>Notifications</h3>
            <button class="close-panel">&times;</button>
        </div>
        <div class="notification-list">
            <div class="notification-item unread">
                <div class="notification-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">Low Stock Alert</div>
                    <div class="notification-text">Product XYZ is running low on stock</div>
                    <div class="notification-time">2 hours ago</div>
                </div>
            </div>
            <div class="notification-item unread">
                <div class="notification-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">New Customer</div>
                    <div class="notification-text">Sarah Johnson has registered</div>
                    <div class="notification-time">4 hours ago</div>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">Sales Target Achieved</div>
                    <div class="notification-text">Monthly sales target reached</div>
                    <div class="notification-time">1 day ago</div>
                </div>
            </div>
        </div>
    `;

    // Add styles for notification panel
    const style = document.createElement('style');
    style.textContent = `
        .notification-panel {
            position: fixed;
            top: 70px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            overflow: hidden;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .notification-header h3 {
            margin: 0;
            color: #1e293b;
        }
        
        .close-panel {
            background: none;
            border: none;
            font-size: 20px;
            color: #64748b;
            cursor: pointer;
        }
        
        .notification-list {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .notification-item {
            display: flex;
            padding: 15px 20px;
            border-bottom: 1px solid #f1f5f9;
            transition: background-color 0.3s ease;
        }
        
        .notification-item:hover {
            background-color: #f8fafc;
        }
        
        .notification-item.unread {
            background-color: #fef3f2;
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: #64748b;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }
        
        .notification-text {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 4px;
        }
        
        .notification-time {
            font-size: 12px;
            color: #94a3b8;
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(panel);

    // Close panel functionality
    panel.querySelector('.close-panel').addEventListener('click', () => {
        panel.remove();
    });

    // Close panel when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target) && !document.querySelector('.notifications').contains(e.target)) {
                panel.remove();
                document.removeEventListener('click', closePanel);
            }
        });
    }, 100);
}

// Show User Menu
function showUserMenu() {
    // Create user menu
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-item">
            <i class="fas fa-user"></i>
            <span>Profile</span>
        </div>
        <div class="user-menu-item">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
        </div>
        <div class="user-menu-item">
            <i class="fas fa-question-circle"></i>
            <span>Help</span>
        </div>
        <div class="user-menu-divider"></div>
        <div class="user-menu-item">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
        </div>
    `;

    // Add styles for user menu
    const style = document.createElement('style');
    style.textContent = `
        .user-menu {
            position: fixed;
            top: 60px;
            right: 20px;
            width: 200px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            overflow: hidden;
            animation: slideIn 0.3s ease-out;
        }
        
        .user-menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: #64748b;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .user-menu-item:hover {
            background-color: #f8fafc;
            color: #1e293b;
        }
        
        .user-menu-divider {
            height: 1px;
            background: #f1f5f9;
            margin: 8px 0;
        }
    `;
    
    if (!document.querySelector('style[data-user-menu-styles]')) {
        style.setAttribute('data-user-menu-styles', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(menu);

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !document.querySelector('.user-profile').contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Handle Chart Actions
function handleChartAction(action, chartContainer) {
    if (action === 'download') {
        // Simulate chart download
        const chartTitle = chartContainer.querySelector('.chart-header h3').textContent;
        console.log(`Downloading ${chartTitle} chart...`);
        
        // Show download notification
        showToast(`${chartTitle} chart downloaded successfully!`, 'success');
    } else if (action === 'expand') {
        // Toggle chart expansion
        chartContainer.classList.toggle('expanded');
        
        // Update icon
        const expandBtn = chartContainer.querySelector('.fa-expand').parentElement;
        const icon = expandBtn.querySelector('i');
        if (chartContainer.classList.contains('expanded')) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1002;
            animation: toastSlideIn 0.3s ease-out;
        }
        
        .toast-success {
            background: #10b981;
        }
        
        .toast-error {
            background: #ef4444;
        }
        
        .toast-info {
            background: #3b82f6;
        }
        
        @keyframes toastSlideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes toastSlideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    
    if (!document.querySelector('style[data-toast-styles]')) {
        style.setAttribute('data-toast-styles', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-out';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// Real-time updates simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate random data updates
        const kpiCards = document.querySelectorAll('.kpi-value');
        if (kpiCards.length > 0 && Math.random() > 0.7) {
            const randomCard = kpiCards[Math.floor(Math.random() * kpiCards.length)];
            const currentValue = randomCard.textContent;
            
            // Add a subtle pulse animation
            randomCard.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                randomCard.style.animation = '';
            }, 500);
        }
    }, 10000); // Update every 10 seconds
}

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(pulseStyle);

// Start real-time updates
simulateRealTimeUpdates();