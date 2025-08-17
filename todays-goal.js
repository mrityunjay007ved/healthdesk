// Today's Goal Page JavaScript

// Global variables
let currentGoals = [];
let lifestyleGoals = [];
let currentProgress = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Today\'s Goal page...');
    
    // Update welcome message
    updateWelcomeMessage();
    
    // Load today's goals
    loadTodaysGoals();
    
    // Load saved progress
    loadSavedProgress();
    
    console.log('✅ Today\'s Goal page initialized');
});

// Update welcome message with member name
function updateWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.name) {
        const welcomeText = document.querySelector('.welcome-text');
        if (welcomeText) {
            welcomeText.textContent = `Welcome, ${currentUser.name}`;
        }
    }
}

// Get current day of week
function getCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

// Load today's goals from current plan
function loadTodaysGoals() {
    const today = getCurrentDay();
    const dateDisplay = document.getElementById('dateDisplay');
    
    // Update date display
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    
    // Extract goals from current plan
    extractGoalsFromPlan(today);
    
    // Render goals
    renderGoals();
    
    // Update progress
    updateProgress();
}

// Extract goals from the current plan HTML
function extractGoalsFromPlan(dayName) {
    // Get the current plan HTML from localStorage
    const PLAN_KEY = 'elyx_member_plan_v1';
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    let planHTML = '';
    
    if (currentUser && currentUser.email) {
        const store = JSON.parse(localStorage.getItem(PLAN_KEY) || '{}');
        planHTML = store[currentUser.email] || '';
    }
    
    // If no saved plan, use default plan structure
    if (!planHTML) {
        planHTML = getDefaultPlanHTML();
    }
    
    // Parse the plan HTML to extract goals for the specific day
    const parser = new DOMParser();
    const planDoc = parser.parseFromString(planHTML, 'text/html');
    
    // Find the day card for today
    const dayCards = planDoc.querySelectorAll('.day-card');
    let todayCard = null;
    
    for (const card of dayCards) {
        const header = card.querySelector('.day-header h3');
        if (header && header.textContent.includes(dayName)) {
            todayCard = card;
            break;
        }
    }
    
    if (todayCard) {
        // Extract workout goals
        const workoutPhases = todayCard.querySelectorAll('.workout-phase');
        currentGoals = [];
        
        workoutPhases.forEach((phase, index) => {
            const title = phase.querySelector('h4');
            const list = phase.querySelector('ul');
            
            if (title) {
                const goal = {
                    id: `goal-${index}`,
                    title: title.textContent.trim(),
                    description: '',
                    type: 'workout'
                };
                
                if (list) {
                    const items = list.querySelectorAll('li');
                    goal.description = Array.from(items).map(item => item.textContent.trim()).join(', ');
                }
                
                currentGoals.push(goal);
            }
        });
        
        // Extract lifestyle goals
        extractLifestyleGoals(planDoc);
        
        // Update day info
        updateDayInfo(todayCard);
    } else {
        // Handle rest day or no goals
        handleNoGoals(dayName);
    }
}

// Get default plan HTML (fallback)
function getDefaultPlanHTML() {
    return `
        <div class="plan-section">
            <div class="day-card">
                <div class="day-header">
                    <h3><i class="fas fa-dumbbell"></i> Monday – Strength & Core (Gym, 60 min)</h3>
                </div>
                <div class="workout-details">
                    <div class="workout-phase">
                        <h4>Warm-up: 5 min treadmill walk @ brisk pace.</h4>
                    </div>
                    <div class="workout-phase">
                        <h4>Circuit (3 rounds, 10–12 reps each, 60 sec rest between rounds):</h4>
                        <ul>
                            <li>Goblet Squat (dumbbell or kettlebell)</li>
                            <li>Push-ups (knee or full)</li>
                            <li>Seated Row (machine or resistance band)</li>
                            <li>Glute Bridge</li>
                            <li>Plank – 45 sec hold</li>
                        </ul>
                    </div>
                    <div class="workout-phase">
                        <h4>Cool-down: 5 min full-body stretch.</h4>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Extract lifestyle goals
function extractLifestyleGoals(planDoc) {
    const lifestyleSection = planDoc.querySelector('.lifestyle-grid');
    lifestyleGoals = [];
    
    if (lifestyleSection) {
        const lifestyleCards = lifestyleSection.querySelectorAll('.lifestyle-card');
        
        lifestyleCards.forEach((card, index) => {
            const title = card.querySelector('h4');
            const content = card.querySelector('p, ul');
            
            if (title) {
                const goal = {
                    id: `lifestyle-${index}`,
                    title: title.textContent.trim(),
                    description: content ? content.textContent.trim() : '',
                    type: 'lifestyle'
                };
                
                lifestyleGoals.push(goal);
            }
        });
    }
}

// Update day info display
function updateDayInfo(dayCard) {
    const dayTitle = document.getElementById('dayTitle');
    const dayType = document.getElementById('dayType');
    const duration = document.getElementById('duration');
    
    const header = dayCard.querySelector('.day-header h3');
    if (header) {
        const headerText = header.textContent;
        
        // Extract day type and duration
        const typeMatch = headerText.match(/–\s*([^(]+)/);
        const durationMatch = headerText.match(/\(([^)]+)\)/);
        
        if (dayTitle) dayTitle.textContent = headerText;
        if (dayType) dayType.textContent = typeMatch ? typeMatch[1].trim() : 'Workout';
        if (duration) duration.textContent = durationMatch ? durationMatch[1] : '60 min';
    }
}

// Handle no goals (rest day or missing plan)
function handleNoGoals(dayName) {
    const noGoalsMessage = document.getElementById('noGoalsMessage');
    const restDayMessage = document.getElementById('restDayMessage');
    const goalsList = document.getElementById('goalsList');
    
    if (dayName === 'Sunday') {
        // Show rest day message
        if (restDayMessage) restDayMessage.style.display = 'block';
        if (noGoalsMessage) noGoalsMessage.style.display = 'none';
        if (goalsList) goalsList.style.display = 'none';
        
        // Update day info
        const dayTitle = document.getElementById('dayTitle');
        const dayType = document.getElementById('dayType');
        const duration = document.getElementById('duration');
        
        if (dayTitle) dayTitle.textContent = 'Rest Day';
        if (dayType) dayType.textContent = 'Rest';
        if (duration) duration.textContent = 'Full Day';
    } else {
        // Show no goals message
        if (noGoalsMessage) noGoalsMessage.style.display = 'block';
        if (restDayMessage) restDayMessage.style.display = 'none';
        if (goalsList) goalsList.style.display = 'none';
    }
    
    currentGoals = [];
    lifestyleGoals = [];
}

// Render goals
function renderGoals() {
    const goalsList = document.getElementById('goalsList');
    const lifestyleGoalsContainer = document.getElementById('lifestyleGoals');
    
    // Render workout goals
    if (goalsList) {
        goalsList.innerHTML = '';
        
        if (currentGoals.length > 0) {
            currentGoals.forEach(goal => {
                const goalElement = createGoalElement(goal);
                goalsList.appendChild(goalElement);
            });
        }
    }
    
    // Render lifestyle goals
    if (lifestyleGoalsContainer) {
        lifestyleGoalsContainer.innerHTML = '';
        
        if (lifestyleGoals.length > 0) {
            lifestyleGoals.forEach(goal => {
                const goalElement = createLifestyleGoalElement(goal);
                lifestyleGoalsContainer.appendChild(goalElement);
            });
        }
    }
}

// Create goal element
function createGoalElement(goal) {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goal-item';
    goalDiv.dataset.goalId = goal.id;
    
    const isCompleted = currentProgress[goal.id] || false;
    if (isCompleted) {
        goalDiv.classList.add('completed');
    }
    
    goalDiv.innerHTML = `
        <div class="goal-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleGoal('${goal.id}')"></div>
        <div class="goal-content">
            <div class="goal-title">${goal.title}</div>
            ${goal.description ? `<div class="goal-description">${goal.description}</div>` : ''}
        </div>
    `;
    
    return goalDiv;
}

// Create lifestyle goal element
function createLifestyleGoalElement(goal) {
    const goalDiv = document.createElement('div');
    goalDiv.className = 'lifestyle-goal';
    goalDiv.dataset.goalId = goal.id;
    
    const isCompleted = currentProgress[goal.id] || false;
    if (isCompleted) {
        goalDiv.classList.add('completed');
    }
    
    goalDiv.innerHTML = `
        <div class="lifestyle-goal-header">
            <div class="lifestyle-goal-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleGoal('${goal.id}')"></div>
            <div class="lifestyle-goal-title">${goal.title}</div>
        </div>
        ${goal.description ? `<div class="lifestyle-goal-description">${goal.description}</div>` : ''}
    `;
    
    return goalDiv;
}

// Toggle goal completion
function toggleGoal(goalId) {
    currentProgress[goalId] = !currentProgress[goalId];
    
    // Update UI
    const goalElement = document.querySelector(`[data-goal-id="${goalId}"]`);
    const checkbox = goalElement.querySelector('.goal-checkbox, .lifestyle-goal-checkbox');
    
    if (currentProgress[goalId]) {
        goalElement.classList.add('completed');
        checkbox.classList.add('checked');
    } else {
        goalElement.classList.remove('completed');
        checkbox.classList.remove('checked');
    }
    
    // Update progress
    updateProgress();
}

// Update progress display
function updateProgress() {
    const allGoals = [...currentGoals, ...lifestyleGoals];
    const completedGoals = allGoals.filter(goal => currentProgress[goal.id]);
    
    const completedCount = document.getElementById('completedCount');
    const totalCount = document.getElementById('totalCount');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (completedCount) completedCount.textContent = completedGoals.length;
    if (totalCount) totalCount.textContent = allGoals.length;
    
    const percentage = allGoals.length > 0 ? Math.round((completedGoals.length / allGoals.length) * 100) : 0;
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
}

// Load saved progress
function loadSavedProgress() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.email) {
        const today = new Date().toISOString().split('T')[0];
        const progressKey = `todays_goal_progress_${currentUser.email}_${today}`;
        const savedProgress = localStorage.getItem(progressKey);
        
        if (savedProgress) {
            currentProgress = JSON.parse(savedProgress);
        }
    }
}

// Save progress
function saveProgress() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.email) {
        const today = new Date().toISOString().split('T')[0];
        const progressKey = `todays_goal_progress_${currentUser.email}_${today}`;
        
        // Save to localStorage
        localStorage.setItem(progressKey, JSON.stringify(currentProgress));
        
        // Also save to sessionStorage for immediate access
        sessionStorage.setItem(progressKey, JSON.stringify(currentProgress));
        
        // Save to data manager for doctor visibility
        saveProgressToDataManager(currentUser.email, today);
        
        // Show success message
        showSuccessMessage();
        
        console.log('💾 Progress saved:', currentProgress);
    }
}

// Save progress to data manager for doctor visibility
function saveProgressToDataManager(userEmail, date) {
    if (window.dataManager) {
        const progressData = {
            userId: userEmail,
            date: date,
            goals: currentGoals,
            lifestyleGoals: lifestyleGoals,
            progress: currentProgress,
            completedCount: Object.values(currentProgress).filter(Boolean).length,
            totalCount: currentGoals.length + lifestyleGoals.length,
            percentage: Math.round((Object.values(currentProgress).filter(Boolean).length / (currentGoals.length + lifestyleGoals.length)) * 100) || 0,
            savedAt: new Date().toISOString()
        };
        
        // Add to data manager's daily progress tracking
        if (!window.dataManager.data.dailyProgress) {
            window.dataManager.data.dailyProgress = [];
        }
        
        // Remove existing entry for this user and date
        window.dataManager.data.dailyProgress = window.dataManager.data.dailyProgress.filter(
            entry => !(entry.userId === userEmail && entry.date === date)
        );
        
        // Add new entry
        window.dataManager.data.dailyProgress.push(progressData);
        
        // Save data
        window.dataManager.saveData();
    }
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress for today?')) {
        currentProgress = {};
        
        // Update UI
        renderGoals();
        updateProgress();
        
        console.log('🔄 Progress reset');
    }
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'flex';
        
        // Hide after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

// Navigation
function goBack() {
    window.location.href = 'member-dashboard.html';
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

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
`;
document.head.appendChild(style);
