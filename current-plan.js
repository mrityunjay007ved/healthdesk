// Current Plan page functionality

function qs(name){ const p = new URLSearchParams(location.search); return p.get(name); }
function getCurrentUser(){ return JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser')); }

const PLAN_KEY = 'elyx_member_plan_v1';
function getStore(){ try{ return JSON.parse(localStorage.getItem(PLAN_KEY))||{}; }catch{ return {}; } }
function setStore(s){ localStorage.setItem(PLAN_KEY, JSON.stringify(s)); }
function patientEmailFromId(id){ if (id==='p1') return 'member@example.com'; return ''; }

function loadSavedPlan(email){ const s=getStore(); return s[email] || null; }
function savePlan(email, htmlContent){ const s=getStore(); s[email]=htmlContent; setStore(s); }

function enableEditing(){
	// Make all plan text blocks contentEditable
	document.querySelectorAll('.plan-content h2, .plan-content h3, .plan-content h4, .plan-content p, .plan-content li').forEach(el=>{ el.setAttribute('contenteditable','true'); el.style.outline='1px dashed #cbd5e1'; });
}
function disableEditing(){
	document.querySelectorAll('[contenteditable="true"]').forEach(el=>{ el.removeAttribute('contenteditable'); el.style.outline='none'; });
}

function logout(){ localStorage.removeItem('currentUser'); sessionStorage.removeItem('currentUser'); location.href='index.html'; }

window.addEventListener('DOMContentLoaded', ()=>{
	const user = getCurrentUser();
	const patientId = qs('patientId');
	let patientEmail = null;
	if (patientId){ patientEmail = patientEmailFromId(patientId); }
	// If saved plan exists for this patient, load it
	if (patientEmail){
		const saved = loadSavedPlan(patientEmail);
		if (saved){
			const container = document.querySelector('.plan-content');
			if (container) container.innerHTML = saved;
		}
	}
	// Doctor can edit when patientId provided
	if (user && user.userType==='doctor' && patientEmail){
		const controls = document.getElementById('planControls'); if (controls) controls.style.display='flex';
		const editBtn = document.getElementById('editPlanBtn');
		const saveBtn = document.getElementById('savePlanBtn');
		const cancelBtn = document.getElementById('cancelPlanBtn');
		let originalHTML = '';
		editBtn.addEventListener('click', ()=>{
			originalHTML = document.querySelector('.plan-content').innerHTML;
			enableEditing();
			saveBtn.style.display='inline-block'; cancelBtn.style.display='inline-block'; editBtn.style.display='none';
		});
		saveBtn.addEventListener('click', ()=>{
			const html = document.querySelector('.plan-content').innerHTML;
			savePlan(patientEmail, html);
			disableEditing();
			saveBtn.style.display='none'; cancelBtn.style.display='none'; editBtn.style.display='inline-block';
			toast('Plan saved');
		});
		cancelBtn.addEventListener('click', ()=>{
			document.querySelector('.plan-content').innerHTML = originalHTML;
			disableEditing();
			saveBtn.style.display='none'; cancelBtn.style.display='none'; editBtn.style.display='inline-block';
		});
	}
});

function toast(msg){ const t=document.createElement('div'); t.textContent=msg; t.style.cssText='position:fixed;bottom:20px;right:20px;background:#667eea;color:#fff;padding:10px 14px;border-radius:8px;z-index:9999;'; document.body.appendChild(t); setTimeout(()=>t.remove(),2000); }
