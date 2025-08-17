// Request Appointment Page JavaScript

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

document.addEventListener('DOMContentLoaded', function() {
    updateWelcomeMessage();
    renderCalendar();
    addEventListeners();
    
    const today = new Date();
    if (isDateAvailable(today)) {
        selectDate(today);
    }
});

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

function addEventListeners() {
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
        
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('change', validateForm);
            input.addEventListener('input', validateForm);
        });
        
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateForm);
        });
    }
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonthElement) return;
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    calendarGrid.innerHTML = '';
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const date = new Date(currentYear, currentMonth, day);
        
        if (isToday(date)) {
            dayElement.classList.add('today');
        }
        
        if (isDateAvailable(date)) {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(date));
        } else {
            dayElement.classList.add('unavailable');
        }
        
        if (selectedDate && isSameDate(date, selectedDate)) {
            dayElement.classList.add('selected');
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function selectDate(date) {
    selectedDate = date;
    selectedTime = null;
    renderCalendar();
    renderTimeSlots();
    updateAppointmentSummary();
    validateForm();
}

function renderTimeSlots() {
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const selectedDateText = document.getElementById('selectedDateText');
    const noSlotsMessage = document.getElementById('noSlotsMessage');
    
    if (!timeSlotsGrid || !selectedDateText || !noSlotsMessage) return;
    
    if (!selectedDate) {
        selectedDateText.textContent = 'Select a date to view available times';
        timeSlotsGrid.innerHTML = '';
        noSlotsMessage.style.display = 'none';
        return;
    }
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedDateText.textContent = `Available times for ${selectedDate.toLocaleDateString('en-US', dateOptions)}`;
    
    timeSlotsGrid.innerHTML = '';
    
    const dayOfWeek = selectedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
        noSlotsMessage.style.display = 'block';
        timeSlotsGrid.style.display = 'none';
        return;
    }
    
    noSlotsMessage.style.display = 'none';
    timeSlotsGrid.style.display = 'grid';
    
    availableTimeSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = formatTimeDisplay(time);
        
        const isAvailable = Math.random() > 0.3;
        
        if (isAvailable) {
            timeSlot.addEventListener('click', () => selectTimeSlot(time, timeSlot));
        } else {
            timeSlot.classList.add('unavailable');
        }
        
        if (selectedTime === time) {
            timeSlot.classList.add('selected');
        }
        
        timeSlotsGrid.appendChild(timeSlot);
    });
}

function selectTimeSlot(time, element) {
    const previousSelected = document.querySelector('.time-slot.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    selectedTime = time;
    element.classList.add('selected');
    updateAppointmentSummary();
    validateForm();
}

function isToday(date) {
    const today = new Date();
    return isSameDate(date, today);
}

function isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function isDateAvailable(date) {
    if (date < new Date().setHours(0, 0, 0, 0)) {
        return false;
    }
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
    }
    
    return true;
}

function formatTimeDisplay(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function validateForm() {
    const form = document.getElementById('appointmentForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form || !submitBtn) return;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
            }
        } else if (field.type === 'radio') {
            const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
            const checked = Array.from(radioGroup).some(radio => radio.checked);
            if (!checked) {
                isValid = false;
            }
        } else {
            if (!field.value.trim()) {
                isValid = false;
            }
        }
    });
    
    if (!selectedDate || !selectedTime) {
        isValid = false;
    }
    
    submitBtn.disabled = !isValid;
    return isValid;
}

function updateAppointmentSummary() {
    const summary = document.getElementById('appointmentSummary');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryType = document.getElementById('summaryType');
    const summaryDoctor = document.getElementById('summaryDoctor');
    
    if (!summary || !selectedDate) return;
    
    if (summaryDate) {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        summaryDate.textContent = selectedDate.toLocaleDateString('en-US', dateOptions);
    }
    
    if (summaryTime) {
        summaryTime.textContent = formatTimeDisplay(selectedTime);
    }
    
    if (summaryType) {
        const typeSelect = document.getElementById('appointmentType');
        summaryType.textContent = typeSelect.value ? typeSelect.options[typeSelect.selectedIndex].text : '-';
    }
    
    if (summaryDoctor) {
        const doctorSelect = document.getElementById('preferredDoctor');
        summaryDoctor.textContent = doctorSelect.value ? doctorSelect.options[doctorSelect.selectedIndex].text : '-';
    }
    
    summary.style.display = 'block';
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const formData = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        type: document.getElementById('appointmentType').value,
        doctor: document.getElementById('preferredDoctor').value,
        reason: document.getElementById('appointmentReason').value,
        urgency: document.getElementById('urgencyLevel').value,
        phone: document.getElementById('contactPhone').value,
        contactMethod: document.querySelector('input[name="contactMethod"]:checked').value,
        insurance: document.getElementById('insuranceCheck').checked,
        terms: document.getElementById('termsCheck').checked,
        requestId: generateRequestId(),
        submittedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    saveAppointmentRequest(formData);
    showSuccessModal(formData);
}

function saveAppointmentRequest(requestData) {
    const existingRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]');
    existingRequests.push(requestData);
    localStorage.setItem('appointmentRequests', JSON.stringify(existingRequests));
    sessionStorage.setItem('appointmentRequests', JSON.stringify(existingRequests));
}

function generateRequestId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `APT-${timestamp}-${random}`;
}

function showSuccessModal(requestData) {
    const modal = document.getElementById('successModal');
    const requestId = document.getElementById('requestId');
    const modalDate = document.getElementById('modalDate');
    const modalTime = document.getElementById('modalTime');
    const modalType = document.getElementById('modalType');
    
    if (!modal) return;
    
    if (requestId) requestId.textContent = requestData.requestId;
    if (modalDate) {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        modalDate.textContent = new Date(requestData.date).toLocaleDateString('en-US', dateOptions);
    }
    if (modalTime) modalTime.textContent = formatTimeDisplay(requestData.time);
    if (modalType) {
        const typeSelect = document.getElementById('appointmentType');
        modalType.textContent = typeSelect.options[typeSelect.selectedIndex].text;
    }
    
    modal.classList.add('show');
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
        resetForm();
        setTimeout(() => {
            window.location.href = 'member-dashboard.html';
        }, 1000);
    }
}

function resetForm() {
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.reset();
    }
    
    selectedDate = null;
    selectedTime = null;
    
    renderCalendar();
    renderTimeSlots();
    
    const summary = document.getElementById('appointmentSummary');
    if (summary) {
        summary.style.display = 'none';
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
    }
}

function goBack() {
    window.location.href = 'member-dashboard.html';
}

function showTerms() {
    alert('Terms and Conditions:\n\n1. All appointments are subject to doctor availability\n2. Cancellations must be made 24 hours in advance\n3. Insurance information must be accurate\n4. Emergency appointments may have different protocols\n5. Patient confidentiality is maintained at all times');
}

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
