const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const THEME_KEY = 'erp_theme';

function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem(THEME_KEY, mode);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    setTheme(saved);
  } else {
    setTheme(prefersDark ? 'dark' : 'dark');
  }
}

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const collapseBtn = document.getElementById('collapseSidebar');
  const openBtn = document.getElementById('openSidebar');

  collapseBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('is-collapsed');
  });
  openBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('is-open');
  });
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildSalesData(days) {
  const labels = [];
  const data = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth()+1}/${d.getDate()}`);
    data.push(rand(12000, 24000));
  }
  return { labels, data };
}

let salesChart;
function initSalesChart(days = 30) {
  const ctx = document.getElementById('salesChart');
  const { labels, data } = buildSalesData(days);
  if (salesChart) salesChart.destroy();
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#6aa6ff',
        backgroundColor: 'rgba(106,166,255,0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#aab2c5' } },
        y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#aab2c5' } }
      },
      plugins: {
        legend: { labels: { color: '#e6e9f0' } },
        tooltip: { callbacks: { label: ctx => `$${ctx.parsed.y.toLocaleString()}` } }
      }
    }
  });
}

const MOCK_ORDERS = Array.from({ length: 8 }).map((_, i) => ({
  id: 10234 + i,
  customer: ['Acme Co', 'Globex', 'Umbrella', 'Initech', 'Stark', 'Wayne', 'Wonka', 'Soylent'][i % 8],
  status: ['Open', 'Packing', 'Shipped'][i % 3],
  total: rand(120, 4200),
  eta: `${rand(1, 5)}d`
}));

function renderOrders(rows) {
  const root = document.getElementById('ordersTable');
  root.innerHTML = '';
  rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'table__row';
    row.innerHTML = `
      <div class="table__cell">#${r.id}</div>
      <div class="table__cell">${r.customer}</div>
      <div class="table__cell"><span class="status ${r.status === 'Open' ? 'is-open' : r.status === 'Packing' ? 'is-packing' : 'is-shipped'}">${r.status}</span></div>
      <div class="table__cell">$${r.total.toLocaleString()}</div>
      <div class="table__cell">${r.eta}</div>
    `;
    root.appendChild(row);
  });
}

function renderCustomers() {
  const root = document.getElementById('topCustomers');
  const customers = [
    { name: 'Acme Co', spend: 142000, orders: 129 },
    { name: 'Globex', spend: 121400, orders: 98 },
    { name: 'Initech', spend: 110230, orders: 112 },
    { name: 'Umbrella', spend: 103880, orders: 101 }
  ];
  root.innerHTML = '';
  customers.forEach(c => {
    const item = document.createElement('div');
    item.className = 'list__item';
    item.innerHTML = `
      <div>
        <div>${c.name}</div>
        <div class="list__meta">${c.orders} orders</div>
      </div>
      <div>$${c.spend.toLocaleString()}</div>
    `;
    root.appendChild(item);
  });
}

function initInteractions() {
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  });

  const salesRange = document.getElementById('salesRange');
  salesRange?.addEventListener('change', (e) => {
    const days = parseInt(e.target.value, 10);
    initSalesChart(days);
  });

  document.getElementById('refreshOrders')?.addEventListener('click', () => {
    const shuffled = [...MOCK_ORDERS].sort(() => Math.random() - 0.5);
    renderOrders(shuffled);
  });
}

function init() {
  initTheme();
  initSidebar();
  initSalesChart(30);
  renderOrders(MOCK_ORDERS);
  renderCustomers();
  initInteractions();
}

document.addEventListener('DOMContentLoaded', init);
