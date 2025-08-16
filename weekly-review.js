// Weekly Review functionality

const STORAGE_KEY = 'elyx_weekly_progress_v1';

function getCurrentUser() {
	return JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
}

function getUserKey() {
	const user = getCurrentUser();
	return user && user.email ? user.email : 'guest';
}

function getWeekId(selectorValue = 'current') {
	const now = new Date();
	const monday = new Date(now);
	const day = (now.getDay() + 6) % 7; // 0 = Monday
	monday.setDate(now.getDate() - day);
	monday.setHours(0,0,0,0);
	if (selectorValue === 'previous') monday.setDate(monday.getDate() - 7);
	if (selectorValue === 'two-weeks-ago') monday.setDate(monday.getDate() - 14);
	const y = monday.getFullYear();
	const w = Math.ceil((((monday - new Date(y,0,1)) / 86400000) + new Date(y,0,1).getDay()+1)/7);
	return `${y}-W${String(w).padStart(2,'0')}`;
}

function loadStore() {
	try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

function saveStore(store) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getWeekData(weekId) {
	const store = loadStore();
	const userKey = getUserKey();
	store[userKey] = store[userKey] || {};
	store[userKey][weekId] = store[userKey][weekId] || {
		completed: { mon:false,tue:false,wed:false,thu:false,fri:false,sat:false,sun:false },
		comments: { mon:'',tue:'',wed:'',thu:'',fri:'',sat:'',sun:'' },
		reflection: { highlight:'', challenge:'', improvement:'', energy:null }
	};
	return store[userKey][weekId];
}

function setWeekData(weekId, data) {
	const store = loadStore();
	const userKey = getUserKey();
	store[userKey] = store[userKey] || {};
	store[userKey][weekId] = data;
	saveStore(store);
}

function mapIdsToKeys() {
	return {
		'monday': 'mon', 'tuesday': 'tue', 'wednesday': 'wed',
		'thursday': 'thu', 'friday': 'fri', 'saturday': 'sat', 'sunday': 'sun'
	};
}

function bindEnergyRating(current) {
	const buttons = document.querySelectorAll('.rating-btn');
	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			buttons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			document.getElementById('energy-rating-display').textContent = btn.dataset.rating;
			current.reflection.energy = Number(btn.dataset.rating);
			saveCurrentWeek(current);
		});
	});
}

function syncUIFromData(current) {
	const idMap = mapIdsToKeys();
	Object.entries(idMap).forEach(([dayId, key]) => {
		const chk = document.getElementById(`${dayId}-complete`);
		const txt = document.getElementById(`${dayId}-comment`);
		if (chk) chk.checked = !!current.completed[key];
		if (txt) txt.value = current.comments[key] || '';
	});
	document.getElementById('weekly-highlight').value = current.reflection.highlight || '';
	document.getElementById('weekly-challenge').value = current.reflection.challenge || '';
	document.getElementById('weekly-improvement').value = current.reflection.improvement || '';
	const display = document.getElementById('energy-rating-display');
	if (current.reflection.energy) {
		display.textContent = current.reflection.energy;
		document.querySelectorAll('.rating-btn').forEach(b => {
			if (Number(b.dataset.rating) === current.reflection.energy) b.classList.add('active');
		});
	} else {
		display.textContent = 'Not rated';
	}
	computeSummary(current);
}

function computeSummary(current) {
	const minutes = {mon:60,tue:30,wed:45,thu:35,fri:60,sat:30,sun:0};
	const totalDays = 7;
	const doneKeys = Object.keys(current.completed).filter(k => current.completed[k]);
	const completedCount = doneKeys.length;
	const totalMinutes = doneKeys.reduce((acc, k) => acc + (minutes[k]||0), 0);
	const completionRate = Math.round((completedCount/totalDays)*100);
	// Simple score: workouts*10 + energy bonus
	const weeklyScore = completedCount*10 + (current.reflection.energy || 0);
	document.getElementById('completedWorkouts').textContent = completedCount;
	document.getElementById('completionRate').textContent = `${completionRate}%`;
	document.getElementById('totalMinutes').textContent = totalMinutes;
	document.getElementById('weeklyScore').textContent = weeklyScore;
	// Goals progress
	const habitTarget = 5;
	const habit = Math.min(completedCount, habitTarget);
	setProgress('habit', habit, habitTarget);
	const cardio = (current.completed.tue?1:0) + (current.completed.thu?1:0);
	setProgress('cardio', cardio, 2);
	const mobility = current.completed.wed?1:0;
	setProgress('mobility', mobility, 1);
	// Metrics – naive count based on comments presence Mon-Thu as proxy (can be refined)
	const metrics = ['mon','tue','wed','thu'].reduce((acc,k)=> acc + (current.comments[k]?.trim()?1:0), 0);
	setProgress('metrics', metrics, 4);
}

function setProgress(prefix, value, max) {
	const pct = Math.round((value/max)*100);
	document.getElementById(`${prefix}-progress`).style.width = `${pct}%`;
	document.getElementById(`${prefix}-text`).textContent = `${value}/${max}`;
}

function saveCurrentWeek(current) {
	const weekId = getWeekId(document.getElementById('weekSelect').value);
	setWeekData(weekId, current);
}

function updateProgress() {
	const current = getCurrentWeekData();
	const idMap = mapIdsToKeys();
	Object.entries(idMap).forEach(([dayId, key]) => {
		const chk = document.getElementById(`${dayId}-complete`);
		if (chk) current.completed[key] = chk.checked;
		const txt = document.getElementById(`${dayId}-comment`);
		if (txt) current.comments[key] = txt.value;
	});
	current.reflection.highlight = document.getElementById('weekly-highlight').value;
	current.reflection.challenge = document.getElementById('weekly-challenge').value;
	current.reflection.improvement = document.getElementById('weekly-improvement').value;
	saveCurrentWeek(current);
	syncUIFromData(current);
}

function saveWeeklyProgress() {
	const btn = document.querySelector('.save-btn');
	const original = btn.innerHTML;
	btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
	btn.disabled = true;
	setTimeout(() => {
		updateProgress();
		btn.innerHTML = original;
		btn.disabled = false;
		showNotification('Weekly progress saved!', 'success');
	}, 700);
}

function loadWeekData() {
	const current = getCurrentWeekData();
	syncUIFromData(current);
}

function getCurrentWeekData() {
	const weekId = getWeekId(document.getElementById('weekSelect').value);
	return getWeekData(weekId);
}

function updateWelcomeHeader() {
	const user = getCurrentUser();
	const welcomeText = document.querySelector('.welcome-text');
	const userEmail = document.getElementById('userEmail');
	if (user) {
		welcomeText.textContent = `Welcome, ${user.name || user.email.split('@')[0] || 'Member'}`;
		if (user.email) userEmail.textContent = user.email;
	}
}

function showNotification(message, type = 'info') {
	const existing = document.querySelector('.notification');
	if (existing) existing.remove();
	const el = document.createElement('div');
	el.className = `notification notification-${type}`;
	el.textContent = message;
	el.style.cssText = 'position:fixed;top:20px;right:20px;padding:12px 16px;color:#fff;border-radius:8px;background:' + (type==='success'?'#27ae60':type==='error'?'#e74c3c':'#667eea') + ';z-index:3000;';
	document.body.appendChild(el);
	setTimeout(()=>{ el.remove(); }, 3000);
}

// Init
window.addEventListener('DOMContentLoaded', () => {
	// auth gate
	const user = getCurrentUser();
	if (!user || user.userType !== 'member') {
		showNotification('Please login as member', 'error');
		setTimeout(()=> location.href='index.html', 1200);
		return;
	}
	updateWelcomeHeader();
	bindEnergyRating(getCurrentWeekData());
	loadWeekData();
	// bind live updates
	document.querySelectorAll('textarea').forEach(t => t.addEventListener('blur', updateProgress));
	document.getElementById('weekSelect').addEventListener('change', loadWeekData);
});

// Logout
function logout(){
	localStorage.removeItem('currentUser');
	sessionStorage.removeItem('currentUser');
	location.href='index.html';
}
