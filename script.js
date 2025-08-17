console.log('Script loaded successfully');

// Test function availability
console.log('showLoginModal available:', typeof window.showLoginModal);

// DOM Elements - will be initialized after DOM loads
let loginModal, modalIcon, modalTitle, modalSubtitle, loginForm, passwordInput, togglePassword;
let isDoctorSignup = false;
let isMemberSignup = false;

// Initialize DOM elements
function initializeElements() {
	loginModal = document.getElementById('loginModal');
	modalIcon = document.getElementById('modalIcon');
	modalTitle = document.getElementById('modalTitle');
	modalSubtitle = document.getElementById('modalSubtitle');
	loginForm = document.getElementById('loginForm');
	passwordInput = document.getElementById('password');
	togglePassword = document.querySelector('.toggle-password');
}

// Show login modal with different content based on user type
window.showLoginModal = function(userType) {
	console.log('showLoginModal called with:', userType);
	
	// Initialize elements if not already done
	if (!loginModal) {
		initializeElements();
	}
	
	if (!loginModal) {
		console.error('Modal not found');
		return;
	}
	
	console.log('Modal found, showing...');
	loginModal.style.display = 'block';
	document.body.style.overflow = 'hidden';
	
	if (userType === 'member') {
		modalIcon.className = 'fas fa-user';
		modalTitle.textContent = 'Member Login';
		modalSubtitle.textContent = 'Access your health portal';
		document.querySelector('.submit-btn').style.background = 'linear-gradient(135deg, #ff8c00, #ff6b35)';
		document.querySelector('.modal-header').style.background = 'linear-gradient(135deg, #ff8c00, #ff6b35)';
		const cf = document.getElementById('doctorConfirmPasswordField');
		if (cf) cf.style.display = 'none';
		isDoctorSignup = false;
		const mcf = document.getElementById('memberConfirmPasswordField');
		if (mcf) mcf.style.display = 'none';
		isMemberSignup = false;
	} else if (userType === 'doctor') {
		modalIcon.className = 'fas fa-user-md';
		modalTitle.textContent = 'Doctor Login';
		modalSubtitle.textContent = 'Access your medical dashboard';
		document.querySelector('.submit-btn').style.background = 'linear-gradient(135deg, #10b981, #059669)';
		document.querySelector('.modal-header').style.background = 'linear-gradient(135deg, #10b981, #059669)';
		const cf = document.getElementById('doctorConfirmPasswordField');
		if (cf) cf.style.display = 'none';
		isDoctorSignup = false;
		const mcf = document.getElementById('memberConfirmPasswordField');
		if (mcf) mcf.style.display = 'none';
		isMemberSignup = false;
	}
};

// Close login modal
window.closeLoginModal = function() {
	loginModal.style.display = 'none';
	document.body.style.overflow = 'auto';
	loginForm.reset();
};

// Toggle password visibility
window.togglePassword = function() {
	const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
	passwordInput.setAttribute('type', type);
	togglePassword.className = type === 'password' ? 'fas fa-eye toggle-password' : 'fas fa-eye-slash toggle-password';
};



// Close modal when clicking outside
window.addEventListener('click', function(e) {
	if (e.target === loginModal) {
		closeLoginModal();
	}
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
	if (e.key === 'Escape' && loginModal.style.display === 'block') {
		closeLoginModal();
	}
});

// Notification system
function showNotification(message, type = 'info') {
	// Remove existing notifications
	const existingNotification = document.querySelector('.notification');
	if (existingNotification) {
		existingNotification.remove();
	}
	
	// Create notification element
	const notification = document.createElement('div');
	notification.className = `notification notification-${type}`;
	notification.innerHTML = `
		<div class="notification-content">
			<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
			<span>${message}</span>
		</div>
		<button class="notification-close" onclick="this.parentElement.remove()">
			<i class="fas fa-times"></i>
		</button>
	`;
	
	// Add styles
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#667eea'};
		color: white;
		padding: 15px 20px;
		border-radius: 10px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		z-index: 3000;
		display: flex;
		align-items: center;
		gap: 15px;
		max-width: 400px;
		animation: slideInRight 0.3s ease;
	`;
	
	// Add animation styles
	const style = document.createElement('style');
	style.textContent = `
		@keyframes slideInRight {
			from { transform: translateX(100%); opacity: 0; }
			to { transform: translateX(0); opacity: 1; }
		}
		.notification-content { display: flex; align-items: center; gap: 10px; flex: 1; }
		.notification-close { background: none; border: none; color: white; cursor: pointer; padding: 5px; border-radius: 50%; transition: background-color 0.3s ease; }
		.notification-close:hover { background: rgba(255,255,255,0.2); }
	`;
	document.head.appendChild(style);
	
	document.body.appendChild(notification);
	
	// Auto remove after 5 seconds
	setTimeout(() => { if (notification.parentElement) notification.remove(); }, 5000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));
		if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
	const header = document.querySelector('.header');
	if (window.scrollY > 100) {
		header.style.background = 'rgba(255, 255, 255, 0.98)';
		header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
	} else {
		header.style.background = 'rgba(255, 255, 255, 0.95)';
		header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
	}
});

// Add hover effects to login cards
document.querySelectorAll('.login-card').forEach(card => {
	card.addEventListener('mouseenter', function() {
		this.style.transform = 'translateY(-10px) scale(1.02)';
	});
	card.addEventListener('mouseleave', function() {
		this.style.transform = 'translateY(0) scale(1)';
	});
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
	// Initialize DOM elements
	initializeElements();
	
	// Add click event listeners to login buttons
	const memberBtn = document.querySelector('.member-btn');
	const doctorBtn = document.querySelector('.doctor-btn');
	if (memberBtn) memberBtn.addEventListener('click', function(){ showLoginModal('member'); });
	if (doctorBtn) doctorBtn.addEventListener('click', function(){ showLoginModal('doctor'); });
	
	// Add form submission listener
	if (loginForm) {
		loginForm.addEventListener('submit', async function(e) {
			e.preventDefault();
			const email = document.getElementById('email').value;
			const password = passwordInput.value;
			const remember = document.getElementById('remember').checked;
			// Show loading state
			const submitBtn = document.querySelector('.submit-btn');
			const originalText = submitBtn.innerHTML;
			submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
			submitBtn.disabled = true;
			try {
				// Get user type from modal title
				const modalTitle = document.getElementById('modalTitle').textContent;
				const userType = modalTitle === 'Member Login' ? 'member' : 'doctor';
				// Doctor signup flow
				if (userType === 'doctor' && isDoctorSignup) {
					const cp = document.getElementById('doctorConfirmPassword').value;
					if (!cp || cp !== password) {
						showNotification('Passwords do not match.', 'error');
						submitBtn.innerHTML = originalText; submitBtn.disabled = false; return;
					}
					const existing = window.dataManager.getUserByEmail(email);
					if (existing) {
						showNotification('Account already exists. Please login.', 'error');
						submitBtn.innerHTML = originalText; submitBtn.disabled = false; return;
					}
					await window.dataManager.addUser({ email, password, userType: 'doctor', name: 'Doctor' });
					showNotification('Signup successful. Please login.', 'success');
					const cf = document.getElementById('doctorConfirmPasswordField'); if (cf) cf.style.display = 'none';
					isDoctorSignup = false;
					submitBtn.innerHTML = originalText; submitBtn.disabled = false; return;
				}
				// Member signup flow
				if (userType === 'member' && isMemberSignup) {
					const cp = document.getElementById('memberConfirmPassword').value;
					if (!cp || cp !== password) {
						showNotification('Passwords do not match.', 'error');
						submitBtn.innerHTML = originalText; submitBtn.disabled = false; return;
					}
					const existing = window.dataManager.getUserByEmail(email);
					if (existing) {
						showNotification('Account already exists. Please login.', 'error');
						submitBtn.innerHTML = originalText; submitBtn.disabled = false; return;
					}
					await window.dataManager.addUser({ email, password, userType: 'member', name: 'Member' });
					showNotification('Signup successful. Please login.', 'success');
					const mcf = document.getElementById('memberConfirmPasswordField'); if (mcf) mcf.style.display = 'none';
					isMemberSignup = false;
					submitBtn.innerHTML = originalText; submitBtn.disabled = false; return;
				}
				// Authenticate using data manager
				const user = await window.dataManager.authenticateUser(email, password, userType);
				if (user) {
					showNotification(`Login successful! Welcome, ${user.name}!`, 'success');
					if (remember) localStorage.setItem('currentUser', JSON.stringify(user));
					else sessionStorage.setItem('currentUser', JSON.stringify(user));
					// Redirect based on user type
					setTimeout(() => {
						if (userType === 'member') window.location.href = 'member-dashboard.html';
						else window.location.href = 'doctor-dashboard.html';
					}, 1200);
				} else {
					showNotification('Invalid email or password. Please try again.', 'error');
					submitBtn.innerHTML = originalText; submitBtn.disabled = false;
				}
			} catch (error) {
				console.error('Login error:', error);
				showNotification('Login failed. Please try again.', 'error');
				submitBtn.innerHTML = originalText; submitBtn.disabled = false;
			}
		});
	}

	// Toggle signup via footer link when in current modal
	const footer = document.querySelector('.modal-footer');
	if (footer) {
		footer.addEventListener('click', function(ev){
			const target = ev.target;
			if (target && target.matches('a[href="#signup"]')) {
				const title = document.getElementById('modalTitle').textContent;
				ev.preventDefault();
				if (title === 'Doctor Login') {
					isDoctorSignup = !isDoctorSignup; isMemberSignup = false;
					const dcf = document.getElementById('doctorConfirmPasswordField'); if (dcf) dcf.style.display = isDoctorSignup ? 'block' : 'none';
					const mcf = document.getElementById('memberConfirmPasswordField'); if (mcf) mcf.style.display = 'none';
					const btn = document.querySelector('.submit-btn span'); if (btn) btn.textContent = isDoctorSignup ? 'Sign Up' : 'Login';
				} else if (title === 'Member Login') {
					isMemberSignup = !isMemberSignup; isDoctorSignup = false;
					const mcf = document.getElementById('memberConfirmPasswordField'); if (mcf) mcf.style.display = isMemberSignup ? 'block' : 'none';
					const dcf = document.getElementById('doctorConfirmPasswordField'); if (dcf) dcf.style.display = 'none';
					const btn = document.querySelector('.submit-btn span'); if (btn) btn.textContent = isMemberSignup ? 'Sign Up' : 'Login';
				}
			}
		});
	}
});

// Add loading animation to page
window.addEventListener('load', function() {
	document.body.style.opacity = '0';
	document.body.style.transition = 'opacity 0.5s ease';
	setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});

// Form validation
function validateEmail(email){
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return re.test(email);
}

document.getElementById('email').addEventListener('blur', function(){
	const email = this.value;
	if (email && !validateEmail(email)) { this.style.borderColor = '#e74c3c'; showNotification('Please enter a valid email address', 'error'); }
	else { this.style.borderColor = '#667eea'; }
});

// Ripple effect
function createRipple(event){
	const button = event.currentTarget; const ripple = document.createElement('span');
	const rect = button.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
	const x = event.clientX - rect.left - size/2; const y = event.clientY - rect.top - size/2;
	ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.6s linear;pointer-events:none;`;
	button.appendChild(ripple); setTimeout(()=>{ ripple.remove(); }, 600);
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple{to{transform:scale(4);opacity:0}} .login-btn,.submit-btn{position:relative;overflow:hidden}`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.login-btn, .submit-btn').forEach(button => { button.addEventListener('click', createRipple); });

// Tooltips
function initTooltips(){
	const tooltipElements = document.querySelectorAll('[data-tooltip]');
	tooltipElements.forEach(element => {
		element.addEventListener('mouseenter', function(){
			const tooltip = document.createElement('div'); tooltip.className = 'tooltip'; tooltip.textContent = this.getAttribute('data-tooltip');
			tooltip.style.cssText = 'position:absolute;background:#333;color:#fff;padding:8px 12px;border-radius:6px;font-size:14px;z-index:1000;pointer-events:none;white-space:nowrap;opacity:0;transition:opacity .3s ease;';
			document.body.appendChild(tooltip);
			const rect = this.getBoundingClientRect(); tooltip.style.left = rect.left + (rect.width/2) - (tooltip.offsetWidth/2) + 'px'; tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
			setTimeout(()=>{ tooltip.style.opacity = '1'; }, 10); this.tooltip = tooltip;
		});
		element.addEventListener('mouseleave', function(){ if (this.tooltip){ this.tooltip.remove(); this.tooltip = null; } });
	});
}

document.addEventListener('DOMContentLoaded', initTooltips);
