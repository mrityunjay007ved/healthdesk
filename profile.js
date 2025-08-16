// Profile page functionality
let isEditMode = false;
let originalData = {};

// Get current user from session
function getCurrentUser() {
    // Try to get user from localStorage first (remember me), then sessionStorage
    const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    return user;
}

// Check if user is authenticated
function checkAuthentication() {
    const user = getCurrentUser();
    
    if (!user) {
        // No user session found, redirect to login
        showNotification('Please login to access the profile', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }
    
    // Check if user is a member
    if (user.userType !== 'member') {
        showNotification('Access denied. Member access only.', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }
    
    return true;
}

// Update welcome message with user's name
function updateWelcomeMessage() {
    const user = getCurrentUser();
    const welcomeText = document.querySelector('.welcome-text');
    const userEmail = document.getElementById('userEmail');
    
    if (user) {
        if (user.name && user.name !== 'Unknown User') {
            welcomeText.textContent = `Welcome, ${user.name}`;
        } else {
            // Use email as fallback if name is not available or is default
            const displayName = user.email ? user.email.split('@')[0] : 'Member';
            welcomeText.textContent = `Welcome, ${displayName}`;
        }
        
        if (user.email) {
            userEmail.textContent = user.email;
        }
    } else {
        // Fallback if no user data found
        welcomeText.textContent = 'Welcome, Member';
        userEmail.textContent = '';
    }
}

// Load profile data
function loadProfileData() {
    // For now, we'll use default data
    // In a real application, this would fetch from the database
    const profileData = {
        preferredName: 'John Doe',
        dateOfBirth: '1990-01-15',
        age: '34 years',
        genderIdentity: 'Male',
        primaryResidence: 'New York, NY',
        travelHubs: 'Los Angeles, CA; Chicago, IL; Miami, FL',
        occupation: 'Software Engineer at Tech Corp',
        personalAssistant: 'Sarah Johnson (sarah.j@email.com)'
    };
    
    // Store original data for cancel functionality
    originalData = { ...profileData };
    
    // Update the display
    updateProfileDisplay(profileData);
}

// Update profile display
function updateProfileDisplay(data) {
    document.getElementById('preferredName').textContent = data.preferredName;
    document.getElementById('dateOfBirth').textContent = formatDate(data.dateOfBirth);
    document.getElementById('age').textContent = calculateAge(data.dateOfBirth);
    document.getElementById('genderIdentity').textContent = data.genderIdentity;
    document.getElementById('primaryResidence').textContent = data.primaryResidence;
    document.getElementById('travelHubs').textContent = data.travelHubs;
    document.getElementById('occupation').textContent = data.occupation;
    document.getElementById('personalAssistant').textContent = data.personalAssistant;
    
    // Update input values
    document.getElementById('preferredNameInput').value = data.preferredName;
    document.getElementById('dateOfBirthInput').value = data.dateOfBirth;
    document.getElementById('genderIdentityInput').value = data.genderIdentity;
    document.getElementById('primaryResidenceInput').value = data.primaryResidence;
    document.getElementById('travelHubsInput').value = data.travelHubs;
    document.getElementById('occupationInput').value = data.occupation;
    document.getElementById('personalAssistantInput').value = data.personalAssistant;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Calculate age from date of birth
function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return `${age} years`;
}

// Toggle edit mode
function toggleEditMode() {
    isEditMode = !isEditMode;
    
    const editBtn = document.querySelector('.edit-btn');
    const editActions = document.querySelector('.edit-actions');
    const snapshotGrid = document.querySelector('.snapshot-grid');
    
    if (isEditMode) {
        // Enter edit mode
        editBtn.innerHTML = '<i class="fas fa-eye"></i> View Profile';
        editBtn.style.background = 'linear-gradient(135deg, #95a5a6, #bdc3c7)';
        editActions.style.display = 'flex';
        snapshotGrid.classList.add('edit-mode');
        
        // Show inputs
        showEditInputs();
    } else {
        // Exit edit mode
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
        editBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        editActions.style.display = 'none';
        snapshotGrid.classList.remove('edit-mode');
        
        // Hide inputs
        hideEditInputs();
    }
}

// Show edit inputs
function showEditInputs() {
    const inputs = document.querySelectorAll('.edit-input');
    inputs.forEach(input => {
        input.style.display = 'block';
    });
}

// Hide edit inputs
function hideEditInputs() {
    const inputs = document.querySelectorAll('.edit-input');
    inputs.forEach(input => {
        input.style.display = 'none';
    });
}

// Save profile changes
function saveProfile() {
    // Collect form data
    const profileData = {
        preferredName: document.getElementById('preferredNameInput').value,
        dateOfBirth: document.getElementById('dateOfBirthInput').value,
        genderIdentity: document.getElementById('genderIdentityInput').value,
        primaryResidence: document.getElementById('primaryResidenceInput').value,
        travelHubs: document.getElementById('travelHubsInput').value,
        occupation: document.getElementById('occupationInput').value,
        personalAssistant: document.getElementById('personalAssistantInput').value
    };
    
    // Validate data
    if (!profileData.preferredName.trim()) {
        showNotification('Preferred name is required', 'error');
        return;
    }
    
    if (!profileData.dateOfBirth) {
        showNotification('Date of birth is required', 'error');
        return;
    }
    
    if (!profileData.primaryResidence.trim()) {
        showNotification('Primary residence is required', 'error');
        return;
    }
    
    // Show loading state
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update the display with new data
        updateProfileDisplay(profileData);
        
        // Store original data
        originalData = { ...profileData };
        
        // Exit edit mode
        toggleEditMode();
        
        // Show success message
        showNotification('Profile updated successfully!', 'success');
        
        // Reset button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }, 1500);
}

// Cancel edit mode
function cancelEdit() {
    // Restore original data
    updateProfileDisplay(originalData);
    
    // Exit edit mode
    toggleEditMode();
    
    showNotification('Changes cancelled', 'info');
}

// Logout function
function logout() {
    showNotification('Logging out...', 'info');
    
    // Clear user session
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    setTimeout(() => {
        // Redirect to main page
        window.location.href = 'index.html';
    }, 1500);
}

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
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }
    
    // Update welcome message with user's name
    updateWelcomeMessage();
    
    // Load profile data
    loadProfileData();
    
    // Show welcome notification
    setTimeout(() => {
        const user = getCurrentUser();
        if (user && user.name) {
            showNotification(`Welcome to your profile, ${user.name}!`, 'success');
        } else {
            showNotification('Welcome to your profile!', 'success');
        }
    }, 1000);
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

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .edit-btn, .save-btn, .cancel-btn, .logout-btn, .coming-soon-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.edit-btn, .save-btn, .cancel-btn, .logout-btn, .coming-soon-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
});

// Add loading animation to page
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
