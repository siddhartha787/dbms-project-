// ============================================================
// RailConnect - Admin Panel JavaScript
// ============================================================

const API = '/api';
let adminToken = localStorage.getItem('rc_admin_token') || localStorage.getItem('rc_token');
let adminUser = null;
let currentAdminPage = 'dashboard';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
});

// Authentication check
async function checkAdminAuth() {
    if (!adminToken) {
        showLoginGate();
        return;
    }
    try {
        const res = await fetch(`${API}/auth/me`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (data.success && data.user.role === 'admin') {
            adminUser = data.user;
            setupAdminView();
            showAdminPage('dashboard');
        } else {
            // Not an admin or invalid token
            showLoginGate();
        }
    } catch (err) {
        console.error('Auth error:', err);
        showLoginGate();
    }
}

function showLoginGate() {
    document.getElementById('adminSidebar').style.display = 'none';
    document.getElementById('adminLoginGate').classList.remove('hidden');
    document.querySelectorAll('.admin-page:not(#adminLoginGate)').forEach(p => p.classList.add('hidden'));
}

function setupAdminView() {
    document.getElementById('adminSidebar').style.display = 'flex';
    document.getElementById('adminLoginGate').classList.add('hidden');
    
    // Set user info
    const initial = adminUser.full_name ? adminUser.full_name.charAt(0).toUpperCase() : 'A';
    document.getElementById('adminAvatar').textContent = initial;
    document.getElementById('topbarAvatar').textContent = initial;
    document.getElementById('adminName').textContent = adminUser.full_name;
    document.getElementById('topbarAdminName').textContent = adminUser.full_name;
}

// Admin login form handler
async function adminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const errEl = document.getElementById('adminLoginErr');
    errEl.classList.add('hidden');

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            if (data.user.role !== 'admin') {
                errEl.textContent = 'Access denied: Administrator privileges required.';
                errEl.classList.remove('hidden');
                return;
            }
            adminToken = data.token;
            adminUser = data.user;
            localStorage.setItem('rc_admin_token', adminToken);
            localStorage.setItem('rc_token', adminToken);
            localStorage.setItem('rc_user', JSON.stringify(adminUser));
            setupAdminView();
            showAdminPage('dashboard');
            showToast('Welcome to Admin Portal, ' + adminUser.full_name, 'success');
        } else {
            errEl.textContent = data.message || 'Login failed';
            errEl.classList.remove('hidden');
        }
    } catch (err) {
        errEl.textContent = 'Server connection error';
        errEl.classList.remove('hidden');
    }
}

function adminLogout() {
    localStorage.removeItem('rc_admin_token');
    adminToken = null;
    adminUser = null;
    showToast('Logged out successfully', 'info');
    showLoginGate();
}

function toggleAdminSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('active');
}

// Navigation
function showAdminPage(pageId) {
    currentAdminPage = pageId;
    document.querySelectorAll('.admin-page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });

    const target = document.getElementById(`admin-page-${pageId}`);
    if (target) {
        target.classList.remove('hidden');
    }

    const titleEl = document.getElementById('adminPageTitle');
    titleEl.textContent = pageId.charAt(0).toUpperCase() + pageId.slice(1);

    // Load data for the active page
    switch (pageId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'bookings':
            loadAdminBookings();
            break;
        case 'trains':
            loadAdminTrains();
            break;
        case 'stations':
            loadAdminStations();
            break;
        case 'users':
            loadAdminUsers();
            break;
        case 'cancellations':
            loadAdminCancellations();
            break;
        case 'logs':
            loadAdminLogs();
            break;
    }
}

// API Helper with Admin Token
async function fetchAdmin(endpoint, options = {}) {
    options.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        ...options.headers
    };
    const res = await fetch(`${API}${endpoint}`, options);
    if (res.status === 401 || res.status === 403) {
        showToast('Session expired or unauthorized', 'error');
        showLoginGate();
        throw new Error('Unauthorized');
    }
    return res.json();
}

// ============================================================
// DASHBOARD
// ============================================================
async function loadDashboard() {
    try {
        const data = await fetchAdmin('/admin/stats');
        if (!data.success) return;

        const s = data.stats;
        const grid = document.getElementById('adminStatsGrid');
        grid.innerHTML = `
            <div class="stat-card-admin">
                <div class="stat-icon-wrapper" style="background:rgba(59,130,246,0.15);color:#3b82f6;">🎫</div>
                <div class="stat-meta">
                    <span class="stat-title">Total Bookings</span>
                    <span class="stat-val">${Number(s.total_bookings).toLocaleString()}</span>
                    <span class="stat-sub">${s.confirmed} confirmed</span>
                </div>
            </div>
            <div class="stat-card-admin">
                <div class="stat-icon-wrapper" style="background:rgba(16,185,129,0.15);color:#10b981;">💰</div>
                <div class="stat-meta">
                    <span class="stat-title">Total Revenue</span>
                    <span class="stat-val">₹${Number(s.total_revenue).toLocaleString()}</span>
                    <span class="stat-sub">Refunds: ₹${Number(s.refunds_issued).toLocaleString()}</span>
                </div>
            </div>
            <div class="stat-card-admin">
                <div class="stat-icon-wrapper" style="background:rgba(245,158,11,0.15);color:#f59e0b;">🚂</div>
                <div class="stat-meta">
                    <span class="stat-title">Active Trains</span>
                    <span class="stat-val">${s.total_trains}</span>
                    <span class="stat-sub">${s.total_stations} Stations</span>
                </div>
            </div>
            <div class="stat-card-admin">
                <div class="stat-icon-wrapper" style="background:rgba(168,85,247,0.15);color:#a885f7;">👥</div>
                <div class="stat-meta">
                    <span class="stat-title">Registered Passengers</span>
                    <span class="stat-val">${Number(s.total_users).toLocaleString()}</span>
                    <span class="stat-sub">${s.waitlisted} waitlisted</span>
                </div>
            </div>
        `;

        // Monthly Revenue Visualization
        const revContainer = document.getElementById('revenueChart');
        if (data.monthly_revenue && data.monthly_revenue.length > 0) {
            const maxRev = Math.max(...data.monthly_revenue.map(m => Number(m.revenue) || 1));
            revContainer.innerHTML = `
                <div style="display:flex;align-items:flex-end;gap:16px;height:180px;padding:20px 0;">
                    ${data.monthly_revenue.map(m => {
                        const heightPct = Math.max(15, Math.round((Number(m.revenue) / maxRev) * 100));
                        return `
                            <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:8px;">
                                <span style="font-size:0.75rem;color:var(--text-muted);">₹${Math.round(m.revenue)}</span>
                                <div style="width:100%;background:linear-gradient(180deg,#3b82f6,#1d4ed8);border-radius:6px;height:${heightPct}%;transition:height 0.4s ease;"></div>
                                <span style="font-size:0.8rem;color:var(--text-secondary);">${m.month}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else {
            revContainer.innerHTML = `<p style="color:var(--text-muted);padding:24px;text-align:center;">No revenue history yet</p>`;
        }

        // Top Trains Visualization
        const trainsContainer = document.getElementById('topTrainsChart');
        if (data.top_trains && data.top_trains.length > 0) {
            trainsContainer.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:12px;padding:12px 0;">
                    ${data.top_trains.map(t => `
                        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.05);">
                            <div>
                                <strong style="color:var(--text-primary);font-size:0.95rem;">${t.train_name}</strong>
                                <span style="color:var(--text-muted);font-size:0.8rem;margin-left:6px;">(#${t.train_number})</span>
                            </div>
                            <div style="text-align:right;">
                                <div style="color:var(--accent);font-weight:600;font-size:0.9rem;">${t.booking_count} bookings</div>
                                <div style="color:var(--text-muted);font-size:0.75rem;">₹${Number(t.revenue).toLocaleString()}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            trainsContainer.innerHTML = `<p style="color:var(--text-muted);padding:24px;text-align:center;">No booking records found</p>`;
        }

    } catch (err) {
        console.error('Error loading dashboard stats:', err);
    }
}

// ============================================================
// BOOKINGS MANAGEMENT
// ============================================================
let bookingPage = 1;

async function loadAdminBookings() {
    const search = document.getElementById('bookingSearch').value.trim();
    const status = document.getElementById('bookingStatusFilter').value;
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;"><div class="spinner" style="margin:0 auto;"></div></td></tr>`;

    try {
        const query = new URLSearchParams({
            page: bookingPage,
            limit: 15,
            search,
            status
        });
        const data = await fetchAdmin(`/admin/bookings?${query.toString()}`);
        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--danger);padding:20px;">Failed to load bookings</td></tr>`;
            return;
        }

        if (data.bookings.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:30px;">No bookings found matching filter criteria</td></tr>`;
            return;
        }

        tbody.innerHTML = data.bookings.map(b => {
            const statusClass = b.status.toLowerCase();
            const dateStr = new Date(b.journey_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            return `
                <tr>
                    <td><strong style="color:var(--accent);letter-spacing:1px;">${b.pnr_number}</strong></td>
                    <td>
                        <div style="font-weight:600;">${b.user_name || 'Passenger'}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted);">${b.user_phone || ''}</div>
                    </td>
                    <td>
                        <div>${b.train_name}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted);">#${b.train_number} • ${b.class_code}</div>
                    </td>
                    <td>
                        <span style="font-size:0.85rem;">${b.source_name} → ${b.dest_name}</span>
                    </td>
                    <td>${dateStr}</td>
                    <td><strong style="color:var(--success);">₹${b.total_fare}</strong></td>
                    <td><span class="status-badge badge-${statusClass}">${b.status}</span></td>
                    <td>
                        <div style="display:flex;gap:6px;">
                            ${b.status !== 'Cancelled' ? `
                                <button class="btn btn-sm btn-danger" onclick="adminCancelBooking('${b.booking_id}', '${b.pnr_number}')" title="Cancel Booking">Cancel</button>
                            ` : `<span style="font-size:0.8rem;color:var(--text-muted);">Cancelled</span>`}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Pagination
        renderPagination('bookingsPagination', data.pagination, (p) => {
            bookingPage = p;
            loadAdminBookings();
        });

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--danger);padding:20px;">Error loading bookings</td></tr>`;
    }
}

async function adminCancelBooking(bookingId, pnr) {
    if (!confirm(`Are you sure you want to cancel booking with PNR: ${pnr}?`)) return;
    try {
        const res = await fetchAdmin(`/bookings/cancel/${bookingId}`, {
            method: 'POST',
            body: JSON.stringify({ reason: 'Cancelled by Administrator' })
        });
        if (res.success) {
            showToast(`PNR ${pnr} cancelled successfully. Refund: ₹${res.refund_amount}`, 'success');
            loadAdminBookings();
        } else {
            showToast(res.message || 'Failed to cancel', 'error');
        }
    } catch (err) {
        showToast('Error cancelling booking', 'error');
    }
}

// ============================================================
// TRAINS MANAGEMENT
// ============================================================
async function loadAdminTrains() {
    const search = document.getElementById('adminTrainSearch')?.value.trim() || '';
    const tbody = document.getElementById('trainsTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;"><div class="spinner" style="margin:0 auto;"></div></td></tr>`;

    try {
        const res = await fetch(`${API}/trains/all`);
        const data = await res.json();
        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--danger);padding:20px;">Failed to load trains</td></tr>`;
            return;
        }

        let trains = data.trains || [];
        if (search) {
            trains = trains.filter(t => 
                t.train_name.toLowerCase().includes(search.toLowerCase()) || 
                t.train_number.includes(search)
            );
        }

        if (trains.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:30px;">No trains found</td></tr>`;
            return;
        }

        tbody.innerHTML = trains.map(t => `
            <tr>
                <td><strong style="color:var(--accent);">${t.train_number}</strong></td>
                <td><strong>${t.train_name}</strong></td>
                <td><span class="badge" style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);padding:2px 8px;border-radius:4px;font-size:0.75rem;">${t.train_type}</span></td>
                <td>${t.total_seats} seats</td>
                <td><span class="status-badge badge-${t.status === 'Active' ? 'confirmed' : 'cancelled'}">${t.status}</span></td>
                <td>
                    <div style="display:flex;gap:6px;">
                        <button class="btn btn-sm btn-secondary" onclick="editTrain(${JSON.stringify(t).replace(/"/g, '&quot;')})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTrain(${t.train_id}, '${t.train_name}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--danger);padding:20px;">Error loading trains</td></tr>`;
    }
}

function openTrainModal(train = null) {
    const isEdit = !!train;
    const content = document.getElementById('adminModalContent');
    content.innerHTML = `
        <h3 style="margin-bottom:20px;">${isEdit ? 'Edit Train' : 'Add New Train'}</h3>
        <form onsubmit="saveTrain(event, ${isEdit ? train.train_id : 'null'})">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
                <div class="form-group">
                    <label>Train Number</label>
                    <input type="text" id="mTrainNumber" class="form-input" required value="${train?.train_number || ''}">
                </div>
                <div class="form-group">
                    <label>Train Name</label>
                    <input type="text" id="mTrainName" class="form-input" required value="${train?.train_name || ''}">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
                <div class="form-group">
                    <label>Type</label>
                    <select id="mTrainType" class="form-input">
                        ${['Express','Superfast','Rajdhani','Shatabdi','Duronto','Garib Rath','Jan Shatabdi','Local'].map(tp => 
                            `<option value="${tp}" ${train?.train_type === tp ? 'selected' : ''}>${tp}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="mTrainStatus" class="form-input">
                        ${['Active','Inactive','Under Maintenance'].map(st => 
                            `<option value="${st}" ${train?.status === st ? 'selected' : ''}>${st}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="form-group" style="margin-bottom:24px;">
                <label>Total Capacity (Seats)</label>
                <input type="number" id="mTrainSeats" class="form-input" required value="${train?.total_seats || 500}">
            </div>
            <div style="display:flex;justify-content:flex-end;gap:12px;">
                <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update Train' : 'Create Train'}</button>
            </div>
        </form>
    `;
    document.getElementById('adminModalOverlay').classList.remove('hidden');
}

function editTrain(train) {
    openTrainModal(train);
}

async function saveTrain(e, trainId) {
    e.preventDefault();
    const payload = {
        train_number: document.getElementById('mTrainNumber').value.trim(),
        train_name: document.getElementById('mTrainName').value.trim(),
        train_type: document.getElementById('mTrainType').value,
        total_seats: parseInt(document.getElementById('mTrainSeats').value) || 0,
        status: document.getElementById('mTrainStatus').value
    };

    try {
        const url = trainId ? `/admin/trains/${trainId}` : '/admin/trains';
        const method = trainId ? 'PUT' : 'POST';
        const res = await fetchAdmin(url, { method, body: JSON.stringify(payload) });

        if (res.success) {
            showToast(trainId ? 'Train updated successfully' : 'Train created successfully', 'success');
            closeAdminModal();
            loadAdminTrains();
        } else {
            showToast(res.message || 'Operation failed', 'error');
        }
    } catch (err) {
        showToast('Error saving train', 'error');
    }
}

async function deleteTrain(id, name) {
    if (!confirm(`Are you sure you want to delete train "${name}"? This action cannot be undone.`)) return;
    try {
        const res = await fetchAdmin(`/admin/trains/${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Train deleted', 'success');
            loadAdminTrains();
        } else {
            showToast(res.message || 'Failed to delete train', 'error');
        }
    } catch (err) {
        showToast('Error deleting train', 'error');
    }
}

// ============================================================
// STATIONS MANAGEMENT
// ============================================================
async function loadAdminStations() {
    const tbody = document.getElementById('stationsTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;"><div class="spinner" style="margin:0 auto;"></div></td></tr>`;

    try {
        const res = await fetch(`${API}/trains/stations`);
        const data = await res.json();
        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--danger);padding:20px;">Failed to load stations</td></tr>`;
            return;
        }

        tbody.innerHTML = data.stations.map(s => `
            <tr>
                <td><strong style="color:var(--accent);font-family:monospace;font-size:1rem;">${s.station_code}</strong></td>
                <td><strong>${s.station_name}</strong></td>
                <td>${s.city}</td>
                <td>${s.state}</td>
                <td><span class="badge" style="background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:4px;">${s.zone || 'IR'}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="openStationModal(${JSON.stringify(s).replace(/"/g, '&quot;')})">Edit</button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--danger);padding:20px;">Error loading stations</td></tr>`;
    }
}

function openStationModal(station = null) {
    const isEdit = !!station;
    const content = document.getElementById('adminModalContent');
    content.innerHTML = `
        <h3 style="margin-bottom:20px;">${isEdit ? 'Edit Station' : 'Add Station'}</h3>
        <form onsubmit="saveStation(event, ${isEdit ? station.station_id : 'null'})">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
                <div class="form-group">
                    <label>Station Code</label>
                    <input type="text" id="mStatCode" class="form-input" required maxlength="10" value="${station?.station_code || ''}" style="text-transform:uppercase;">
                </div>
                <div class="form-group">
                    <label>Station Name</label>
                    <input type="text" id="mStatName" class="form-input" required value="${station?.station_name || ''}">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
                <div class="form-group">
                    <label>City</label>
                    <input type="text" id="mStatCity" class="form-input" required value="${station?.city || ''}">
                </div>
                <div class="form-group">
                    <label>State</label>
                    <input type="text" id="mStatState" class="form-input" required value="${station?.state || ''}">
                </div>
            </div>
            <div class="form-group" style="margin-bottom:24px;">
                <label>Railway Zone</label>
                <input type="text" id="mStatZone" class="form-input" placeholder="e.g. Northern Railway (NR)" value="${station?.zone || ''}">
            </div>
            <div style="display:flex;justify-content:flex-end;gap:12px;">
                <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update Station' : 'Add Station'}</button>
            </div>
        </form>
    `;
    document.getElementById('adminModalOverlay').classList.remove('hidden');
}

async function saveStation(e, stationId) {
    e.preventDefault();
    const payload = {
        station_code: document.getElementById('mStatCode').value.trim().toUpperCase(),
        station_name: document.getElementById('mStatName').value.trim(),
        city: document.getElementById('mStatCity').value.trim(),
        state: document.getElementById('mStatState').value.trim(),
        zone: document.getElementById('mStatZone').value.trim()
    };

    try {
        const url = stationId ? `/admin/stations/${stationId}` : '/admin/stations';
        const method = stationId ? 'PUT' : 'POST';
        const res = await fetchAdmin(url, { method, body: JSON.stringify(payload) });

        if (res.success) {
            showToast(stationId ? 'Station updated' : 'Station added', 'success');
            closeAdminModal();
            loadAdminStations();
        } else {
            showToast(res.message || 'Operation failed', 'error');
        }
    } catch (err) {
        showToast('Error saving station', 'error');
    }
}

// ============================================================
// USERS MANAGEMENT
// ============================================================
async function loadAdminUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;"><div class="spinner" style="margin:0 auto;"></div></td></tr>`;

    try {
        const data = await fetchAdmin('/admin/users');
        if (!data.success || !data.users) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--danger);padding:20px;">Failed to load users</td></tr>`;
            return;
        }

        tbody.innerHTML = data.users.map(u => {
            const joinedDate = new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            return `
                <tr>
                    <td><strong>${u.full_name}</strong></td>
                    <td style="color:var(--text-secondary);">${u.email}</td>
                    <td>${u.phone || 'N/A'}</td>
                    <td><span class="badge" style="background:${u.role === 'admin' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.15)'};color:${u.role === 'admin' ? '#f87171' : '#60a5fa'};padding:2px 8px;border-radius:4px;">${u.role}</span></td>
                    <td>${u.booking_count || 0}</td>
                    <td><strong style="color:var(--success);">₹${Number(u.total_spent || 0).toLocaleString()}</strong></td>
                    <td style="font-size:0.85rem;color:var(--text-muted);">${joinedDate}</td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--danger);padding:20px;">Error loading users</td></tr>`;
    }
}

// ============================================================
// CANCELLATIONS & AUDIT LOGS
// ============================================================
async function loadAdminCancellations() {
    const tbody = document.getElementById('cancellationsTableBody');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;"><div class="spinner" style="margin:0 auto;"></div></td></tr>`;

    try {
        const data = await fetchAdmin('/admin/cancellations');
        if (!data.success || !data.cancellations) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--danger);padding:20px;">Failed to load cancellations</td></tr>`;
            return;
        }

        if (data.cancellations.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:30px;">No cancellations recorded</td></tr>`;
            return;
        }

        tbody.innerHTML = data.cancellations.map(c => {
            const dateStr = new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            return `
                <tr>
                    <td><strong style="color:var(--accent);">${c.pnr_number}</strong></td>
                    <td>${c.train_name} (#${c.train_number})</td>
                    <td>${c.cancelled_by_name}</td>
                    <td><strong style="color:var(--success);">₹${c.refund_amount}</strong></td>
                    <td><span style="color:var(--danger);">₹${c.cancellation_charge}</span></td>
                    <td><span class="status-badge badge-confirmed">${c.refund_status}</span></td>
                    <td style="font-size:0.85rem;color:var(--text-muted);">${dateStr}</td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--danger);padding:20px;">Error loading cancellations</td></tr>`;
    }
}

async function loadAdminLogs() {
    const tbody = document.getElementById('logsTableBody');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;"><div class="spinner" style="margin:0 auto;"></div></td></tr>`;

    try {
        const data = await fetchAdmin('/admin/logs');
        if (!data.success || !data.logs) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--danger);padding:20px;">Failed to load audit logs</td></tr>`;
            return;
        }

        if (data.logs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:30px;">No logs found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.logs.map(l => {
            const timeStr = new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            return `
                <tr>
                    <td><strong>${l.admin_name}</strong></td>
                    <td><span style="color:var(--accent);font-weight:500;">${l.action}</span></td>
                    <td><code style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;">${l.table_name || '-'}</code></td>
                    <td>${l.record_id || '-'}</td>
                    <td style="font-size:0.85rem;color:var(--text-muted);">${timeStr}</td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--danger);padding:20px;">Error loading audit logs</td></tr>`;
    }
}

// Modal helper
function closeAdminModal() {
    document.getElementById('adminModalOverlay').classList.add('hidden');
}

// Toast notification
function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast toast-${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

// Pagination helper
function renderPagination(containerId, pagination, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container || !pagination || pagination.totalPages <= 1) {
        if (container) container.innerHTML = '';
        return;
    }
    const { currentPage, totalPages } = pagination;
    let html = '';
    if (currentPage > 1) {
        html += `<button class="page-btn" onclick="(${onPageChange})(${currentPage - 1})">Prev</button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="(${onPageChange})(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span style="color:var(--text-muted);padding:0 4px;">...</span>`;
        }
    }
    if (currentPage < totalPages) {
        html += `<button class="page-btn" onclick="(${onPageChange})(${currentPage + 1})">Next</button>`;
    }
    container.innerHTML = html;
}
