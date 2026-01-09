/**
 * Hyderabad Hyperlocal PM2.5 Monitoring System - Frontend
 * 
 * BACKEND AUTHORITY PRINCIPLE:
 * - All PM2.5 values, zone IDs, severity levels, and alert status come from backend
 * - Frontend ONLY renders backend responses - no data manipulation or inference
 * - No mock data generation - all data from /pm25-data, /hotspots, /alerts endpoints
 * - Filtering is applied to display, not to modify underlying data
 */

const API_URL = ''; // Relative to same host
let selectedGridId = null;
let previousDataMap = new Map(); // Store previous PM2.5 values for trend indicators

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
}

// Helper: Animate number change
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    if (isNaN(start) || isNaN(end)) {
        obj.textContent = end + (id === 'avg-pm25' ? ' µg/m³' : '');
        return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = (progress * (end - start) + start).toFixed(1);
        obj.textContent = current + (id === 'avg-pm25' ? ' µg/m³' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Global filter access for use by inline script
window.activeCategoryFilter = null;

async function manualRefresh() {
    console.log('[USER] Manual refresh requested');
    const btn = document.querySelector('.refresh-btn');
    if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Loading...';
        btn.disabled = true;
        await updateDashboard(true);
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }, 500);
    } else {
        await updateDashboard(true);
    }
}

async function updateDashboard(forced = false) {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeSpan = document.getElementById('time-span');
    if (timeSpan) timeSpan.textContent = now.toLocaleTimeString(undefined, timeOptions);

    const [gridData, hotspots, alerts] = await Promise.all([
        fetchData('/pm25-data'),
        fetchData('/hotspots'),
        fetchData('/alerts')
    ]);

    const syncEl = document.getElementById('last-sync-time');
    if (syncEl) syncEl.textContent = now.toLocaleTimeString();

    if (gridData) {
        // Calculate average and animate
        const avg = gridData.reduce((acc, curr) => acc + curr.pm25Value, 0) / gridData.length;
        const avgEl = document.getElementById('avg-pm25');
        const currentAvgStr = avgEl ? avgEl.textContent.split(' ')[0] : '0';
        const oldAvg = parseFloat(currentAvgStr) || 0;

        animateValue('avg-pm25', oldAvg, avg, 800);

        renderHeatmap(gridData);
        renderGrid(gridData);

        // Update selected zone if active
        if (selectedGridId) {
            const selectedData = gridData.find(g => g.id === selectedGridId);
            if (selectedData) renderSelectedZone(selectedData);
        }

        // Store current PM2.5 for next cycle's trend calculation
        gridData.forEach(g => previousDataMap.set(g.id, g.pm25Value));
    }

    if (hotspots) renderHotspots(hotspots);
    if (alerts) renderAlerts(alerts);
}

function renderHeatmap(data) {
    const container = document.getElementById('heatmap-container');

    // Sort data properly for grid display: G-row-col format
    // We need to display from top (row 9) to bottom (row 0), left to right
    const sortedData = [...data].sort((a, b) => {
        const [, aRow, aCol] = a.id.split('-').map(Number);
        const [, bRow, bCol] = b.id.split('-').map(Number);

        // Sort by row descending (9 to 0), then by column ascending (0 to 9)
        if (bRow !== aRow) return bRow - aRow;
        return aCol - bCol;
    });

    // Use a DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    sortedData.forEach(grid => {
        const tile = document.createElement('div');
        // Use replaceAll to handle all spaces, not just the first one
        tile.className = `heatmap-tile tile-${grid.category.toLowerCase().replaceAll(' ', '-')}`;
        tile.title = `${grid.name}: ${grid.pm25Value.toFixed(1)} µg/m³`;

        const currentCat = grid.category.trim().toLowerCase();
        const filterCat = window.activeCategoryFilter ? window.activeCategoryFilter.trim().toLowerCase() : null;

        console.log('[HEATMAP RENDER] Grid:', grid.id, 'Category:', currentCat, 'Filter:', filterCat);

        if (filterCat && currentCat !== filterCat) {
            tile.classList.add('hidden');
            console.log('[HEATMAP] Hiding tile:', grid.id);
        }

        if (grid.id === selectedGridId) {
            tile.classList.add('selected');
        }

        tile.onclick = () => {
            selectedGridId = grid.id;
            renderSelectedZone(grid);
            renderHeatmap(data); // Highlight selection

            // Highlight in details view
            const card = document.getElementById(`card-${grid.id}`);
            if (card) {
                document.querySelectorAll('.grid-item').forEach(el => el.classList.remove('active-selection'));
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('active-selection');
            }
        };

        fragment.appendChild(tile);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
}

function getHealthImpact(pm25) {
    if (pm25 <= 30) return t('healthGood') || "Air quality is generally safe (Good)";
    if (pm25 <= 60) return t('healthModerate') || "Prolonged exposure may affect sensitive groups (Moderate)";
    if (pm25 <= 90) return t('healthPoor') || "High risk for children and elderly (Poor)";
    return t('healthVeryPoor') || "Danger: Hazardous air quality for all (Very Poor)";
}

function renderSelectedZone(grid) {
    const container = document.getElementById('selected-zone-view');
    const content = document.getElementById('selected-zone-content');

    container.classList.add('active');

    const healthImpact = getHealthImpact(grid.pm25Value);
    const prevVal = previousDataMap.get(grid.id);
    const trend = (prevVal && prevVal !== grid.pm25Value)
        ? (grid.pm25Value > prevVal ? '<i class="fa-solid fa-arrow-trend-up" style="color: var(--rose-500)"></i>' : '<i class="fa-solid fa-arrow-trend-down" style="color: var(--emerald-500)"></i>')
        : '';

    content.innerHTML = `
        <div class="selected-detail-grid">
            <div class="selected-icon">
                <i class="fa-solid fa-location-dot fa-3x" style="color: var(--indigo-600)"></i>
            </div>
            <div class="selected-main">
                <h2 style="margin: 0; font-size: 1.5rem;">${grid.name}</h2>
                <div style="display: flex; gap: 1rem; align-items: center; margin-top: 0.5rem;">
                    <span class="status cat-${grid.category.toLowerCase().replaceAll(' ', '-')}">${grid.category} ${t('quality')}</span>
                    <span style="color: var(--slate-500); font-size: 0.9rem;">${t('zoneId')}: ${grid.id}</span>
                    ${trend}
                </div>
                <div class="health-indicator">
                    <i class="fa-solid fa-circle-info"></i> ${healthImpact}
                </div>
            </div>
            <div class="selected-stats">
               <div class="selected-main-val">${grid.pm25Value.toFixed(1)} <span style="font-size: 1rem; color: var(--slate-500); font-weight: normal;">µg/m³</span></div>
               <div style="font-size: 0.7rem; color: var(--slate-400); text-align: right; margin-top: 4px;">${t('updated')}: ${new Date().toLocaleTimeString()}</div>
            </div>
        </div>
        <div class="environmental-context">
             <div class="env-item">
                <div class="label">${t('trafficDensity')}</div>
                <div class="value">${grid.trafficIndex}%</div>
                <div class="bar-bg"><div class="bar-fill" style="width: ${grid.trafficIndex}%"></div></div>
             </div>
             <div class="env-item">
                <div class="label">${t('windSpeed')}</div>
                <div class="value"><i class="fa-solid fa-wind"></i> ${grid.windSpeed} km/h</div>
             </div>
             <div class="env-item">
                <div class="label">${t('temperature')}</div>
                <div class="value"><i class="fa-solid fa-temperature-half"></i> ${grid.temperature}°C</div>
             </div>
              <div class="env-item">
                <div class="label">${t('weatherImpact')}</div>
                <div class="value">${grid.weatherInfluence}</div>
             </div>
        </div>
    `;
}

function renderGrid(data) {
    const container = document.getElementById('grid-container');
    const fragment = document.createDocumentFragment();

    data.forEach(grid => {
        const div = document.createElement('div');
        div.id = `card-${grid.id}`;
        // Use replaceAll to handle all spaces
        div.className = `grid-item cat-${grid.category.toLowerCase().replaceAll(' ', '-')}`;

        const currentCat = grid.category.trim().toLowerCase();
        const filterCat = window.activeCategoryFilter ? window.activeCategoryFilter.trim().toLowerCase() : null;

        console.log('[GRID RENDER] Grid:', grid.id, 'Category:', currentCat, 'Filter:', filterCat);

        if (filterCat && currentCat !== filterCat) {
            div.classList.add('hidden');
            console.log('[GRID] Hiding card:', grid.id);
        }

        if (grid.id === selectedGridId) {
            div.classList.add('active-selection');
        }

        const prevVal = previousDataMap.get(grid.id);
        const trendClass = (prevVal && prevVal !== grid.pm25Value)
            ? (grid.pm25Value > prevVal ? 'trend-up' : 'trend-down')
            : '';

        div.innerHTML = `
            <div class="loc-name"><i class="fa-solid fa-location-dot"></i> ${grid.name}</div>
            <div class="pm-val-row">
                <div class="pm-val">
                    <span>${grid.pm25Value.toFixed(1)} <small>µg/m³</small></span>
                    <span class="status-dot"></span>
                </div>
                <div class="pm-trend ${trendClass}">
                    ${trendClass ? (trendClass === 'trend-up' ? '▲' : '▼') : ''}
                </div>
            </div>
            <div class="health-impact-mini">
                <i class="fa-solid fa-circle-info"></i> ${getHealthImpact(grid.pm25Value)}
            </div>
            <div class="weather-row">
                <span><i class="fa-solid fa-wind"></i> ${grid.windSpeed} <small>km/h</small></span>
                <span><i class="fa-solid fa-temperature-half"></i> ${grid.temperature}°C</span>
            </div>
        `;

        div.onclick = () => {
            selectedGridId = grid.id;
            renderSelectedZone(grid);
            renderHeatmap(data);
            document.querySelectorAll('.grid-item').forEach(el => el.classList.remove('active-selection'));
            div.classList.add('active-selection');
            container.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        fragment.appendChild(div);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
}

function renderHotspots(data) {
    const tbody = document.getElementById('hotspot-table-body');
    if (!tbody) {
        console.error("Critical Error: Hotspot table body not found!");
        return;
    }
    tbody.innerHTML = '';

    const filterCat = window.activeCategoryFilter ? window.activeCategoryFilter.trim().toLowerCase() : null;
    const filtered = data.filter(grid => !filterCat || grid.category.trim().toLowerCase() === filterCat);

    console.log('[HOTSPOTS] Total:', data.length, 'Filtered:', filtered.length, 'Filter:', filterCat);

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--slate-400); padding: 2rem;">No hotspots currently match the active filter.</td></tr>';
    } else {
        filtered.forEach(grid => {
            const tr = document.createElement('tr');
            let displayStatus = grid.category;
            if (grid.category === 'Poor' || grid.category === 'Very Poor') {
                displayStatus = `⚠️ ${grid.category} Air Quality`;
            }
            tr.innerHTML = `
                <td>#${grid.id.split('-').slice(1).join('')}</td>
                <td style="font-weight: 600;">${grid.name}</td>
                <td><div class="pm-pill">${grid.pm25Value.toFixed(1)}</div></td>
                <td><span class="status cat-${grid.category.toLowerCase().replaceAll(' ', '-')}">${displayStatus}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    if (data.length > 0) {
        const topOne = filtered.length > 0 ? filtered[0].name : data[0].name;
        document.getElementById('top-hotspot').textContent = topOne;
    }
}

/* --- Actionable Recommendations Engine (Decision-Support) --- */
const RECOMMENDATIONS = {
    POOR: [
        "Issue public advisory for affected zones",
        "Increase on-ground inspection frequency",
        "Restrict heavy vehicle movement in affected areas"
    ],
    VERY_POOR: [
        "Escalate inspection priority to Level 1",
        "Review and halt nearby construction activities",
        "Notify municipal and traffic authorities for road diversion",
        "Issue high-alert notifications to local health centers"
    ]
};

function getRecommendations(pm25Value) {
    let actions = [];
    if (pm25Value > 60) {
        actions = [...RECOMMENDATIONS.POOR];
    }
    if (pm25Value > 90) { // Mapping to your Very Poor category
        actions = [...actions, ...RECOMMENDATIONS.VERY_POOR];
    }
    return actions;
}

function renderAlerts(data) {
    const feed = document.getElementById('alert-feed');
    const countObj = document.getElementById('alert-count');
    const oldCount = parseInt(countObj.textContent) || 0;

    countObj.textContent = data.length;

    if (data.length > oldCount) {
        countObj.classList.add('count-bump');
        setTimeout(() => countObj.classList.remove('count-bump'), 1000);
    }

    if (data.length === 0) {
        feed.innerHTML = '<div class="no-alerts-container"><i class="fa-solid fa-shield-check"></i><p>All clear. System monitoring.</p></div>';
        return;
    }

    feed.innerHTML = '';
    data.forEach(alert => {
        const div = document.createElement('div');
        div.className = 'alert-item animate-in';
        const healthImpact = getHealthImpact(alert.pm25Value);
        const actions = getRecommendations(alert.pm25Value);

        let recommendationsHtml = '';
        if (actions.length > 0) {
            recommendationsHtml = `
                <div class="recommendations-box">
                    <button class="view-actions-btn" onclick="this.nextElementSibling.classList.toggle('active')">
                        <i class="fa-solid fa-list-check"></i> View Suggested Actions
                    </button>
                    <div class="actions-list">
                        <p class="rec-heading">Suggested Actions (Advisory Only):</p>
                        <ul>
                            ${actions.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                        <p class="rec-disclaimer">These are advisory suggestions intended to support regulatory decision-making.</p>
                    </div>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="alert-top">
                <span class="time">${new Date(alert.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                <span class="loc">${alert.gridName}</span>
            </div>
            <div class="alert-body">
                <div class="val">PM2.5: <span>${alert.pm25Value}</span> <small>µg/m³</small></div>
                <div class="health-indicator-alert">
                     <i class="fa-solid fa-triangle-exclamation"></i> ${healthImpact}
                </div>
                ${recommendationsHtml}
            </div>
        `;
        feed.appendChild(div);
    });
}

// Initial update
updateDashboard();

// Auto-refresh every 60 seconds (Simulated Real-time)
setInterval(updateDashboard, 60000);

/* --- Chatbot Logic (Rule-Based) --- */
const FAQ_DATA = {
    "why is air quality poor": "Air quality is categorized as 'Poor' (61-90 µg/m³) or 'Very Poor' (>90 µg/m³) due to factors like high traffic density, industrial emissions, and stagnant air conditions. Our monitoring grid helps identify these zones for regulatory attention.",
    "poor quality": "Air quality is 'Poor' when PM2.5 levels are between 61 and 90 µg/m³.",
    "very poor quality": "Air quality is 'Very Poor' when PM2.5 levels exceed 90 µg/m³, indicating a critical environmental situation.",
    "above 60": "A value above 60 µg/m³ indicates Poor air quality. If it exceeds 90 µg/m³, it is classified as Very Poor.",
    "active alert mean": "An active alert is triggered when a hyperlocal grid records PM2.5 levels in the Poor (61-90) or Very Poor (>90) categories, signaling a need for intervention.",
    "hotspots identified": "Hotspots are identified by analyzing zones that consistently show Very Poor or Poor PM2.5 levels across multiple monitoring cycles.",
    "harmful": "High PM2.5 levels can penetrate deep into the lungs and bloodstream, posing significant risks for children, the elderly, and those with pre-existing respiratory conditions.",
    "what is pm2.5": "PM2.5 refers to fine particulate matter 2.5 micrometers or smaller in diameter. These particles are a key indicator of air pollution and health risk.",
    "pm2.5": "PM2.5 refers to fine particulate matter 2.5 micrometers or smaller in diameter.",
    "precautions": "During Poor or Very Poor air quality, it is recommended to wear N95 masks, use indoor air purifiers, and significantly reduce outdoor activities.",
    "default": "I am an informational assistant for the TGPCB Hyperlocal Monitor. I can help explain air quality categories (Good, Moderate, Poor, Very Poor) and general safety guidance."
};

function toggleChat() {
    const container = document.getElementById('chatbot-container');
    container.classList.toggle('chatbot-expanded');
    container.classList.toggle('chatbot-collapsed');

    if (container.classList.contains('chatbot-expanded')) {
        document.getElementById('chatbot-text-input').focus();
    }
}

function addMessage(text, isUser = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = isUser ? 'user-msg' : 'bot-msg';
    msgDiv.textContent = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function askChatbot(question) {
    if (!question.trim()) return;

    addMessage(question, true);

    const query = question.toLowerCase().trim();
    // Ultra-clean query for matching: remove EVERYTHING except letters and numbers
    const matchQuery = query.replace(/[^a-z0-9]/g, '');

    let response = FAQ_DATA["default"];

    console.log("Chatbot v3 Processing Query:", query);
    console.log("Match Query:", matchQuery);

    // 1. HARD PRIORITY: Check for threshold keywords first (highest priority)
    const thresholdKeywords = ['above60', '60indicate', 'valueabove60', '60value', 'above60ugm3'];
    if (thresholdKeywords.some(tk => matchQuery.includes(tk))) {
        console.log("Threshold priority match triggered.");
        response = FAQ_DATA["above 60 indicate"];
    } else {
        // 2. BACKUP: Longest match first for other FAQs
        const sortedKeys = Object.keys(FAQ_DATA)
            .filter(k => k !== 'default' && k !== 'above 60 indicate' && k !== 'above 60' && k !== 'value above 60')
            .sort((a, b) => b.length - a.length);

        for (const key of sortedKeys) {
            const matchKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (matchQuery.includes(matchKey)) {
                console.log("Standard match found for key:", key);
                response = FAQ_DATA[key];
                break;
            }
        }
    }

    // 3. Safety Fallback for restricted topics
    const restrictedKeywords = ["increase tomorrow", "safe for me", "medicine", "prediction"];
    if (restrictedKeywords.some(keyword => query.includes(keyword))) {
        response = FAQ_DATA["default"];
    }

    // Simulate typing delay
    setTimeout(() => {
        addMessage(response, false);
    }, 500);
}

// Event Listeners for Chatbot
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const input = document.getElementById('chatbot-text-input');

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', () => {
        const text = input.value;
        if (text) {
            askChatbot(text);
            input.value = '';
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = input.value;
            if (text) {
                askChatbot(text);
                input.value = '';
            }
        }
    });
});

/* ========================================
   THEME TOGGLE FUNCTIONALITY
   ======================================== */

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon('dark');
    }
}

// Toggle between light and dark mode
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark ? 'dark' : 'light');

    // Redraw chart with new theme colors
    if (window.cityChart) {
        updateChartTheme();
    }
}

// Update theme icon and text
function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        text.textContent = 'Light';
    } else {
        icon.className = 'fa-solid fa-moon';
        text.textContent = 'Dark';
    }
}

/* ========================================
   HISTORICAL DATA & CHART VISUALIZATION
   ======================================== */

// Store historical data (last 24 hours)
const historicalData = {
    timestamps: [],
    values: [],
    maxDataPoints: 24 // Store 24 hours of data (1 point per hour)
};

// Initialize Chart.js
let cityChart = null;

function initializeChart() {
    const ctx = document.getElementById('cityTrendChart');
    if (!ctx) return;

    const isDark = document.body.classList.contains('dark-mode');

    // Add initial placeholder data if empty
    if (historicalData.timestamps.length === 0) {
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 10 * 60 * 1000); // 10 min intervals
            historicalData.timestamps.push(time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
            historicalData.values.push(45 + Math.random() * 15); // Random values between 45-60
        }
    }

    cityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.timestamps,
            datasets: [{
                label: t('pm25Level') || 'PM2.5 (µg/m³)',
                data: historicalData.values,
                borderColor: isDark ? '#818cf8' : '#4f46e5',
                backgroundColor: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: isDark ? '#818cf8' : '#4f46e5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: isDark ? '#e0e7ff' : '#1e1b4b',
                    bodyColor: isDark ? '#cbd5e1' : '#334155',
                    borderColor: isDark ? '#4f46e5' : '#c7d2fe',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return `PM2.5: ${context.parsed.y.toFixed(1)} µg/m³`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: isDark ? '#94a3b8' : '#64748b',
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: isDark ? '#94a3b8' : '#64748b',
                        font: {
                            size: 11
                        },
                        callback: function (value) {
                            return value + ' µg/m³';
                        }
                    }
                }
            }
        }
    });
}

// Update chart theme colors
function updateChartTheme() {
    if (!cityChart) return;

    const isDark = document.body.classList.contains('dark-mode');

    cityChart.data.datasets[0].borderColor = isDark ? '#818cf8' : '#4f46e5';
    cityChart.data.datasets[0].backgroundColor = isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(79, 70, 229, 0.1)';
    cityChart.data.datasets[0].pointBackgroundColor = isDark ? '#818cf8' : '#4f46e5';

    cityChart.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    cityChart.options.plugins.tooltip.titleColor = isDark ? '#e0e7ff' : '#1e1b4b';
    cityChart.options.plugins.tooltip.bodyColor = isDark ? '#cbd5e1' : '#334155';
    cityChart.options.plugins.tooltip.borderColor = isDark ? '#4f46e5' : '#c7d2fe';

    cityChart.options.scales.x.grid.color = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    cityChart.options.scales.x.ticks.color = isDark ? '#94a3b8' : '#64748b';
    cityChart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    cityChart.options.scales.y.ticks.color = isDark ? '#94a3b8' : '#64748b';

    cityChart.update();
}

// Add data point to historical data
function addHistoricalDataPoint(avgPm25) {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    historicalData.timestamps.push(timeLabel);
    historicalData.values.push(avgPm25);

    // Keep only last 24 data points
    if (historicalData.timestamps.length > historicalData.maxDataPoints) {
        historicalData.timestamps.shift();
        historicalData.values.shift();
    }

    // Update chart
    if (cityChart) {
        cityChart.data.labels = historicalData.timestamps;
        cityChart.data.datasets[0].data = historicalData.values;
        cityChart.update('none'); // Update without animation for smoother experience
    }
}

// Modify the existing updateDashboard function to include historical data
const originalUpdateDashboard = updateDashboard;
updateDashboard = async function (forced = false) {
    await originalUpdateDashboard(forced);

    // Add current average to historical data
    const avgEl = document.getElementById('avg-pm25');
    if (avgEl) {
        const avgText = avgEl.textContent.split(' ')[0];
        const avgValue = parseFloat(avgText);
        if (!isNaN(avgValue)) {
            addHistoricalDataPoint(avgValue);
        }
    }
};

// Initialize theme and chart on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    // Initialize chart after a short delay to ensure DOM is ready
    setTimeout(() => {
        initializeChart();
    }, 500);
});

// Make functions globally available
window.toggleTheme = toggleTheme;
window.changeLanguage = changeLanguage;

/* ========================================
   CHATBOT FUNCTIONS
   ======================================== */

function toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    container.classList.toggle('chatbot-expanded');

    // Focus input when opened
    if (container.classList.contains('chatbot-expanded')) {
        setTimeout(() => {
            document.getElementById('chatbot-text-input').focus();
        }, 300);
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatbot-text-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessageToChat('user', message);
    input.value = '';

    // Simulate thinking delay
    const messagesDiv = document.getElementById('chatbot-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'bot-msg loading';
    loadingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    messagesDiv.appendChild(loadingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Generate response (Simulated based on keywords)
    setTimeout(() => {
        messagesDiv.removeChild(loadingDiv);
        const response = generateChatResponse(message);
        addMessageToChat('bot', response);
    }, 1000 + Math.random() * 1000);
}

function addMessageToChat(sender, text) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function generateChatResponse(input) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('pm2.5') || lowerInput.includes('particulate')) {
        return 'PM2.5 refers to fine particulate matter less than 2.5 micrometers in diameter. These particles can penetrate deep into lung tissue and enter the bloodstream, posing serious health risks including heart and lung disease.';
    }
    if (lowerInput.includes('health') || lowerInput.includes('safe') || lowerInput.includes('danger')) {
        return 'Health impacts depend on PM2.5 levels. Good (0-30) is safe. Moderate (31-60) may affect sensitive groups. Poor (>60) is unhealthy for everyone, and Very Poor (>90) can trigger emergency conditions.';
    }
    if (lowerInput.includes('hyderabad') || lowerInput.includes('city')) {
        return 'Hyderabad air quality varies by zone. High traffic areas like LB Nagar often show higher pollution levels due to vehicular emissions and dust resuspension.';
    }
    if (lowerInput.includes('alert') || lowerInput.includes('warning')) {
        return 'The system generates alerts when a zone stays in the "Very Poor" category (>90 µg/m³) for more than 3 consecutive update cycles. These alerts are sent to regulatory authorities.';
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        return 'Hello! I am the TGPCB Air Quality Assistant. Ask me about PM2.5 levels, health impacts, or specific zones in Hyderabad.';
    }

    return 'I am trained to answer questions about air quality and the monitoring system. Could you try rephrasing your question regarding PM2.5, health impacts, or alerts?';
}

// Make globally available
window.toggleChatbot = toggleChatbot;
window.sendChatMessage = sendChatMessage;

