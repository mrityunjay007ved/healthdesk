// Navigation function for dashboard options
function navigateTo(page) {
    // Show loading state
    showNotification('Loading...', 'info');
    
    // Simulate navigation delay
    setTimeout(() => {
        switch(page) {
            case 'profile':
                window.location.href = 'profile.html';
                break;
            case 'weekly-review':
                window.location.href = 'weekly-review.html';
                break;
            case 'current-plan':
                window.location.href = 'current-plan.html';
                break;
            case 'request-appointment':
                window.location.href = 'request-appointment.html';
                break;
            case 'emergency':
                showNotification('Emergency Contact: 911', 'info');
                break;
            case 'prescriptions':
                showNotification('Prescriptions page coming soon!', 'info');
                break;
            case 'test-results':
                showNotification('Test Results page coming soon!', 'info');
                break;
            case 'messages':
                showNotification('Messages page coming soon!', 'info');
                break;
            default:
                showNotification('Page not found!', 'error');
        }
    }, 1000);
}

// Logout function
function logout() {
    showNotification('Logging out...', 'info');
    
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

// Add hover effects to dashboard cards
document.addEventListener('DOMContentLoaded', function() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    
    dashboardCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.card-btn, .action-btn, .logout-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e);
        });
    });
});

// Ripple effect function
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
    
    .card-btn, .action-btn, .logout-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Welcome message on page load
window.addEventListener('load', function() {
    setTimeout(() => {
        showNotification('Welcome to your HealthDesk dashboard!', 'success');
    }, 1000);
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'white';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// ===== CHAT FUNCTIONALITY =====

let chatOpen = false;
let currentMemberConversation = null;
let memberChatInitialized = false;

function getCurrentMember() {
    return JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
}

function toggleChat() {
    const chatInterface = document.getElementById('chatInterface');
    
    // Simple toggle without animations to prevent flickering
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        // Show chat immediately
        chatInterface.style.display = 'block';
        chatInterface.style.opacity = '1';
        chatInterface.style.transform = 'none';
        chatInterface.classList.add('show');
        
        initializeMemberChat();
    } else {
        // Hide chat immediately
        chatInterface.style.display = 'none';
        chatInterface.style.opacity = '1';
        chatInterface.style.transform = 'none';
        chatInterface.classList.remove('show');
    }
}

function initializeMemberChat() {
    if (memberChatInitialized) return;
    
    // Simple initialization without complex guards
    memberChatInitialized = true;
    
    const member = getCurrentMember();
    if (!member || member.userType !== 'member') {
        // Auto-login as default member for testing
        console.log('⚠️ No member login found, auto-logging in for testing...');
        const defaultMember = {
            id: 1,
            email: 'member@example.com',
            userType: 'member',
            name: 'John Doe'
        };
        localStorage.setItem('currentUser', JSON.stringify(defaultMember));
        showNotification('Auto-logged in as John Doe for testing', 'info');
        
        // Update welcome message
        updateMemberWelcome();
        
        // Retry initialization with the auto-login
        setTimeout(() => {
            initializeMemberChat();
        }, 500);
        return;
    }
    
    // Initialize chat event listeners
    document.getElementById('memberMessageInput')?.addEventListener('input', handleMemberMessageInput);
    document.getElementById('memberMessageInput')?.addEventListener('keydown', handleMemberMessageKeydown);
    document.getElementById('sendMemberMessageBtn')?.addEventListener('click', sendMemberMessage);
    
    // Quick question buttons
    document.querySelectorAll('.quick-question-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            document.getElementById('memberMessageInput').value = question;
            handleMemberMessageInput();
        });
    });
    
    // Chat options
    document.getElementById('exportChatBtn')?.addEventListener('click', exportMemberConversation);
    document.getElementById('searchChatBtn')?.addEventListener('click', () => {
        showNotification('Search feature coming soon!', 'info');
    });
    
    // Real-time message listener (same tab)
    console.log('🎧 Attaching member real-time message listener...');
    window.addEventListener('elyxNewMessage', handleMemberRealTimeMessage);
    console.log('✅ Member real-time message listener attached');
    
    // Cross-tab message listener
    console.log('📡 Attaching member cross-tab message listener...');
    window.addEventListener('storage', handleMemberCrossTabMessage);
    console.log('✅ Member cross-tab message listener attached');
    
    // Polling update listener
    console.log('🔄 Attaching member polling update listener...');
    window.addEventListener('elyxPollingUpdate', handleMemberPollingUpdate);
    console.log('✅ Member polling update listener attached');
    
    // Load member chat data
    loadMemberConversation();
    updateMemberUnreadBadge();
    
    console.log('Member chat initialized');
}

async function loadMemberConversation() {
    const member = getCurrentMember();
    if (!member) return;
    
    try {
        console.log('🔄 Loading member conversation for:', member);
        
        // Get member's conversations (should be only one with doctor)
        const conversations = window.dataManager.getConversationsForUser(member.id);
        console.log('📋 Found conversations:', conversations);
        
        if (conversations.length > 0) {
            const conversation = conversations[0]; // Member should only have one conversation with doctor
            currentMemberConversation = conversation;
            console.log('✅ Set current conversation:', conversation);
            
            const doctor = conversation.otherParticipants[0];
            if (doctor) {
                console.log('👩‍⚕️ Doctor info:', doctor);
                updateMemberChatHeader(doctor);
                await loadMemberMessages(conversation.id);
                
                // Mark messages as read
                await window.dataManager.markMessagesAsRead(member.id, conversation.id);
                updateMemberUnreadBadge();
            }
        } else {
            console.log('⚠️ No conversations found, creating new one...');
            // No conversation exists yet, try to create one with the default doctor
            await createConversationWithDoctor();
        }
    } catch (error) {
        console.error('❌ Error loading member conversation:', error);
        showNotification('Error loading chat', 'error');
    }
}

async function createConversationWithDoctor() {
    const member = getCurrentMember();
    if (!member) return;
    
    try {
        // Find doctor user (assuming there's a default doctor)
        const doctorUser = window.dataManager.getUserByEmail('doctor@example.com');
        
        if (!doctorUser) {
            console.log('No doctor found in system');
            return;
        }
        
        // Create conversation
        const conversation = await window.dataManager.getOrCreateConversation(member.id, doctorUser.id);
        currentMemberConversation = conversation;
        
        // Update header
        updateMemberChatHeader({
            id: doctorUser.id,
            name: doctorUser.name,
            email: doctorUser.email,
            userType: 'doctor'
        });
        
        // Load messages (should be empty for new conversation)
        await loadMemberMessages(conversation.id);
        
    } catch (error) {
        console.error('Error creating conversation with doctor:', error);
        showNotification('Error connecting to doctor', 'error');
    }
}

function updateMemberChatHeader(doctor) {
    document.getElementById('chatDoctorName').textContent = doctor.name || 'Dr. Jane Smith';
    
    // Hide quick questions since we have a conversation
    const quickQuestions = document.getElementById('quickQuestions');
    if (quickQuestions) {
        quickQuestions.style.display = 'none';
    }
}

async function loadMemberMessages(conversationId) {
    try {
        console.log('🔄 Loading messages for conversation:', conversationId);
        const messages = window.dataManager.getMessagesForConversation(conversationId);
        console.log('📨 Found messages:', messages);
        
        renderMemberMessages(messages);
        scrollMemberChatToBottom();
        console.log('✅ Messages loaded and rendered successfully');
    } catch (error) {
        console.error('❌ Error loading member messages:', error);
        showNotification('Error loading messages', 'error');
    }
}

function renderMemberMessages(messages) {
    const container = document.getElementById('memberChatMessages');
    if (!container) return;
    
    console.log('🎨 Rendering member messages:', messages);
    
    container.innerHTML = '';
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="chat-welcome">
                <i class="fas fa-stethoscope"></i>
                <h3>Welcome to Doctor Chat</h3>
                <p>Ask questions about your health, medications, or schedule appointments</p>
            </div>
        `;
        
        // Show quick questions if no messages
        const quickQuestions = document.getElementById('quickQuestions');
        if (quickQuestions) {
            quickQuestions.style.display = 'block';
        }
        return;
    }
    
    const member = getCurrentMember();
    console.log('👤 Current member for rendering:', member);
    
    messages.forEach((message, index) => {
        console.log(`📝 Rendering message ${index + 1}:`, message);
        
        const messageEl = document.createElement('div');
        messageEl.className = 'member-message';
        messageEl.classList.add(message.senderId === member.id ? 'sent' : 'received');
        
        const timeStr = formatMemberTime(new Date(message.timestamp));
        const senderLabel = message.senderId === member.id ? 'You' : message.senderName;
        
        let priorityIndicator = '';
        if (message.metadata.priority === 'urgent') {
            priorityIndicator = '<span style="color: #ff4757; font-weight: bold;">🚨 URGENT</span>';
        } else if (message.metadata.priority === 'high') {
            priorityIndicator = '<span style="color: #ffa502; font-weight: bold;">⚠️ HIGH PRIORITY</span>';
        }
        
        const tagsHtml = message.metadata.tags && message.metadata.tags.length > 0
            ? `<div class="message-tags" style="margin-top: 6px;">${message.metadata.tags.map(tag => `<span style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 10px; font-size: 0.7rem; margin-right: 4px;">${tag}</span>`).join('')}</div>`
            : '';
        
        messageEl.innerHTML = `
            <div class="member-message-bubble">
                ${priorityIndicator}
                <div class="member-message-content">${escapeHtml(message.content)}</div>
                ${tagsHtml}
                <div class="member-message-meta">
                    <span>${senderLabel}</span>
                    <span>${timeStr}</span>
                </div>
            </div>
        `;
        
        container.appendChild(messageEl);
        console.log(`✅ Message ${index + 1} rendered:`, senderLabel, message.content.substring(0, 50) + '...');
    });
    
    // Hide quick questions if we have messages
    const quickQuestions = document.getElementById('quickQuestions');
    if (quickQuestions) {
        quickQuestions.style.display = 'none';
    }
    
    console.log(`✅ Total messages rendered: ${messages.length}`);
}

function handleMemberMessageInput() {
    const input = document.getElementById('memberMessageInput');
    const sendBtn = document.getElementById('sendMemberMessageBtn');
    const lengthDisplay = document.getElementById('messageLength');
    
    const content = input.value.trim();
    const length = content.length;
    
    // Update send button state
    sendBtn.disabled = length === 0;
    
    // Update length display
    if (lengthDisplay) {
        lengthDisplay.textContent = `${length}/2000`;
        lengthDisplay.style.color = length > 1800 ? '#ff4757' : '#666';
    }
    
    // Auto-resize textarea
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

function handleMemberMessageKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMemberMessage();
    }
}

async function sendMemberMessage() {
    const input = document.getElementById('memberMessageInput');
    const content = input.value.trim();
    
    if (!content) {
        showNotification('Please enter a message', 'error');
        return;
    }
    
    if (!currentMemberConversation) {
        showNotification('Chat not ready. Please try again.', 'error');
        return;
    }
    
    const member = getCurrentMember();
    if (!member || member.userType !== 'member') {
        showNotification('Please login as a member to send messages', 'error');
        return;
    }
    
    // Ensure data manager is ready
    try {
        await waitForMemberDataManager();
    } catch (error) {
        console.error('Error ensuring data manager ready:', error);
        showNotification('Chat system not ready. Please refresh the page.', 'error');
        return;
    }
    
    try {
        // Show sending state
        const sendBtn = document.getElementById('sendMemberMessageBtn');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Create message metadata
        const metadata = {
            context: 'health_inquiry',
            priority: 'normal',
            tags: ['patient_message'],
            timestamp: new Date().toISOString(),
            memberNote: true
        };
        
        // Send message
        await window.dataManager.sendMessage(
            member.id,
            currentMemberConversation.id,
            content,
            'text',
            metadata
        );
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        handleMemberMessageInput();
        
        // Reload messages
        await loadMemberMessages(currentMemberConversation.id);
        
        showNotification('Message sent to doctor', 'success');
        
        // Update unread badge
        updateMemberUnreadBadge();
        
        // Simulate doctor typing (for demo purposes)
        setTimeout(() => {
            showDoctorTyping();
        }, 2000);
        
    } catch (error) {
        console.error('Error sending member message:', error);
        showNotification('Error sending message', 'error');
    } finally {
        // Reset send button
        const sendBtn = document.getElementById('sendMemberMessageBtn');
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
    }
}

function showDoctorTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        
        // Hide after 3 seconds (simulating doctor stopped typing)
        setTimeout(() => {
            typingIndicator.style.display = 'none';
        }, 3000);
    }
}

function updateMemberUnreadBadge() {
    const member = getCurrentMember();
    if (!member) return;
    
    try {
        const unreadCount = window.dataManager.getUnreadMessageCount(member.id);
        const badge = document.getElementById('chatUnreadBadge');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
            
            // Add click functionality to open chat with unread messages
            if (unreadCount > 0) {
                badge.style.cursor = 'pointer';
                badge.title = `Click to open chat (${unreadCount} unread message${unreadCount > 1 ? 's' : ''})`;
                
                // Remove existing click listener to avoid duplicates
                badge.removeEventListener('click', openMemberChatWithUnread);
                badge.addEventListener('click', openMemberChatWithUnread);
            } else {
                badge.style.cursor = 'default';
                badge.title = '';
                badge.removeEventListener('click', openMemberChatWithUnread);
            }
        }
    } catch (error) {
        console.error('Error updating member unread badge:', error);
    }
}

// Function to open member chat with unread messages
function openMemberChatWithUnread(event) {
    event.stopPropagation(); // Prevent triggering the card click
    
    console.log('🔄 Opening member chat with unread messages...');
    
    const member = getCurrentMember();
    if (!member) return;
    
    try {
        const unreadCount = window.dataManager.getUnreadMessageCount(member.id);
        
        // Open the chat interface
        if (!chatOpen) {
            toggleChat();
        }
        
        // Show notification
        showNotification(`Opening chat with ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`, 'success');
    } catch (error) {
        console.error('Error opening member chat:', error);
        showNotification('Error opening chat', 'error');
    }
}

// Handle polling updates for member
function handleMemberPollingUpdate(event) {
    console.log('🔄 Member received polling update:', event.detail);
    
    const member = getCurrentMember();
    if (!member) return;
    
    try {
        // Check if there are new messages
        const currentConversations = window.dataManager.getConversationsForUser(member.id);
        
        if (currentMemberConversation) {
            // Reload current conversation messages
            loadMemberMessages(currentMemberConversation.id);
        }
        
        // Update unread badge
        updateMemberUnreadBadge();
        
        console.log('✅ Member polling update processed');
    } catch (error) {
        console.error('❌ Error processing member polling update:', error);
    }
}

function handleMemberRealTimeMessage(event) {
    console.log('🔔 Member received real-time message event:', event.detail);
    
    const { message, conversation } = event.detail;
    const member = getCurrentMember();
    
    console.log('👤 Current member:', member);
    console.log('💬 Message details:', message);
    console.log('🗨️ Conversation details:', conversation);
    console.log('🆔 Current conversation ID:', currentMemberConversation?.id);
    
    if (!member) {
        console.log('❌ No member found, ignoring message');
        return;
    }
    
    if (!conversation.participantIds.includes(member.id)) {
        console.log('❌ Member not in conversation participants, ignoring message');
        console.log('Participant IDs:', conversation.participantIds);
        return;
    }
    
    console.log('✅ Member is in conversation, processing message...');
    
    // Update UI if this is the current conversation
    if (currentMemberConversation && currentMemberConversation.id === conversation.id) {
        console.log('🔄 Updating current conversation messages...');
        
        // Reload messages to get the latest
        setTimeout(async () => {
            await loadMemberMessages(conversation.id);
            
            // Mark as read if chat is open
            if (chatOpen) {
                console.log('📖 Chat is open, marking messages as read...');
                await window.dataManager.markMessagesAsRead(member.id, conversation.id);
                updateMemberUnreadBadge();
            }
        }, 500);
    } else {
        console.log('ℹ️ Message for different conversation or no current conversation');
    }
    
    // Update unread badge
    updateMemberUnreadBadge();
    
    // Show notification if message is from doctor
    if (message.senderId !== member.id) {
        console.log('📢 Showing notification for doctor message...');
        showMemberMessageNotification(message);
    } else {
        console.log('ℹ️ Message from current member, no notification needed');
    }
}

function handleMemberCrossTabMessage(event) {
    // Handle messages from other browser tabs
    if (event.key && event.key.startsWith('elyx_broadcast_')) {
        console.log('🔄 Member received cross-tab message:', event);
        
        try {
            const crossTabData = JSON.parse(event.newValue);
            console.log('📨 Member cross-tab data:', crossTabData);
            
            if (crossTabData.type === 'elyxNewMessage') {
                // Re-trigger the message event as if it came from same tab
                console.log('🔄 Re-triggering member message event from cross-tab...');
                setTimeout(() => {
                    handleMemberRealTimeMessage({ detail: crossTabData.detail });
                }, 100);
            }
        } catch (error) {
            console.error('❌ Error parsing member cross-tab message:', error);
        }
    }
}

function showMemberMessageNotification(message) {
    if (document.hidden || !chatOpen) {
        // Show browser notification if page is not visible or chat is closed
        if (Notification.permission === 'granted') {
            new Notification(`New message from ${message.senderName}`, {
                body: truncateText(message.content, 100),
                icon: '/Elyx.png'
            });
        }
    }
    
    // Always show in-app notification
    showNotification(`New message from ${message.senderName}`, 'success');
}

async function exportMemberConversation() {
    if (!currentMemberConversation) {
        showNotification('No conversation to export', 'error');
        return;
    }
    
    try {
        const exportData = window.dataManager.exportConversationForTraining(currentMemberConversation.id);
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `my_conversation_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Conversation exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting member conversation:', error);
        showNotification('Error exporting conversation', 'error');
    }
}

// Utility functions for member chat
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatMemberTime(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
               date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
}

function scrollMemberChatToBottom() {
    const container = document.getElementById('memberChatMessages');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

// Wait for data manager to be available and loaded (member version)
async function waitForMemberDataManager(maxWaitTime = 10000) {
    const startTime = Date.now();
    
    // First wait for window.dataManager to exist
    while (!window.dataManager) {
        if (Date.now() - startTime > maxWaitTime) {
            throw new Error('Timeout waiting for data manager to initialize');
        }
        console.log('⏳ Waiting for data manager to be created...');
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('✅ Data manager found, waiting for data to load...');
    
    // Then wait for data to be loaded
    while (!window.dataManager.isLoaded) {
        if (Date.now() - startTime > maxWaitTime) {
            throw new Error('Timeout waiting for data to load');
        }
        
        try {
            // Try to load data
            await window.dataManager.loadData();
            break;
        } catch (error) {
            console.log('⏳ Retrying data load...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    console.log('✅ Data manager ready with data loaded');
    return window.dataManager;
}

// Update welcome message with member name
function updateMemberWelcome() {
    const member = getCurrentMember();
    if (member) {
        const welcomeText = document.querySelector('.welcome-text');
        if (welcomeText) {
            welcomeText.textContent = `Welcome, ${member.name}`;
        }
        console.log(`✅ Welcome message updated for ${member.name}`);
    }
}

// Initialize member chat when page loads
window.addEventListener('load', async function() {
    console.log('🚀 Initializing member dashboard...');
    
    // Update welcome message first
    updateMemberWelcome();
    
    // Initialize data manager first
    try {
        // Wait for data manager to be ready
        await waitForMemberDataManager();
        
        console.log('✅ Data manager loaded successfully');
        
        // Update unread badge after data is loaded
        updateMemberUnreadBadge();
        
        // Force refresh the page data to ensure we have the latest
        console.log('🔄 Refreshing data to ensure latest messages...');
        await window.dataManager.loadData();
        
        console.log('✅ Member chat system ready');
        
    } catch (error) {
        console.error('❌ Error loading data manager:', error);
        showNotification('Error initializing chat system', 'error');
    }
});

// Request notification permission for member
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Enhanced notification event listeners
window.addEventListener('openConversation', function(event) {
    const { conversationId, messageId } = event.detail;
    console.log('🔄 Opening conversation from notification:', conversationId);
    
    // Open chat if not already open
    if (!chatOpen) {
        toggleChat();
    }
    
    // Load the specific conversation
    if (conversationId && currentMemberConversation?.id === conversationId) {
        loadMemberMessages(conversationId);
        scrollMemberChatToBottom();
    }
});

// Enhanced notification permission request
function requestEnhancedNotifications() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification('Enhanced notifications enabled!', 'success');
                }
            });
        } else if (Notification.permission === 'granted') {
            showNotification('Enhanced notifications are already enabled', 'success');
        }
    }
}

// Auto-request notification permission on first visit
if (!localStorage.getItem('elyx_notification_requested')) {
    setTimeout(() => {
        requestEnhancedNotifications();
        localStorage.setItem('elyx_notification_requested', 'true');
    }, 3000);
}

// Debug function to check data loading
function debugDataLoading() {
    console.log('🔍 DEBUG: Checking data loading...');
    console.log('📊 Data manager:', window.dataManager);
    console.log('📋 Data loaded:', window.dataManager?.data);
    console.log('👥 Users:', window.dataManager?.data?.users);
    console.log('🗨️ Conversations:', window.dataManager?.data?.conversations);
    console.log('📨 Messages:', window.dataManager?.data?.messages);
    
    const member = getCurrentMember();
    console.log('👤 Current member:', member);
    
    if (member && window.dataManager?.data) {
        const conversations = window.dataManager.getConversationsForUser(member.id);
        console.log('💬 Member conversations:', conversations);
        
        if (conversations.length > 0) {
            const messages = window.dataManager.getMessagesForConversation(conversations[0].id);
            console.log('📝 Conversation messages:', messages);
        }
    }
}

    // Run debug after 5 seconds
    setTimeout(debugDataLoading, 5000);
    
    // Start message polling for better synchronization
    if (window.dataManager) {
        window.dataManager.startMessagePolling();
    }

// Current Medications Functions
async function openMemberMedications() {
    const member = getCurrentMember();
    if (!member) {
        showNotification('Member not found', 'error');
        return;
    }
    
    console.log('🔍 Opening medications for member:', member);
    
    // Ensure data manager is loaded
    if (!window.dataManager) {
        showNotification('Loading data...', 'info');
        return;
    }
    
    // Wait for data to be loaded
    try {
        await window.dataManager.loadData();
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error loading medications', 'error');
        return;
    }
    
    console.log('📊 Data manager:', window.dataManager);
    console.log('💊 All medications:', window.dataManager?.data?.medications);
    
    // Load member medications from data manager
    const medications = window.dataManager?.data?.medications?.filter(med => med.patientId === member.id) || [];
    
    console.log('💊 Filtered medications for member ID', member.id, ':', medications);
    
    // Update modal title
    document.getElementById('memberMedicationsTitle').textContent = `Current Medications - ${member.name}`;
    
    // Display medications in the modal
    const medicationsList = document.getElementById('memberMedicationsList');
    
    if (medications.length > 0) {
        medicationsList.innerHTML = `
            <div class="medications-container">
                <div class="medications-list">
                    ${medications.map(med => `
                        <div class="medication-item" style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                            <div class="medication-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <h4 style="margin: 0; color: #333; font-size: 1.2rem;">${med.name}</h4>
                                <span class="medication-status ${med.status}" style="background: ${med.status === 'active' ? '#28a745' : '#dc3545'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">${med.status}</span>
                            </div>
                            <div class="medication-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div>
                                    <p style="margin: 5px 0;"><strong>Dosage:</strong> ${med.dosage}</p>
                                    <p style="margin: 5px 0;"><strong>Frequency:</strong> ${med.frequency}</p>
                                    <p style="margin: 5px 0;"><strong>Start Date:</strong> ${new Date(med.startDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p style="margin: 5px 0;"><strong>Instructions:</strong> ${med.instructions}</p>
                                    ${med.endDate ? `<p style="margin: 5px 0;"><strong>End Date:</strong> ${new Date(med.endDate).toLocaleDateString()}</p>` : ''}
                                    <p style="margin: 5px 0;"><strong>Prescribed By:</strong> ${med.prescribedBy || 'Doctor'}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        medicationsList.innerHTML = `
            <div class="no-medications" style="text-align: center; padding: 40px;">
                <p style="font-size: 1.1rem; color: #666; margin-bottom: 10px;">No medications found for your account.</p>
                <p style="color: #888;">Please contact your doctor to add medications.</p>
            </div>
        `;
    }
    
    // Show the modal
    document.getElementById('memberMedicationsModal').classList.add('show');
    
    console.log('💊 Opened medications modal for member:', member.name);
}

function closeMemberMedicationsModal() {
    document.getElementById('memberMedicationsModal').classList.remove('show');
}

// Function to switch between different users for testing
function switchUser(userId) {
    const users = {
        1: { id: 1, email: 'member@example.com', userType: 'member', name: 'John Doe' },
        3: { id: 3, email: 'alice@example.com', userType: 'member', name: 'Alice Johnson' },
        4: { id: 4, email: 'michael@example.com', userType: 'member', name: 'Michael Smith' },
        5: { id: 5, email: 'priya@example.com', userType: 'member', name: 'Priya Patel' },
        6: { id: 6, email: 'wei@example.com', userType: 'member', name: 'Wei Chen' }
    };
    
    const user = users[userId];
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showNotification(`Switched to ${user.name}`, 'success');
        
        // Update welcome message
        updateMemberWelcome();
        
        // Refresh the page to reload with new user
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else {
        showNotification('User not found', 'error');
    }
}

// Add user switcher buttons to the page for testing
function addUserSwitcher() {
    const switcher = document.createElement('div');
    switcher.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        font-size: 12px;
    `;
    
    switcher.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold;">Switch User (Testing)</div>
        <button onclick="switchUser(1)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">John Doe</button>
        <button onclick="switchUser(3)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Alice Johnson</button>
        <button onclick="switchUser(4)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Michael Smith</button>
        <button onclick="switchUser(5)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Priya Patel</button>
        <button onclick="switchUser(6)" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Wei Chen</button>
    `;
    
    document.body.appendChild(switcher);
}

// User switcher removed - no longer needed for production
