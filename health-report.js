const REPORT_KEY = 'elyx_health_report_v1';

function qs(name){
	const p = new URLSearchParams(location.search); return p.get(name);
}

function getCurrentUser(){
	return JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
}

function getStore(){ try { return JSON.parse(localStorage.getItem(REPORT_KEY)) || {}; } catch{ return {}; } }
function setStore(s){ localStorage.setItem(REPORT_KEY, JSON.stringify(s)); }

function userKeyFromEmail(email){ return email || 'unknown@local'; }

function getReportFor(email){
	const s = getStore();
	return s[userKeyFromEmail(email)] || { restingHr:'', hrv:'', weight:'', sleep:'', notes:'' };
}

function saveReportFor(email, data){
	const s = getStore();
	s[userKeyFromEmail(email)] = data; setStore(s);
}

function logout(){ localStorage.removeItem('currentUser'); sessionStorage.removeItem('currentUser'); location.href='index.html'; }
function goBack(){ history.back(); }

window.addEventListener('DOMContentLoaded', ()=>{
	const view = qs('view'); // 'doctor' -> read-only
	const patientId = qs('patientId');
	let targetEmail = null;
	if (view === 'doctor'){
		const doc = getCurrentUser();
		if (!doc || doc.userType !== 'doctor'){ alert('Doctor access only'); location.href='index.html'; return; }
		// Map patientId to a known email (seeded): only p1 has email in doctor-dashboard.js
		if (patientId === 'p1') targetEmail = 'member@example.com';
		else targetEmail = ''; // unknown
		document.getElementById('modeNote').textContent = 'Read-only member health report';
		document.getElementById('saveBtn').style.display = 'none';
	} else {
		const user = getCurrentUser();
		if (!user || user.userType !== 'member'){ alert('Member access only'); location.href='index.html'; return; }
		targetEmail = user.email;
	}
	const report = getReportFor(targetEmail);
	document.getElementById('restingHr').value = report.restingHr || '';
	document.getElementById('hrv').value = report.hrv || '';
	document.getElementById('weight').value = report.weight || '';
	document.getElementById('sleep').value = report.sleep || '';
	document.getElementById('notes').value = report.notes || '';
	if (view === 'doctor'){
		['restingHr','hrv','weight','sleep','notes'].forEach(id=>{ const el = document.getElementById(id); el.setAttribute('disabled','disabled'); });
	}
	const form = document.getElementById('reportForm');
	form.addEventListener('submit', (e)=>{
		e.preventDefault();
		if (view === 'doctor') return;
		const data = {
			restingHr: document.getElementById('restingHr').value,
			hrv: document.getElementById('hrv').value,
			weight: document.getElementById('weight').value,
			sleep: document.getElementById('sleep').value,
			notes: document.getElementById('notes').value
		};
		saveReportFor(targetEmail, data);
		toast('Report saved');
	});
});

function toast(msg){
	const t = document.createElement('div');
	t.textContent = msg; t.style.cssText='position:fixed;bottom:20px;right:20px;background:#667eea;color:#fff;padding:10px 14px;border-radius:8px;z-index:9999;';
	document.body.appendChild(t); setTimeout(()=>t.remove(), 2000);
}
