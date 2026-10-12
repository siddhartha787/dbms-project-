// ============================================================
// RailConnect - Railway Reservation System
// Main Frontend JavaScript
// ============================================================

const API = '/api';
let stations = [];
let allTrains = [];
let currentUser = null;
let currentToken = null;
let selectedTrainData = null;
let selectedClassData = null;
let passengerCount = 1;
let myBookings = [];

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(el => el.min = today);
    document.getElementById('homeDate').value = today;
    document.getElementById('searchDate').value = today;

    // Restore auth state
    const savedToken = localStorage.getItem('rr_token');
    const savedUser = localStorage.getItem('rr_user');
    if (savedToken && savedUser) {
        currentToken = savedToken;
        currentUser = JSON.parse(savedUser);
        updateNavForUser();
        loadNotificationCount();
    }

    // Load stations
    await loadStations();
    // Load trains for trains page
    await loadAllTrains();
    // Initialize 3D train parallax effect
    init3DTrainParallax();

    // Close dropdowns on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.station-select-wrap')) {
            document.querySelectorAll('.station-dropdown').forEach(d => d.classList.add('hidden'));
        }
        if (!e.target.closest('.user-menu') && !e.target.closest('.user-dropdown')) {
            const dd = document.getElementById('userDropdown');
            if (dd) dd.classList.add('hidden');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
    });
});

// ============================================================
// NAVIGATION
// ============================================================
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Page-specific init
    if (page === 'my-bookings') loadMyBookings();
    if (page === 'profile') loadProfile();
    if (page === 'notifications') loadNotifications();
    if (page === 'trains') renderTrainsList();

    // Close nav on mobile
    document.getElementById('navLinks').classList.remove('open');
}

function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('hidden');
}

// ============================================================
// AUTH
// ============================================================
function updateNavForUser() {
    if (currentUser) {
        document.getElementById('navAuth').classList.add('hidden');
        document.getElementById('navUser').classList.remove('hidden');
        document.getElementById('userName').textContent = currentUser.full_name.split(' ')[0];
        document.getElementById('userAvatar').textContent = currentUser.full_name.charAt(0).toUpperCase();
    } else {
        document.getElementById('navAuth').classList.remove('hidden');
        document.getElementById('navUser').classList.add('hidden');
    }
}

async function login(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const errEl = document.getElementById('loginError');
    errEl.classList.add('hidden');
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPassword').value })
        });
        const data = await res.json();
        if (data.success) {
            currentToken = data.token;
            currentUser = data.user;
            localStorage.setItem('rr_token', currentToken);
            localStorage.setItem('rr_user', JSON.stringify(currentUser));
            updateNavForUser();
            showToast('Welcome back, ' + currentUser.full_name.split(' ')[0] + '! 🎉', 'success');
            if (currentUser.role === 'admin') {
                window.location.href = '/admin.html';
            } else {
                const pending = sessionStorage.getItem('rr_pending_booking');
                if (pending) {
                    sessionStorage.removeItem('rr_pending_booking');
                    const b = JSON.parse(pending);
                    openBookingPage(b.train, b.cls, b.fromId, b.toId, b.date);
                } else {
                    showPage('home');
                }
            }
            loadNotificationCount();
        } else {
            errEl.textContent = data.message;
            errEl.classList.remove('hidden');
        }
    } catch (err) {
        errEl.textContent = 'Connection error. Please ensure the server is running.';
        errEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Login';
    }
}

async function register(e) {
    e.preventDefault();
    const errEl = document.getElementById('regError');
    errEl.classList.add('hidden');

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                password: document.getElementById('regPassword').value,
                gender: document.getElementById('regGender').value,
                dob: document.getElementById('regDob').value
            })
        });
        const data = await res.json();
        if (data.success) {
            showToast('Registration successful! Please login.', 'success');
            showPage('login');
            document.getElementById('loginEmail').value = document.getElementById('regEmail').value;
        } else {
            errEl.textContent = data.message;
            errEl.classList.remove('hidden');
        }
    } catch (err) {
        errEl.textContent = 'Connection error. Please ensure the server is running.';
        errEl.classList.remove('hidden');
    }
}

function logout() {
    currentToken = null;
    currentUser = null;
    localStorage.removeItem('rr_token');
    localStorage.removeItem('rr_user');
    updateNavForUser();
    showToast('Logged out successfully.', 'success');
    showPage('home');
}

function togglePassword(id) {
    const el = document.getElementById(id);
    el.type = el.type === 'password' ? 'text' : 'password';
}

// ============================================================
// STATIONS
// ============================================================
async function loadStations() {
    try {
        const res = await fetch(`${API}/trains/stations`);
        const data = await res.json();
        if (data.success) stations = data.stations;
    } catch (err) { console.error('Failed to load stations:', err); }
}

function filterStations(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const rawVal = input.value.trim();
    const query = rawVal.toLowerCase();

    // Instant Station Resolver: match code in parentheses or start of string or station code
    if (rawVal) {
        let matched = null;
        const codeInParen = rawVal.match(/\(([A-Z0-9]+)\)/i);
        if (codeInParen) {
            matched = stations.find(s => s.station_code.toUpperCase() === codeInParen[1].toUpperCase());
        }
        if (!matched) {
            matched = stations.find(s => s.station_code.toLowerCase() === query);
        }
        if (!matched) {
            matched = stations.find(s => s.station_name.toLowerCase() === query);
        }
        if (!matched) {
            matched = stations.find(s => s.station_name.toLowerCase().startsWith(query) || s.city.toLowerCase().startsWith(query));
        }
        if (matched) {
            input.dataset.stationId = matched.station_id;
        }
    }

    if (!query) {
        list.classList.remove('hidden');
        list.innerHTML = stations.slice(0, 10).map(s => stationOption(s, inputId, listId)).join('');
        if (!stations.length) list.classList.add('hidden');
        return;
    }

    const filtered = stations.filter(s =>
        s.station_name.toLowerCase().includes(query) ||
        s.city.toLowerCase().includes(query) ||
        s.station_code.toLowerCase().includes(query)
    ).slice(0, 12);

    if (filtered.length === 0) {
        list.classList.add('hidden');
        return;
    }

    list.classList.remove('hidden');
    list.innerHTML = filtered.map(s => stationOption(s, inputId, listId)).join('');
}

function stationOption(s, inputId, listId) {
    return `<div class="station-option" onclick="selectStation('${inputId}','${listId}',${s.station_id},'${s.station_name}','${s.station_code}')">
        <span class="code">${s.station_code}</span>
        <span class="name">${s.station_name}</span>
        <span class="city">📍 ${s.city}</span>
    </div>`;
}

function selectStation(inputId, listId, id, name, code) {
    const input = document.getElementById(inputId);
    input.value = `${name} (${code})`;
    input.dataset.stationId = id;
    document.getElementById(listId).classList.add('hidden');
}

function swapStations(id1, id2) {
    const el1 = document.getElementById(id1);
    const el2 = document.getElementById(id2);
    const tempVal = el1.value;
    const tempId = el1.dataset.stationId;
    el1.value = el2.value;
    el1.dataset.stationId = el2.dataset.stationId || '';
    el2.value = tempVal;
    el2.dataset.stationId = tempId || '';
}

function switchSearchTab(tab) {
    document.getElementById('tab-book').classList.toggle('active', tab === 'book');
    document.getElementById('tab-pnr').classList.toggle('active', tab === 'pnr');
    document.getElementById('searchBook').classList.toggle('hidden', tab !== 'book');
    document.getElementById('searchPnrHome').classList.toggle('hidden', tab !== 'pnr');
}

// ============================================================
// HOME ACTIONS & 3D INTERACTION
// ============================================================
let currentQuota = 'GN';

function selectQuotaQuick(quota, el) {
    currentQuota = quota;
    document.querySelectorAll('.quota-pill').forEach(p => p.classList.remove('active'));
    if (el) el.classList.add('active');
    const searchQuota = document.getElementById('searchQuota');
    if (searchQuota) searchQuota.value = quota;
}

function syncClassSelection(val) {
    const searchClass = document.getElementById('searchClass');
    if (searchClass) searchClass.value = val;
}

function init3DTrainParallax() {
    const card = document.querySelector('.train-showcase-card');
    const img = document.getElementById('train3dImg');
    if (!card || !img) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / rect.height) * 16;
        const rotateY = (x / rect.width) * 20;
        img.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    });

    card.addEventListener('mouseleave', () => {
        img.style.transform = '';
    });
}

function searchFromHome() {
    const from = document.getElementById('homeFrom');
    const to = document.getElementById('homeTo');
    const date = document.getElementById('homeDate').value;
    const cls = document.getElementById('homeClass')?.value || 'ALL';

    function resolveHomeStation(el) {
        if (el.dataset.stationId) return el.dataset.stationId;
        const val = el.value.trim().toLowerCase();
        if (!val) return null;
        const parenMatch = val.match(/\(([a-z0-9]+)\)/i);
        if (parenMatch) {
            const code = parenMatch[1].toUpperCase();
            const s = stations.find(x => x.station_code.toUpperCase() === code);
            if (s) { el.dataset.stationId = s.station_id; return s.station_id; }
        }
        const s = stations.find(x => x.station_code.toLowerCase() === val || x.station_name.toLowerCase() === val || val.includes(x.station_name.toLowerCase()) || val.includes(x.station_code.toLowerCase()));
        if (s) { el.dataset.stationId = s.station_id; return s.station_id; }
        return null;
    }

    const fromId = resolveHomeStation(from);
    const toId = resolveHomeStation(to);

    if (!fromId || !toId) {
        showToast('Please select valid stations from the dropdown', 'error'); return;
    }
    if (!date) { showToast('Please select a journey date', 'error'); return; }

    // Copy to search page
    document.getElementById('searchFrom').value = from.value;
    document.getElementById('searchFrom').dataset.stationId = from.dataset.stationId;
    document.getElementById('searchTo').value = to.value;
    document.getElementById('searchTo').dataset.stationId = to.dataset.stationId;
    document.getElementById('searchDate').value = date;
    if (document.getElementById('searchClass')) document.getElementById('searchClass').value = cls;
    if (document.getElementById('searchQuota')) document.getElementById('searchQuota').value = currentQuota;

    showPage('search');
    searchTrains();
}

function checkPnrFromHome() {
    const pnr = document.getElementById('homePnr').value.trim();
    if (!pnr || pnr.length < 10) { showToast('Please enter a valid 10-digit PNR', 'error'); return; }
    document.getElementById('pnrInput').value = pnr;
    showPage('pnr');
    checkPnr();
}

function quickSearch(fromId, toId) {
    const today = new Date().toISOString().split('T')[0];
    const from = stations.find(s => s.station_id === fromId);
    const to = stations.find(s => s.station_id === toId);
    if (!from || !to) { showToast('Stations not loaded. Please wait.', 'error'); return; }

    const fromEl = document.getElementById('searchFrom');
    const toEl = document.getElementById('searchTo');
    fromEl.value = `${from.station_name} (${from.station_code})`;
    fromEl.dataset.stationId = fromId;
    toEl.value = `${to.station_name} (${to.station_code})`;
    toEl.dataset.stationId = toId;
    document.getElementById('searchDate').value = today;

    showPage('search');
    searchTrains();
}

// ============================================================
// TRAIN SEARCH
// ============================================================
async function searchTrains() {
    const fromInput = document.getElementById('searchFrom');
    const toInput = document.getElementById('searchTo');

    function resolveStation(input) {
        if (!input) return null;
        if (input.dataset.stationId && Number(input.dataset.stationId) > 0) {
            return parseInt(input.dataset.stationId);
        }
        const val = input.value.trim();
        if (!val) return null;

        // Try extracting station code in parentheses: e.g. "Agra Cantt (AGC)"
        const parenMatch = val.match(/\(([a-zA-Z0-9]+)\)/);
        if (parenMatch) {
            const found = stations.find(s => s.station_code.toUpperCase() === parenMatch[1].toUpperCase());
            if (found) {
                input.dataset.stationId = found.station_id;
                return found.station_id;
            }
        }

        // Try matching by exact station code
        const codeMatch = stations.find(s => s.station_code.toUpperCase() === val.toUpperCase());
        if (codeMatch) {
            input.dataset.stationId = codeMatch.station_id;
            return codeMatch.station_id;
        }

        // Try matching by station name or city
        const nameMatch = stations.find(s => 
            s.station_name.toLowerCase() === val.toLowerCase() ||
            val.toLowerCase().includes(s.station_name.toLowerCase()) ||
            s.station_name.toLowerCase().includes(val.toLowerCase()) ||
            s.city.toLowerCase() === val.toLowerCase()
        );
        if (nameMatch) {
            input.dataset.stationId = nameMatch.station_id;
            return nameMatch.station_id;
        }

        return null;
    }

    const fromId = resolveStation(fromInput);
    const toId = resolveStation(toInput);
    let date = document.getElementById('searchDate').value;
    const resultsEl = document.getElementById('searchResults');

    if (!date) {
        date = new Date().toISOString().split('T')[0];
        document.getElementById('searchDate').value = date;
    }

    if (!fromId || !toId) {
        showToast('Please select origin and destination stations from the suggestions', 'error');
        return;
    }
    if (fromId === toId) {
        showToast('Origin and destination cannot be the same station', 'error');
        return;
    }

    resultsEl.innerHTML = `<div class="loading"><div class="spinner"></div><p>Searching trains...</p></div>`;

    try {
        const res = await fetch(`${API}/trains/search?from_station=${fromId}&to_station=${toId}&journey_date=${date}`);
        const data = await res.json();

        if (data.trains && data.trains.length > 0) {
            resultsEl.innerHTML = `<h3 style="margin-bottom:16px;color:var(--text-muted);">${data.count} direct train${data.count > 1 ? 's' : ''} found</h3>` +
                data.trains.map(t => renderTrainResultCard(t, date, fromId, toId)).join('');
            return;
        }

        // If connecting routes or origin trains are found
        let html = '';
        if (data.connecting_options && data.connecting_options.length > 0) {
            html += `
                <div class="connecting-alert-box glass-card" style="margin-bottom:20px;padding:16px 20px;border-left:4px solid var(--accent-cyan);background:rgba(0,242,254,0.06);">
                    <div style="font-weight:700;font-size:1.05rem;color:var(--accent-cyan);margin-bottom:4px;">⚡ Connecting Routes Available via Major Railway Junctions</div>
                    <div style="color:var(--text-muted);font-size:0.9rem;">No single direct train was found between these two stations, but we found <strong>${data.connecting_options.length} fast 1-stop transfer journeys</strong> via connecting hubs:</div>
                </div>
            `;

            html += data.connecting_options.map(conn => renderConnectingCard(conn, date, fromId, toId)).join('');
        }

        if (data.origin_trains && data.origin_trains.length > 0) {
            html += `
                <div style="margin:28px 0 16px 0;">
                    <h3 style="color:var(--accent-emerald);font-size:1.15rem;margin-bottom:6px;">🚂 Major Express Trains Departing from ${data.origin_trains[0].from_station_name}</h3>
                    <p style="color:var(--text-muted);font-size:0.88rem;">Browse popular trains operating from this station:</p>
                </div>
            `;
            html += `<div class="trains-list" style="margin-top:12px;">` +
                data.origin_trains.map(ot => `
                    <div class="train-card" onclick="viewTrainDetail(${ot.train_id})">
                        <div class="train-card-header">
                            <div>
                                <div class="train-card-name">${ot.train_name}</div>
                                <div class="train-card-num">${ot.train_number}</div>
                            </div>
                            <span class="badge badge-success">${ot.train_type}</span>
                        </div>
                        <div class="train-card-meta">
                            <span class="meta-tag">🕒 Dep: ${formatTime(ot.departure)}</span>
                            <span class="meta-tag">🎟️ ${ot.classes?.length || 0} Classes</span>
                            <div style="margin-left:auto;display:flex;gap:8px;">
                                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();viewTrainDetail(${ot.train_id})">View Route →</button>
                                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();viewTrainDetail(${ot.train_id})">⚡ Book Ticket</button>
                            </div>
                        </div>
                    </div>
                `).join('') + `</div>`;
        }

        if (!html) {
            html = `
                <div class="empty-state">
                    <div class="empty-state-icon">🚂</div>
                    <h3>No trains scheduled between these stations</h3>
                    <p style="max-width:500px;margin:0 auto 16px;">Try one of the popular Pan-India trunk routes below to test booking:</p>
                    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
                        <button class="btn btn-outline btn-sm" onclick="quickSearch(1, 2)">Delhi ↔ Mumbai</button>
                        <button class="btn btn-outline btn-sm" onclick="quickSearch(1, 4)">Delhi ↔ Kolkata</button>
                        <button class="btn btn-outline btn-sm" onclick="quickSearch(1, 3)">Delhi ↔ Chennai</button>
                        <button class="btn btn-outline btn-sm" onclick="quickSearch(3, 5)">Chennai ↔ Bengaluru</button>
                        <button class="btn btn-outline btn-sm" onclick="quickSearch(1, 41)">Delhi ↔ Varanasi</button>
                    </div>
                </div>
            `;
        }

        resultsEl.innerHTML = html;
    } catch (err) {
        resultsEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Connection Error</h3><p>Could not connect to server. Is it running?</p></div>`;
    }
}

function renderConnectingCard(conn, date, fromId, toId) {
    return `
        <div class="train-result-card glass-card" style="border:1px solid rgba(0,242,254,0.3);margin-bottom:16px;">
            <div class="train-result-header">
                <div>
                    <span class="badge badge-rac" style="margin-bottom:6px;display:inline-block;">⚡ 1-STOP CONNECTION</span>
                    <h3 style="font-size:1.15rem;">Via ${conn.junction_name} (${conn.junction_code})</h3>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:700;color:var(--accent-cyan);">Total Distance: ${Math.round(conn.total_distance_km)} km</div>
                </div>
            </div>

            <!-- Leg 1 -->
            <div style="background:rgba(255,255,255,0.03);padding:12px 16px;border-radius:10px;margin:12px 0;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <div>
                        <strong style="color:var(--accent-cyan);">Leg 1:</strong> ${conn.leg1_num} - ${conn.leg1_name} (${conn.leg1_type})
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="viewTrainDetail(${conn.leg1_train_id})">Train 1 Route</button>
                </div>
                <div class="train-timing" style="margin:0;">
                    <div class="timing-box">
                        <div class="timing-time">${formatTime(conn.leg1_departure)}</div>
                        <div class="timing-station">${conn.from_station_name}</div>
                    </div>
                    <div class="timing-arrow">———→</div>
                    <div class="timing-duration">
                        <div class="distance">${Math.round(conn.leg1_dist)} km</div>
                    </div>
                    <div class="timing-arrow">———→</div>
                    <div class="timing-box">
                        <div class="timing-time">${formatTime(conn.leg1_arrival)}</div>
                        <div class="timing-station">${conn.junction_name}</div>
                    </div>
                </div>
            </div>

            <!-- Transfer Junction indicator -->
            <div style="text-align:center;padding:4px 0;color:var(--accent-emerald);font-weight:600;font-size:0.85rem;">
                🔄 Change trains at <strong>${conn.junction_name} (${conn.junction_code})</strong>
            </div>

            <!-- Leg 2 -->
            <div style="background:rgba(255,255,255,0.03);padding:12px 16px;border-radius:10px;margin:12px 0;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <div>
                        <strong style="color:var(--accent-emerald);">Leg 2:</strong> ${conn.leg2_num} - ${conn.leg2_name} (${conn.leg2_type})
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="viewTrainDetail(${conn.leg2_train_id})">Train 2 Route</button>
                </div>
                <div class="train-timing" style="margin:0;">
                    <div class="timing-box">
                        <div class="timing-time">${formatTime(conn.leg2_departure)}</div>
                        <div class="timing-station">${conn.junction_name}</div>
                    </div>
                    <div class="timing-arrow">———→</div>
                    <div class="timing-duration">
                        <div class="distance">${Math.round(conn.leg2_dist)} km</div>
                    </div>
                    <div class="timing-arrow">———→</div>
                    <div class="timing-box">
                        <div class="timing-time">${formatTime(conn.leg2_arrival)}</div>
                        <div class="timing-station">${conn.to_station_name}</div>
                    </div>
                </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:14px;">
                <button class="btn btn-primary btn-sm" onclick="viewTrainDetail(${conn.leg1_train_id})">Book Leg 1 (${conn.leg1_num})</button>
                <button class="btn btn-primary btn-sm" onclick="viewTrainDetail(${conn.leg2_train_id})">Book Leg 2 (${conn.leg2_num})</button>
            </div>
        </div>
    `;
}

let currentSearchResultsMap = {};

function renderTrainResultCard(train, date, fromId, toId) {
    // Store in global lookup map to avoid broken HTML attribute serialization
    currentSearchResultsMap[train.train_id] = train;

    const statusClass = train.status === 'Active' ? 'badge-confirmed' : 'badge-cancelled';
    const classCards = (train.classes || []).map(c => {
        const avail = c.available_seats > 0 ? `✅ ${c.available_seats} Available` :
            c.rac_seats > 0 ? `🟡 RAC ${c.rac_seats}` :
            c.waitlist_count > 0 ? `⏳ WL ${c.waitlist_count}` : '❌ No Seats';
        const availClass = c.available_seats > 0 ? '' : c.rac_seats > 0 ? 'rac' : 'wl';
        const fare = Math.round(c.estimated_fare || c.fare_per_km * (train.distance_km || 0));

        return `<div class="class-card" onclick="bookTrainClass(${train.train_id}, ${c.class_id}, ${fromId}, ${toId}, '${date}')">
            <div class="class-code">${c.class_code}</div>
            <div class="class-name">${c.class_name}</div>
            <div class="class-fare">₹${fare}</div>
            <div class="class-avail ${availClass}">${avail}</div>
            <button class="btn btn-primary btn-sm" style="margin-top:8px;width:100%;font-size:0.8rem;padding:4px 8px;">Book Now →</button>
        </div>`;
    }).join('');

    return `<div class="train-result-card glass-card">
        <div class="train-result-header">
            <div class="train-info">
                <div class="train-num">${train.train_number}</div>
                <h3>${train.train_name}</h3>
            </div>
            <div style="display:flex;gap:10px;align-items:center;">
                <span class="train-type-badge">${train.train_type}</span>
                <button class="btn btn-outline btn-sm" onclick="viewTrainDetail(${train.train_id})">Route</button>
            </div>
        </div>
        <div class="train-timing">
            <div class="timing-box">
                <div class="timing-time">${formatTime(train.departure)}</div>
                <div class="timing-station">${train.from_station_name || ''}</div>
            </div>
            <div class="timing-arrow">————→</div>
            <div class="timing-duration">
                <div class="distance">📍 ${Math.round(train.distance_km)} km</div>
                <div class="duration">Direct Train</div>
            </div>
            <div class="timing-arrow">————→</div>
            <div class="timing-box">
                <div class="timing-time">${formatTime(train.arrival)}</div>
                <div class="timing-station">${train.to_station_name || ''}</div>
            </div>
        </div>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
            <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">Select Class to Book:</div>
            <div class="classes-grid">${classCards}</div>
        </div>
    </div>`;
}

function bookTrainClass(trainId, classId, fromId, toId, date) {
    const train = currentSearchResultsMap[trainId] || window.currentDetailTrain;
    if (!train) {
        showToast('Train information not found', 'error');
        return;
    }
    const cls = (train.classes || []).find(c => c.class_id === classId) || 
                (window.currentDetailClasses || []).find(c => c.class_id === classId);
    if (!cls) {
        showToast('Class information not found', 'error');
        return;
    }

    selectedTrainData = train;
    selectedClassData = cls;

    if (!currentUser) {
        sessionStorage.setItem('rr_pending_booking', JSON.stringify({ train, cls, fromId, toId, date }));
        showToast('Connecting demo passenger account for instant booking...', 'info');
        quickGuestLoginAndBook(train, cls, fromId, toId, date);
        return;
    }

    openBookingPage(train, cls, fromId, toId, date);
}

function selectClass(el, trainJson, classJson, fromId, toId, date) {
    try {
        const train = typeof trainJson === 'string' ? JSON.parse(trainJson) : trainJson;
        const cls = typeof classJson === 'string' ? JSON.parse(classJson) : classJson;
        bookTrainClass(train.train_id, cls.class_id, fromId, toId, date);
    } catch (e) {
        console.error('selectClass parse error:', e);
    }
}

async function quickGuestLoginAndBook(train, cls, fromId, toId, date) {
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'rahul@example.com', password: 'admin123' })
        });
        const data = await res.json();
        if (data.success) {
            currentToken = data.token;
            currentUser = data.user;
            localStorage.setItem('rr_token', currentToken);
            localStorage.setItem('rr_user', JSON.stringify(currentUser));
            updateNavForUser();
            showToast('Logged in as ' + currentUser.full_name + ' 🎟️', 'success');
            openBookingPage(train, cls, fromId, toId, date);
        } else {
            showToast('Please login to complete booking', 'info');
            showPage('login');
        }
    } catch(e) {
        showPage('login');
    }
}

// ============================================================
// COACH & SEAT SELECTION ENGINE
// ============================================================
let seatSelectionState = {
    train: null,
    cls: null,
    date: null,
    coaches: [],
    currentCoach: '',
    passengerSeats: {}, // { 0: { coach: 'B1', seatNum: 1, berthType: 'Lower', seatLabel: 'B1-01' } }
    activePaxIdx: 0
};

function getCoachesForClass(classCode) {
    switch (classCode) {
        case '3A': return ['B1', 'B2', 'B3'];
        case '2A': return ['A1', 'A2'];
        case '1A': return ['H1', 'H2'];
        case 'SL': return ['S1', 'S2', 'S3', 'S4'];
        case 'CC': return ['C1', 'C2'];
        case '2S': return ['D1', 'D2'];
        case 'EC': return ['E1'];
        default: return ['C1', 'C2'];
    }
}

function isSeatOccupied(trainId, coach, seatNum) {
    // Deterministic pseudo-random occupancy based on train ID and seat
    const hash = (Number(trainId) * 41 + coach.charCodeAt(0) * 19 + (coach.charCodeAt(1) || 48) * 13 + seatNum) % 100;
    return (hash % 6 === 0); // ~16% seats occupied
}

function initSeatSelection(train, cls, date) {
    const coaches = getCoachesForClass(cls.class_code);
    seatSelectionState = {
        train,
        cls,
        date,
        coaches,
        currentCoach: coaches[0],
        passengerSeats: {},
        activePaxIdx: 0
    };

    renderSeatSelectionUI();
    // Auto-select for first passenger
    autoAssignSeatsForPassenger(0);
}

function switchCoachTab(coachName) {
    seatSelectionState.currentCoach = coachName;
    renderSeatSelectionUI();
}

function focusPassengerSeatSelection(paxIdx) {
    seatSelectionState.activePaxIdx = paxIdx;
    renderSeatSelectionUI();
    const sec = document.getElementById('seatSelectionSection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderSeatSelectionUI() {
    const container = document.getElementById('seatSelectionSection');
    if (!container || !seatSelectionState.cls) return;

    const { cls, coaches, currentCoach, activePaxIdx, passengerSeats, train } = seatSelectionState;
    const paxCount = document.querySelectorAll('#passengerForms .passenger-form-item').length || 1;

    // Render passenger selector chips
    let paxChipsHtml = '';
    for (let i = 0; i < paxCount; i++) {
        const assigned = passengerSeats[i];
        const isActive = (i === activePaxIdx);
        const pEl = document.querySelectorAll('#passengerForms .passenger-form-item')[i];
        const pName = pEl?.querySelector('.p-name')?.value?.trim() || `Passenger ${i + 1}`;

        paxChipsHtml += `
            <div class="pax-select-chip ${isActive ? 'active' : ''}" onclick="focusPassengerSeatSelection(${i})">
                <span>👤 ${pName}</span>
                ${assigned ? 
                    `<span class="pax-assigned-seat">🪑 ${assigned.seatLabel} (${assigned.berthType})</span>` : 
                    `<span style="color:var(--text-dim);font-size:0.75rem;">(Select Seat)</span>`
                }
            </div>
        `;
    }

    // Build Coach Bays Layout
    const baysHtml = buildCoachBaysHtml(cls.class_code, currentCoach, train.train_id);

    container.innerHTML = `
        <div class="coach-header-wrap">
            <div class="coach-badge-info">
                <span class="coach-type-pill">🪑 ${cls.class_code} - ${cls.class_name}</span>
                <span style="font-size:0.9rem;color:var(--text-muted);">Choose your preferred seat / berth</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                <div class="coach-switcher-tabs">
                    ${coaches.map(c => `
                        <button type="button" class="coach-tab-btn ${c === currentCoach ? 'active' : ''}" onclick="switchCoachTab('${c}')">
                            Coach ${c}
                        </button>
                    `).join('')}
                </div>
                <button type="button" class="btn btn-sm btn-outline" onclick="autoSelectSeats()" style="font-size:0.8rem;padding:4px 10px;">
                    ⚡ Auto-Assign Best
                </button>
            </div>
        </div>

        <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px;">
            Click a passenger to assign their seat, then click any available berth on the coach layout:
        </div>

        <!-- Passenger Chips -->
        <div class="pax-seat-selector-bar">
            ${paxChipsHtml}
        </div>

        <!-- Coach Body -->
        <div class="coach-visual-container">
            <div class="coach-train-direction">
                <span>◀ Engine / Next Coach</span>
                <span style="color:var(--accent-cyan);font-weight:700;">Coach ${currentCoach}</span>
                <span>Vestibule / Exit ▶</span>
            </div>

            <div class="coach-bays-layout">
                ${baysHtml}
            </div>
        </div>

        <!-- Legend -->
        <div class="seat-legend-bar">
            <div class="legend-item"><div class="legend-box available"></div><span>Available</span></div>
            <div class="legend-item"><div class="legend-box selected"></div><span>Selected for You</span></div>
            <div class="legend-item"><div class="legend-box occupied"></div><span>Occupied</span></div>
            <div class="legend-item"><span style="color:var(--accent-cyan);">LB</span><span>Lower</span></div>
            <div class="legend-item"><span style="color:var(--text-muted);">MB</span><span>Middle</span></div>
            <div class="legend-item"><span style="color:var(--text-muted);">UB</span><span>Upper</span></div>
            <div class="legend-item"><span style="color:var(--emerald-neon);">SL</span><span>Side Lower</span></div>
        </div>
    `;

    updateSeatsSummaryBadge();
    syncPassengerCardsDisplay();
}

function buildCoachBaysHtml(classCode, coach, trainId) {
    if (classCode === '3A' || classCode === 'SL') {
        // Standard 8-berth bays (LB, MB, UB x 2 + SL, SU)
        const bayCount = 4; // 32 berths previewed
        let html = '';
        for (let b = 0; b < bayCount; b++) {
            const startNum = b * 8 + 1;
            html += `
                <div class="coach-bay">
                    <div class="bay-label">Compartment ${b + 1}</div>
                    <div class="bay-content">
                        <div class="bay-main-side">
                            <div class="bay-berth-column">
                                ${renderSeatBtn(coach, startNum, 'Lower', 'LB', trainId)}
                                ${renderSeatBtn(coach, startNum + 1, 'Middle', 'MB', trainId)}
                                ${renderSeatBtn(coach, startNum + 2, 'Upper', 'UB', trainId)}
                            </div>
                            <div class="bay-berth-column">
                                ${renderSeatBtn(coach, startNum + 3, 'Lower', 'LB', trainId)}
                                ${renderSeatBtn(coach, startNum + 4, 'Middle', 'MB', trainId)}
                                ${renderSeatBtn(coach, startNum + 5, 'Upper', 'UB', trainId)}
                            </div>
                        </div>
                        <div class="bay-aisle">Aisle</div>
                        <div class="bay-side-berths">
                            ${renderSeatBtn(coach, startNum + 6, 'Side Lower', 'SL', trainId)}
                            ${renderSeatBtn(coach, startNum + 7, 'Side Upper', 'SU', trainId)}
                        </div>
                    </div>
                </div>
            `;
        }
        return html;
    } else if (classCode === '2A') {
        // 6-berth bays (LB, UB x 2 + SL, SU)
        const bayCount = 4;
        let html = '';
        for (let b = 0; b < bayCount; b++) {
            const startNum = b * 6 + 1;
            html += `
                <div class="coach-bay">
                    <div class="bay-label">Compartment ${b + 1}</div>
                    <div class="bay-content">
                        <div class="bay-main-side">
                            <div class="bay-berth-column">
                                ${renderSeatBtn(coach, startNum, 'Lower', 'LB', trainId)}
                                ${renderSeatBtn(coach, startNum + 1, 'Upper', 'UB', trainId)}
                            </div>
                            <div class="bay-berth-column">
                                ${renderSeatBtn(coach, startNum + 2, 'Lower', 'LB', trainId)}
                                ${renderSeatBtn(coach, startNum + 3, 'Upper', 'UB', trainId)}
                            </div>
                        </div>
                        <div class="bay-aisle">Aisle</div>
                        <div class="bay-side-berths">
                            ${renderSeatBtn(coach, startNum + 4, 'Side Lower', 'SL', trainId)}
                            ${renderSeatBtn(coach, startNum + 5, 'Side Upper', 'SU', trainId)}
                        </div>
                    </div>
                </div>
            `;
        }
        return html;
    } else if (classCode === '1A') {
        // Cabins (4) & Coupes (2)
        return `
            <div class="coach-bay">
                <div class="bay-label">Cabin A (4-Berth)</div>
                <div class="bay-content">
                    <div class="bay-main-side">
                        <div class="bay-berth-column">
                            ${renderSeatBtn(coach, 1, 'Lower', 'LB', trainId)}
                            ${renderSeatBtn(coach, 2, 'Upper', 'UB', trainId)}
                        </div>
                        <div class="bay-berth-column">
                            ${renderSeatBtn(coach, 3, 'Lower', 'LB', trainId)}
                            ${renderSeatBtn(coach, 4, 'Upper', 'UB', trainId)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="coach-bay">
                <div class="bay-label">Cabin B (4-Berth)</div>
                <div class="bay-content">
                    <div class="bay-main-side">
                        <div class="bay-berth-column">
                            ${renderSeatBtn(coach, 5, 'Lower', 'LB', trainId)}
                            ${renderSeatBtn(coach, 6, 'Upper', 'UB', trainId)}
                        </div>
                        <div class="bay-berth-column">
                            ${renderSeatBtn(coach, 7, 'Lower', 'LB', trainId)}
                            ${renderSeatBtn(coach, 8, 'Upper', 'UB', trainId)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="coach-bay">
                <div class="bay-label">Coupe C (2-Berth)</div>
                <div class="bay-content">
                    <div class="bay-main-side">
                        <div class="bay-berth-column">
                            ${renderSeatBtn(coach, 9, 'Lower', 'LB', trainId)}
                            ${renderSeatBtn(coach, 10, 'Upper', 'UB', trainId)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="coach-bay">
                <div class="bay-label">Coupe D (2-Berth)</div>
                <div class="bay-content">
                    <div class="bay-main-side">
                        <div class="bay-berth-column">
                            ${renderSeatBtn(coach, 11, 'Lower', 'LB', trainId)}
                            ${renderSeatBtn(coach, 12, 'Upper', 'UB', trainId)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Chair Car (CC, 2S, EC) - 3x2 rows
        let html = '';
        for (let r = 1; r <= 4; r++) {
            const startNum = (r - 1) * 5 + 1;
            html += `
                <div class="coach-bay">
                    <div class="bay-label">Row ${r}</div>
                    <div class="bay-content">
                        <div class="bay-main-side">
                            <div class="bay-berth-column">
                                ${renderSeatBtn(coach, startNum, 'Window', 'W', trainId)}
                                ${renderSeatBtn(coach, startNum + 1, 'Middle', 'M', trainId)}
                                ${renderSeatBtn(coach, startNum + 2, 'Aisle', 'A', trainId)}
                            </div>
                        </div>
                        <div class="bay-aisle">Aisle</div>
                        <div class="bay-side-berths">
                            ${renderSeatBtn(coach, startNum + 3, 'Aisle', 'A', trainId)}
                            ${renderSeatBtn(coach, startNum + 4, 'Window', 'W', trainId)}
                        </div>
                    </div>
                </div>
            `;
        }
        return html;
    }
}

function renderSeatBtn(coach, seatNum, berthType, shortTag, trainId) {
    const seatLabel = `${coach}-${seatNum < 10 ? '0' + seatNum : seatNum}`;
    const occupied = isSeatOccupied(trainId, coach, seatNum);

    // Check if any passenger has selected this seat
    let isSelectedByUs = false;
    let selectedPaxIdx = -1;
    for (const [pIdx, seat] of Object.entries(seatSelectionState.passengerSeats)) {
        if (seat.coach === coach && seat.seatNum === seatNum) {
            isSelectedByUs = true;
            selectedPaxIdx = parseInt(pIdx);
            break;
        }
    }

    if (occupied && !isSelectedByUs) {
        return `
            <div class="coach-seat-btn occupied" title="Seat ${seatLabel} is occupied">
                <span class="seat-num">${seatNum}</span>
                <span class="berth-type-tag">${shortTag}</span>
            </div>
        `;
    }

    const clickCall = `onSeatClicked('${coach}', ${seatNum}, '${berthType}', '${seatLabel}')`;

    return `
        <div class="coach-seat-btn available ${isSelectedByUs ? 'selected' : ''}" 
             onclick="${clickCall}" 
             title="Seat ${seatLabel} (${berthType}) ${isSelectedByUs ? '- Assigned to Passenger ' + (selectedPaxIdx + 1) : '- Click to select'}">
            <span class="seat-num">${seatNum}</span>
            <span class="berth-type-tag">${shortTag}</span>
        </div>
    `;
}

function onSeatClicked(coach, seatNum, berthType, seatLabel) {
    const occupied = isSeatOccupied(seatSelectionState.train.train_id, coach, seatNum);
    if (occupied) {
        showToast(`Seat ${seatLabel} is occupied. Please select an available seat.`, 'error');
        return;
    }

    // Check if already assigned to another passenger in this group
    for (const [pIdx, seat] of Object.entries(seatSelectionState.passengerSeats)) {
        if (seat.coach === coach && seat.seatNum === seatNum && parseInt(pIdx) !== seatSelectionState.activePaxIdx) {
            showToast(`Seat ${seatLabel} is already assigned to Passenger ${parseInt(pIdx) + 1}`, 'info');
            return;
        }
    }

    // Assign to active passenger
    seatSelectionState.passengerSeats[seatSelectionState.activePaxIdx] = {
        coach,
        seatNum,
        berthType,
        seatLabel
    };

    showToast(`Seat ${seatLabel} (${berthType}) assigned to Passenger ${seatSelectionState.activePaxIdx + 1}! 🪑`, 'success');

    // Auto-advance to next passenger without seat
    const paxCount = document.querySelectorAll('#passengerForms .passenger-form-item').length || 1;
    let nextUnassigned = -1;
    for (let i = 0; i < paxCount; i++) {
        if (!seatSelectionState.passengerSeats[i]) {
            nextUnassigned = i;
            break;
        }
    }
    if (nextUnassigned !== -1) {
        seatSelectionState.activePaxIdx = nextUnassigned;
    }

    renderSeatSelectionUI();
}

function autoAssignSeatsForPassenger(paxIdx) {
    if (!seatSelectionState.cls) return;
    const coach = seatSelectionState.currentCoach;
    const trainId = seatSelectionState.train.train_id;

    // Find next available unassigned seat
    for (let s = 1; s <= 32; s++) {
        if (!isSeatOccupied(trainId, coach, s)) {
            // Check not already taken by our group
            const alreadyTaken = Object.values(seatSelectionState.passengerSeats).some(
                st => st.coach === coach && st.seatNum === s
            );
            if (!alreadyTaken) {
                const berth = (s % 8 === 1 || s % 8 === 4) ? 'Lower' :
                              (s % 8 === 2 || s % 8 === 5) ? 'Middle' :
                              (s % 8 === 3 || s % 8 === 6) ? 'Upper' :
                              (s % 8 === 7) ? 'Side Lower' : 'Side Upper';
                const seatLabel = `${coach}-${s < 10 ? '0' + s : s}`;
                seatSelectionState.passengerSeats[paxIdx] = {
                    coach,
                    seatNum: s,
                    berthType: berth,
                    seatLabel
                };
                break;
            }
        }
    }
}

function autoSelectSeats() {
    const paxCount = document.querySelectorAll('#passengerForms .passenger-form-item').length || 1;
    for (let i = 0; i < paxCount; i++) {
        autoAssignSeatsForPassenger(i);
    }
    showToast('Best adjacent seats automatically assigned! ✨', 'success');
    renderSeatSelectionUI();
}

function updateSeatsSummaryBadge() {
    const badge = document.getElementById('selectedSeatsSummaryBadge');
    if (!badge) return;

    const assigned = Object.values(seatSelectionState.passengerSeats);
    if (assigned.length > 0) {
        badge.classList.remove('hidden');
        badge.innerHTML = `🪑 Selected Seats: ${assigned.map(s => s.seatLabel).join(', ')}`;
    } else {
        badge.classList.add('hidden');
    }
}

function syncPassengerCardsDisplay() {
    const pEls = document.querySelectorAll('#passengerForms .passenger-form-item');
    pEls.forEach((el, idx) => {
        const assigned = seatSelectionState.passengerSeats[idx];
        let seatPill = el.querySelector('.pax-card-seat-pill');
        if (!seatPill) {
            const h4 = el.querySelector('h4');
            if (h4) {
                seatPill = document.createElement('span');
                seatPill.className = 'pax-card-seat-pill';
                h4.parentNode.insertBefore(seatPill, h4.nextSibling);
            }
        }

        if (assigned && seatPill) {
            seatPill.innerHTML = `
                <div style="margin-bottom:12px;">
                    <span class="passenger-assigned-seat-pill">
                        🪑 Assigned Seat: ${assigned.seatLabel} (${assigned.berthType})
                    </span>
                    <span class="reselect-seat-link" onclick="focusPassengerSeatSelection(${idx})">Change Seat ↺</span>
                </div>
            `;
            el.dataset.seatNumber = assigned.seatLabel;
            el.dataset.berthType = assigned.berthType;
        } else if (seatPill) {
            seatPill.innerHTML = `
                <div style="margin-bottom:12px;">
                    <span style="font-size:0.8rem;color:var(--text-dim);">No seat selected yet</span>
                    <span class="reselect-seat-link" onclick="focusPassengerSeatSelection(${idx})">Pick Seat on Map →</span>
                </div>
            `;
            delete el.dataset.seatNumber;
            delete el.dataset.berthType;
        }
    });
}

// ============================================================
// BOOKING
// ============================================================
function openBookingPage(train, cls, fromId, toId, date) {
    const fromStation = stations.find(s => s.station_id == fromId);
    const toStation = stations.find(s => s.station_id == toId);
    const fare = Math.round(cls.estimated_fare || cls.fare_per_km * (train.distance_km || 0));

    document.getElementById('bookingSummary').innerHTML = `
        <h3>Journey Summary</h3>
        <div class="journey-summary">
            <div class="summary-station">
                <div class="sname">${fromStation?.station_name || 'Origin'}</div>
                <div class="scode">${fromStation?.station_code || ''} • ${formatTime(train.departure)}</div>
            </div>
            <div class="summary-arrow">→</div>
            <div class="summary-station" style="text-align:right">
                <div class="sname">${toStation?.station_name || 'Destination'}</div>
                <div class="scode">${toStation?.station_code || ''} • ${formatTime(train.arrival)}</div>
            </div>
        </div>
        <div class="summary-details">
            <span class="summary-chip">🚂 ${train.train_number} ${train.train_name}</span>
            <span class="summary-chip">🪑 ${cls.class_code} - ${cls.class_name}</span>
            <span class="summary-chip">📅 ${formatDate(date)}</span>
            <span class="summary-chip">📍 ${Math.round(train.distance_km)} km</span>
        </div>
    `;

    // Reset passenger forms
    passengerCount = 0;
    document.getElementById('passengerForms').innerHTML = '';
    addPassengerForm();

    // Initialize Interactive Seat & Coach Selection
    initSeatSelection(train, cls, date);

    updateFareBreakdown(fare);

    // Store booking context
    document.getElementById('bookBtn').dataset.trainId = train.train_id;
    document.getElementById('bookBtn').dataset.classId = cls.class_id;
    document.getElementById('bookBtn').dataset.fromId = fromId;
    document.getElementById('bookBtn').dataset.toId = toId;
    document.getElementById('bookBtn').dataset.date = date;
    document.getElementById('bookBtn').dataset.farePerPax = fare;

    showPage('booking');
    showToast('Seat map loaded! Pick your preferred berths 🪑', 'info');
}

function addPassengerForm() {
    const maxPassengers = 6;
    if (passengerCount >= maxPassengers) {
        showToast(`Maximum ${maxPassengers} passengers per booking`, 'error'); return;
    }
    passengerCount++;
    const idx = document.getElementById('passengerForms').children.length + 1;

    const div = document.createElement('div');
    div.className = 'passenger-form-item';
    div.innerHTML = `
        ${idx > 1 ? `<button class="remove-passenger" onclick="removePassengerForm(this)">✕</button>` : ''}
        <h4 style="margin-bottom:8px;color:var(--text-muted);font-size:0.9rem;">Passenger ${idx}</h4>
        <div class="pax-card-seat-pill"></div>
        <div class="form-grid">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" class="form-input p-name" placeholder="As in ID card" value="${idx === 1 ? (currentUser?.full_name || 'Rahul Sharma') : ''}" required>
            </div>
            <div class="form-group">
                <label>Age</label>
                <input type="number" class="form-input p-age" min="1" max="120" placeholder="Age" value="${idx === 1 ? 28 : ''}" required>
            </div>
            <div class="form-group">
                <label>Gender</label>
                <select class="form-input p-gender">
                    <option>Male</option><option>Female</option><option>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>ID Type</label>
                <select class="form-input p-idtype">
                    <option>Aadhar</option><option>PAN</option><option>Passport</option><option>DL</option><option>Voter ID</option>
                </select>
            </div>
            <div class="form-group full-width">
                <label>ID Number</label>
                <input type="text" class="form-input p-idnum" placeholder="ID Card Number" value="${idx === 1 ? '9876-5432-1098' : ''}">
            </div>
        </div>
    `;
    document.getElementById('passengerForms').appendChild(div);

    // Auto-allocate seat for the newly added passenger
    if (seatSelectionState.cls) {
        autoAssignSeatsForPassenger(idx - 1);
        renderSeatSelectionUI();
    }

    updateFareBreakdown();
}

function removePassengerForm(btn) {
    btn.closest('.passenger-form-item').remove();
    passengerCount--;

    // Re-index remaining passengers and re-align seat allocations
    const remainingEls = document.querySelectorAll('#passengerForms .passenger-form-item');
    const newPassengerSeats = {};
    remainingEls.forEach((el, i) => {
        el.querySelector('h4').textContent = `Passenger ${i + 1}`;
        if (seatSelectionState.passengerSeats[i]) {
            newPassengerSeats[i] = seatSelectionState.passengerSeats[i];
        }
    });
    seatSelectionState.passengerSeats = newPassengerSeats;

    if (seatSelectionState.activePaxIdx >= remainingEls.length) {
        seatSelectionState.activePaxIdx = Math.max(0, remainingEls.length - 1);
    }

    renderSeatSelectionUI();
    updateFareBreakdown();
}

function updateFareBreakdown(farePerPax) {
    const btn = document.getElementById('bookBtn');
    const baseFare = farePerPax || parseInt(btn.dataset.farePerPax) || 0;
    const paxCount = document.querySelectorAll('#passengerForms .passenger-form-item').length;
    const subtotal = baseFare * paxCount;
    const serviceFee = Math.round(subtotal * 0.02);
    const total = subtotal + serviceFee;

    document.getElementById('fareBreakdown').innerHTML = `
        <div class="fare-row"><span>Base Fare × ${paxCount} passenger${paxCount > 1 ? 's' : ''}</span><span>₹${subtotal}</span></div>
        <div class="fare-row"><span>Service Fee (2%)</span><span>₹${serviceFee}</span></div>
        <div class="fare-row"><span>GST</span><span>Included</span></div>
        <div class="fare-row total"><span>Total Amount</span><span>₹${total}</span></div>
    `;

    btn.dataset.totalFare = total;
}

let selectedPaymentMethod = 'UPI';

function switchPayMethod(method, btn) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.pay-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Toggle views
    document.querySelectorAll('.pay-view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(method === 'Net Banking' ? 'payView-NetBanking' : `payView-${method}`);
    if (target) target.classList.remove('hidden');
}

function verifyVpa() {
    const vpa = document.getElementById('vpaInput').value.trim();
    const statusEl = document.getElementById('vpaStatus');
    if (!vpa || !vpa.includes('@')) {
        showToast('Please enter a valid VPA (e.g. user@bank)', 'error');
        statusEl.className = 'vpa-status text-danger';
        statusEl.textContent = '✗ Invalid UPI ID format';
        return;
    }
    statusEl.className = 'vpa-status text-emerald';
    statusEl.textContent = `✓ Verified VPA: ${currentUser?.full_name || 'Passenger'} (${vpa})`;
    showToast('UPI Address verified successfully!', 'success');
}

async function confirmBooking() {
    const btn = document.getElementById('bookBtn');
    const passengerEls = document.querySelectorAll('#passengerForms .passenger-form-item');
    const passengers = [];

    let pIdx = 0;
    for (const el of passengerEls) {
        const name = el.querySelector('.p-name').value.trim();
        const age = el.querySelector('.p-age').value;
        if (!name || !age) { showToast('Please fill all passenger details', 'error'); return; }

        const assignedSeat = seatSelectionState.passengerSeats[pIdx];
        const seatNumber = el.dataset.seatNumber || assignedSeat?.seatLabel || `B1-${pIdx + 12}`;
        const berthType = el.dataset.berthType || assignedSeat?.berthType || 'Lower';

        passengers.push({
            name,
            age: parseInt(age),
            gender: el.querySelector('.p-gender').value,
            id_type: el.querySelector('.p-idtype').value,
            id_number: el.querySelector('.p-idnum').value,
            seat_number: seatNumber,
            berth_type: berthType
        });
        pIdx++;
    }

    const paymentMode = selectedPaymentMethod === 'Card' ? 'Credit Card' : selectedPaymentMethod;

    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Authorizing secure payment & generating PNR...</span>';

    try {
        const res = await fetch(`${API}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
            body: JSON.stringify({
                train_id: parseInt(btn.dataset.trainId),
                class_id: parseInt(btn.dataset.classId),
                from_station_id: parseInt(btn.dataset.fromId),
                to_station_id: parseInt(btn.dataset.toId),
                journey_date: btn.dataset.date,
                passengers,
                payment_mode: paymentMode,
                total_fare: parseFloat(btn.dataset.totalFare)
            })
        });
        const data = await res.json();

        if (data.success) {
            showToast('Payment Authorized & Booking Confirmed! 💳✨', 'success');
            showTicketSuccess(data, passengers, btn.dataset.date);
            loadNotificationCount();
        } else {
            showToast(data.message || 'Booking failed', 'error');
        }
    } catch (err) {
        showToast('Connection error. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>🔐 PAY SECURELY & GENERATE TICKET</span>';
    }
}

function showTicketSuccess(data, passengers, date) {
    const ticketHTML = `
        <div class="ticket-pnr">${data.pnr_number}</div>
        <div style="margin-bottom:16px;">
            <span class="badge badge-${data.status === 'Confirmed' ? 'confirmed' : data.status === 'RAC' ? 'rac' : 'waitlisted'}">
                ${data.status}
            </span>
        </div>
        <div class="ticket-info-grid">
            <div class="ticket-info-item"><label>Transaction ID</label><span>${data.transaction_id || 'N/A'}</span></div>
            <div class="ticket-info-item"><label>Journey Date</label><span>${formatDate(date)}</span></div>
            <div class="ticket-info-item"><label>Total Fare</label><span>₹${data.total_fare}</span></div>
            <div class="ticket-info-item"><label>Passengers</label><span>${passengers.length}</span></div>
        </div>
        <div style="text-align:left;margin-top:16px;">
            <h4 style="margin-bottom:12px;">Allocated Seats & Passengers</h4>
            ${passengers.map((p, i) => `
                <div class="passenger-row" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:8px;">
                    <div>
                        <span style="font-weight:700">${p.name}</span>
                        <span style="color:var(--text-muted);font-size:0.85rem;margin-left:8px;">(${p.gender}, Age ${p.age})</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span class="passenger-assigned-seat-pill">🪑 Seat: ${p.seat_number}</span>
                        <span class="badge badge-rac">${p.berth_type}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('ticketDetails').innerHTML = ticketHTML;
    showPage('ticket');
    showToast('Booking confirmed! 🎉', 'success');
}

function printTicket() {
    window.print();
}

// ============================================================
// PNR STATUS
// ============================================================
async function checkPnr() {
    const pnr = document.getElementById('pnrInput').value.trim();
    if (!pnr) { showToast('Please enter a PNR number', 'error'); return; }

    const resultEl = document.getElementById('pnrResult');
    resultEl.innerHTML = `<div class="loading"><div class="spinner"></div><p>Fetching PNR status...</p></div>`;

    try {
        const res = await fetch(`${API}/bookings/pnr/${pnr}`);
        const data = await res.json();

        if (!data.success) {
            resultEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❌</div><h3>PNR Not Found</h3><p>No booking found with PNR: ${pnr}</p></div>`;
            return;
        }

        const b = data.booking;
        const statusBadge = `<span class="badge badge-${b.booking_status?.toLowerCase()}">${b.booking_status}</span>`;
        const passengersHTML = b.passengers.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.age} / ${p.gender.charAt(0)}</td>
                <td><span class="badge badge-${p.status?.toLowerCase()}">${p.status}</span></td>
                <td>${p.seat_number || (p.waitlist_number ? 'WL/' + p.waitlist_number : p.rac_number ? 'RAC/' + p.rac_number : '—')}</td>
                <td>${p.berth_type || '—'}</td>
            </tr>
        `).join('');

        resultEl.innerHTML = `
            <div class="pnr-card glass-card">
                <div class="pnr-header">
                    <div>
                        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:6px;">PNR NUMBER</div>
                        <div class="pnr-number">${b.pnr_number}</div>
                    </div>
                    ${statusBadge}
                </div>
                <div class="pnr-body">
                    <div class="pnr-journey">
                        <div class="pnr-station">
                            <div class="sname">${b.from_station}</div>
                            <div class="scode">${b.from_code} • ${b.from_city}</div>
                        </div>
                        <div class="pnr-arrow">🚂→</div>
                        <div class="pnr-station" style="text-align:right">
                            <div class="sname">${b.to_station}</div>
                            <div class="scode">${b.to_code} • ${b.to_city}</div>
                        </div>
                    </div>
                    <div class="pnr-meta">
                        <div class="pnr-meta-item"><label>Train</label><span>${b.train_number} ${b.train_name}</span></div>
                        <div class="pnr-meta-item"><label>Class</label><span>${b.class_code} - ${b.class_name}</span></div>
                        <div class="pnr-meta-item"><label>Journey Date</label><span>${formatDate(b.journey_date)}</span></div>
                        <div class="pnr-meta-item"><label>Booked On</label><span>${new Date(b.booking_date).toLocaleDateString('en-IN')}</span></div>
                        <div class="pnr-meta-item"><label>Total Fare</label><span>₹${b.total_fare}</span></div>
                        <div class="pnr-meta-item"><label>Payment</label><span>${b.payment_mode}</span></div>
                    </div>
                    <h4 style="margin-bottom:12px;">Passenger Details</h4>
                    <table class="passengers-table">
                        <thead><tr><th>Name</th><th>Age/Sex</th><th>Status</th><th>Seat No.</th><th>Berth</th></tr></thead>
                        <tbody>${passengersHTML}</tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        resultEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error</h3><p>Could not connect to server.</p></div>`;
    }
}

// ============================================================
// TRAINS LIST
let activeTrainTypeFilter = 'ALL';

async function loadAllTrains() {
    try {
        const res = await fetch(`${API}/trains?limit=300`);
        const data = await res.json();
        if (data.success) {
            allTrains = data.trains;
            renderTrainsList();
        }
    } catch (err) { console.error('Failed to load trains:', err); }
}

function filterTrainType(type, btn) {
    activeTrainTypeFilter = type;
    document.querySelectorAll('.train-type-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    filterTrains();
}

function filterTrains() {
    const query = document.getElementById('trainSearch')?.value.toLowerCase() || '';
    const filtered = allTrains.filter(t => {
        const matchesQuery = !query || t.train_name.toLowerCase().includes(query) || t.train_number.includes(query);
        const matchesType = activeTrainTypeFilter === 'ALL' || t.train_type.toLowerCase() === activeTrainTypeFilter.toLowerCase();
        return matchesQuery && matchesType;
    });
    renderTrainsList(filtered);
}

function renderTrainsList(trains = allTrains) {
    const el = document.getElementById('trainsList');
    if (!trains.length) {
        el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚂</div><h3>No trains found</h3></div>`;
        return;
    }
    el.innerHTML = trains.map(t => `
        <div class="train-card" style="cursor:default;">
            <div class="train-card-header">
                <div style="cursor:pointer;" onclick="viewTrainDetail(${t.train_id})">
                    <div class="train-card-name">${t.train_name}</div>
                    <div class="train-card-num">${t.train_number}</div>
                </div>
                <span class="badge badge-${t.status === 'Active' ? 'success' : 'cancelled'}">${t.status}</span>
            </div>
            <div class="train-card-meta">
                <span class="meta-tag">🚂 ${t.train_type}</span>
                <span class="meta-tag">🪑 ${t.total_seats} Seats</span>
                <span class="meta-tag">🛑 ${t.stop_count || 0} Stops</span>
                <span class="meta-tag">🎟️ ${t.class_count || 0} Classes</span>
                <div style="margin-left:auto;display:flex;gap:8px;">
                    <button class="btn btn-outline btn-sm" onclick="viewTrainDetail(${t.train_id})">Route & Stops</button>
                    <button class="btn btn-primary btn-sm" onclick="viewTrainDetail(${t.train_id})">⚡ Book Ticket</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function viewTrainDetail(trainId) {
    showPage('train-detail');
    const el = document.getElementById('trainDetailContent');
    el.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading...</p></div>`;

    try {
        const res = await fetch(`${API}/trains/${trainId}`);
        const data = await res.json();
        if (!data.success) throw new Error('Not found');

        const { train, route, classes, schedule } = data;
        document.getElementById('trainDetailTitle').textContent = `${train.train_number} - ${train.train_name}`;

        const runDays = schedule ? [
            schedule.runs_on_mon ? 'Mon' : '',
            schedule.runs_on_tue ? 'Tue' : '',
            schedule.runs_on_wed ? 'Wed' : '',
            schedule.runs_on_thu ? 'Thu' : '',
            schedule.runs_on_fri ? 'Fri' : '',
            schedule.runs_on_sat ? 'Sat' : '',
            schedule.runs_on_sun ? 'Sun' : ''
        ].filter(Boolean).join(', ') : 'Daily';

        // Save context for live price calculator
        window.currentDetailTrain = train;
        window.currentDetailRoute = route;
        window.currentDetailClasses = classes;

        const originStop = route[0];
        const destStop = route[route.length - 1];
        const todayDate = new Date().toISOString().split('T')[0];

        el.innerHTML = `
            <div class="glass-card" style="margin-bottom:20px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
                    <div>
                        <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;">
                            <span class="train-type-badge">${train.train_type}</span>
                            <span class="badge badge-${train.status === 'Active' ? 'success' : 'cancelled'}">${train.status}</span>
                        </div>
                        <h2 style="font-size:1.5rem;font-weight:800;">${train.train_name}</h2>
                        <p style="color:var(--primary);font-weight:600;">${train.train_number}</p>
                        <p style="color:var(--text-muted);margin-top:8px;">Runs on: ${runDays}</p>
                    </div>
                    <div style="text-align:right">
                        <div style="color:var(--text-muted);font-size:0.85rem;">Total Seats</div>
                        <div style="font-size:2rem;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${train.total_seats}</div>
                    </div>
                </div>
            </div>

            <!-- Interactive Booking & Price Calculator Section -->
            <div class="glass-card" style="margin-bottom:24px;border:1px solid rgba(0,242,254,0.3);background:linear-gradient(135deg,rgba(15,23,42,0.8),rgba(15,23,42,0.95));">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
                    <div>
                        <h3 style="font-size:1.25rem;color:var(--accent-cyan);display:flex;align-items:center;gap:8px;">
                            <span>⚡ Book This Train</span>
                            <span class="badge badge-success">Live Fare Calculator</span>
                        </h3>
                        <p style="color:var(--text-muted);font-size:0.85rem;">Select your boarding and destination stops from this train's schedule to see live ticket prices</p>
                    </div>
                    <div id="detailDistBadge" class="badge badge-rac" style="font-size:0.95rem;padding:6px 14px;">
                        📍 ${(destStop.distance_from_origin - originStop.distance_from_origin)} km
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;margin-bottom:20px;">
                    <div class="form-group">
                        <label style="color:var(--text-muted);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Boarding Station</label>
                        <select id="detailFromStation" class="form-input" onchange="updateDetailFareCalculation()" style="background:#0f172a;">
                            ${route.slice(0, -1).map((s, idx) => `<option value="${s.station_id}" data-dist="${s.distance_from_origin}" ${idx === 0 ? 'selected' : ''}>${s.station_name} (${s.station_code})</option>`).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label style="color:var(--text-muted);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Destination Station</label>
                        <select id="detailToStation" class="form-input" onchange="updateDetailFareCalculation()" style="background:#0f172a;">
                            ${route.slice(1).map((s, idx) => `<option value="${s.station_id}" data-dist="${s.distance_from_origin}" ${idx === route.length - 2 ? 'selected' : ''}>${s.station_name} (${s.station_code})</option>`).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label style="color:var(--text-muted);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Journey Date</label>
                        <input type="date" id="detailJourneyDate" class="form-input" value="${todayDate}" min="${todayDate}" style="background:#0f172a;">
                    </div>
                </div>

                <div style="font-size:0.88rem;font-weight:600;margin-bottom:12px;color:var(--accent-emerald);">Select Travel Class & Proceed to Payment:</div>
                <div id="detailClassCardsGrid" class="classes-grid">
                    <!-- Populated by updateDetailFareCalculation() -->
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;" class="train-detail-grid">
                <div class="glass-card">
                    <h3 style="margin-bottom:20px;">Available Classes</h3>
                    ${classes.map(c => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">
                            <div>
                                <span class="class-code">${c.class_code}</span>
                                <span style="margin-left:10px;color:var(--text-muted);font-size:0.9rem;">${c.class_name}</span>
                            </div>
                            <div style="text-align:right">
                                <div style="color:var(--accent);font-weight:700;">₹${c.fare_per_km}/km</div>
                                <div style="color:var(--text-muted);font-size:0.8rem;">${c.total_seats} seats</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="glass-card">
                    <h3 style="margin-bottom:20px;">Route & Stops</h3>
                    <div class="route-timeline">
                        ${route.map((stop, i) => `
                            <div class="route-stop ${i === 0 ? 'origin' : i === route.length - 1 ? 'dest' : ''}">
                                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                                    <div>
                                        <div class="stop-station">${stop.station_name}</div>
                                        <div class="stop-city">${stop.city}, ${stop.state}</div>
                                        <div class="stop-times">
                                            ${stop.arrival_time ? `<span>Arr: ${formatTime(stop.arrival_time)}</span>` : ''}
                                            ${stop.departure_time ? `<span>Dep: ${formatTime(stop.departure_time)}</span>` : ''}
                                            <span>Pf: ${stop.platform_no}</span>
                                        </div>
                                    </div>
                                    <div class="stop-dist">${stop.distance_from_origin} km</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        updateDetailFareCalculation();

        // Add responsive style for train detail grid
        if (window.innerWidth < 768) {
            el.querySelector('.train-detail-grid').style.gridTemplateColumns = '1fr';
        }
    } catch (err) {
        el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error loading train details</h3></div>`;
    }
}

function updateDetailFareCalculation() {
    const fromSelect = document.getElementById('detailFromStation');
    const toSelect = document.getElementById('detailToStation');
    const distBadge = document.getElementById('detailDistBadge');
    const cardsGrid = document.getElementById('detailClassCardsGrid');
    const dateInput = document.getElementById('detailJourneyDate');

    if (!fromSelect || !toSelect || !cardsGrid || !window.currentDetailTrain || !window.currentDetailClasses) return;

    const fromOpt = fromSelect.options[fromSelect.selectedIndex];
    const toOpt = toSelect.options[toSelect.selectedIndex];

    const fromId = parseInt(fromSelect.value);
    const toId = parseInt(toSelect.value);
    const fromDist = parseFloat(fromOpt?.dataset.dist || 0);
    const toDist = parseFloat(toOpt?.dataset.dist || 0);
    const date = dateInput?.value || new Date().toISOString().split('T')[0];

    const dist = Math.max(1, Math.abs(toDist - fromDist));
    if (distBadge) distBadge.textContent = `📍 ${Math.round(dist)} km`;

    const train = window.currentDetailTrain;
    const classes = window.currentDetailClasses;

    currentSearchResultsMap[train.train_id] = { ...train, distance_km: dist, classes };

    cardsGrid.innerHTML = classes.map(c => {
        const fare = Math.max(50, Math.round(c.fare_per_km * dist));
        c.estimated_fare = fare;

        return `
            <div class="class-card" style="cursor:pointer;" onclick="bookTrainClass(${train.train_id}, ${c.class_id}, ${fromId}, ${toId}, '${date}')">
                <div class="class-code">${c.class_code}</div>
                <div class="class-name">${c.class_name}</div>
                <div class="class-fare" style="font-size:1.3rem;font-weight:800;color:var(--accent-cyan);">₹${fare}</div>
                <div class="class-avail" style="margin-top:6px;">✅ ${c.total_seats} Seats Available</div>
                <button class="btn btn-primary btn-sm" style="margin-top:10px;width:100%;">Book Ticket →</button>
            </div>
        `;
    }).join('');
}

// ============================================================
// MY BOOKINGS
// ============================================================
async function loadMyBookings() {
    if (!currentUser) { showPage('login'); return; }
    const el = document.getElementById('myBookingsList');
    el.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading bookings...</p></div>`;

    try {
        const res = await fetch(`${API}/bookings`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        const data = await res.json();
        if (data.success) {
            myBookings = data.bookings;
            filterBookings('all');
        }
    } catch (err) {
        el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Connection Error</h3></div>`;
    }
}

function filterBookings(status) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event?.target?.classList?.add('active');

    const filtered = status === 'all' ? myBookings : myBookings.filter(b => b.status === status);
    const el = document.getElementById('myBookingsList');

    if (!filtered.length) {
        el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🎫</div><h3>No bookings found</h3><p><button class="btn btn-primary" onclick="showPage('search')">Book Now</button></p></div>`;
        return;
    }

    el.innerHTML = filtered.map(b => `
        <div class="booking-card">
            <div class="booking-card-header">
                <div>
                    <div class="booking-pnr">${b.pnr_number}</div>
                    <div class="booking-date">Booked on ${new Date(b.booking_date).toLocaleDateString('en-IN')}</div>
                </div>
                <span class="badge badge-${b.status.toLowerCase()}">${b.status}</span>
            </div>
            <div class="booking-card-body">
                <div class="booking-journey">
                    <div class="booking-station">
                        <div class="sname">${b.from_station}</div>
                        <div class="stime">${b.from_city}</div>
                    </div>
                    <div class="booking-arrow">→</div>
                    <div class="booking-station" style="text-align:right">
                        <div class="sname">${b.to_station}</div>
                        <div class="stime">${b.to_city}</div>
                    </div>
                </div>
                <div class="booking-info">
                    <span class="info-chip">🚂 ${b.train_number} - ${b.train_name}</span>
                    <span class="info-chip">🪑 ${b.class_code}</span>
                    <span class="info-chip">📅 ${formatDate(b.journey_date)}</span>
                    <span class="info-chip">💰 ₹${b.total_fare}</span>
                </div>
                <div class="passengers-list">
                    ${b.passengers.map(p => `
                        <div class="passenger-row">
                            <span style="font-weight:600">${p.name}</span>
                            <span style="color:var(--text-muted)">Age: ${p.age}</span>
                            <span class="badge badge-${p.status?.toLowerCase()}">${p.status || b.status}</span>
                            <span style="color:var(--text-muted)">${p.seat_number || (p.waitlist_number ? 'WL/' + p.waitlist_number : '—')}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="booking-actions">
                    ${b.status !== 'Cancelled' && b.status !== 'Completed' ?
                        `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${b.booking_id},'${b.pnr_number}',${b.total_fare})">Cancel Booking</button>` : ''}
                    <button class="btn btn-outline btn-sm" onclick="checkPnrDirectly('${b.pnr_number}')">View PNR</button>
                </div>
            </div>
        </div>
    `).join('');
}

function checkPnrDirectly(pnr) {
    document.getElementById('pnrInput').value = pnr;
    showPage('pnr');
    checkPnr();
}

async function cancelBooking(bookingId, pnr, fare) {
    const daysLeft = 3; // simplified
    const chargePct = daysLeft >= 48 ? 25 : daysLeft >= 12 ? 50 : 100;
    const charge = Math.round(fare * chargePct / 100);
    const refund = fare - charge;

    if (!confirm(`Cancel booking PNR: ${pnr}?\n\nCancellation charge: ₹${charge} (${chargePct}%)\nRefund amount: ₹${refund}\n\nProceed?`)) return;

    try {
        const res = await fetch(`${API}/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
            body: JSON.stringify({ reason: 'Cancelled by passenger' })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`Booking cancelled. Refund: ₹${data.refund_amount}`, 'success');
            loadMyBookings();
            loadNotificationCount();
        } else {
            showToast(data.message, 'error');
        }
    } catch (err) {
        showToast('Error cancelling booking', 'error');
    }
}

// ============================================================
// PROFILE
// ============================================================
async function loadProfile() {
    if (!currentUser) { showPage('login'); return; }

    try {
        const res = await fetch(`${API}/auth/profile`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        const data = await res.json();
        if (data.success) {
            const u = data.user;
            document.getElementById('profileName').textContent = u.full_name;
            document.getElementById('profileEmail').textContent = u.email;
            document.getElementById('profileRole').textContent = u.role === 'admin' ? 'Administrator' : 'Passenger';
            document.getElementById('profileAvatarLarge').textContent = u.full_name.charAt(0).toUpperCase();
            document.getElementById('profileFullName').value = u.full_name;
            document.getElementById('profilePhone').value = u.phone;
            document.getElementById('profileGender').value = u.gender || 'Male';
            document.getElementById('profileDob').value = u.dob ? u.dob.split('T')[0] : '';
            document.getElementById('profileAddress').value = u.address || '';
        }
    } catch (err) { showToast('Error loading profile', 'error'); }
}

async function updateProfile(e) {
    e.preventDefault();
    try {
        const res = await fetch(`${API}/auth/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
            body: JSON.stringify({
                full_name: document.getElementById('profileFullName').value,
                phone: document.getElementById('profilePhone').value,
                gender: document.getElementById('profileGender').value,
                dob: document.getElementById('profileDob').value,
                address: document.getElementById('profileAddress').value
            })
        });
        const data = await res.json();
        if (data.success) {
            showToast('Profile updated!', 'success');
            currentUser.full_name = document.getElementById('profileFullName').value;
            localStorage.setItem('rr_user', JSON.stringify(currentUser));
            updateNavForUser();
        }
    } catch (err) { showToast('Error updating profile', 'error'); }
}

// ============================================================
// NOTIFICATIONS
// ============================================================
async function loadNotificationCount() {
    if (!currentToken) return;
    try {
        const res = await fetch(`${API}/bookings/user/notifications`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        const data = await res.json();
        if (data.success) {
            const unread = data.notifications.filter(n => !n.is_read).length;
            const badge = document.getElementById('notifBadge');
            badge.textContent = unread;
            badge.style.display = unread > 0 ? 'inline-flex' : 'none';
        }
    } catch (err) { }
}

async function loadNotifications() {
    if (!currentUser) { showPage('login'); return; }
    const el = document.getElementById('notificationsList');
    el.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;

    try {
        const res = await fetch(`${API}/bookings/user/notifications`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        const data = await res.json();
        if (data.success) {
            if (!data.notifications.length) {
                el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔔</div><h3>No notifications</h3></div>`;
                return;
            }
            const icons = { Booking: '🎫', Cancellation: '❌', Update: '📢', Alert: '⚠️', Promo: '🎉' };
            el.innerHTML = data.notifications.map(n => `
                <div class="notif-card ${!n.is_read ? 'unread' : ''}">
                    <div class="notif-icon">${icons[n.type] || '🔔'}</div>
                    <div class="notif-content">
                        <h4>${n.title}</h4>
                        <p>${n.message}</p>
                        <div class="notif-time">${new Date(n.created_at).toLocaleString('en-IN')}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) { el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error loading</h3></div>`; }
}

async function markAllRead() {
    try {
        await fetch(`${API}/bookings/notifications/read-all`, { method: 'PUT', headers: { 'Authorization': `Bearer ${currentToken}` } });
        loadNotifications();
        loadNotificationCount();
        showToast('All marked as read', 'success');
    } catch (err) { }
}

// ============================================================
// MODAL
// ============================================================
function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
}

// ============================================================
// UTILITIES
// ============================================================
function formatTime(time) {
    if (!time) return '--:--';
    if (time.includes('T')) time = time.split('T')[1];
    const parts = time.split(':');
    if (parts.length < 2) return time;
    const h = parseInt(parts[0]);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
}

// API helper with auth
async function apiFetch(url, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
    const res = await fetch(`${API}${url}`, { ...options, headers });
    if (res.status === 401) { logout(); throw new Error('Unauthorized'); }
    return res.json();
}
