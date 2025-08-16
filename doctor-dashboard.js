// Doctor dashboard logic

function getCurrentUser(){
	return JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
}

function ensureDoctor(){
	const user = getCurrentUser();
	if (!user || user.userType !== 'doctor'){
		// Auto-login as default doctor for testing
		console.log('⚠️ No doctor login found, auto-logging in for testing...');
		const defaultDoctor = {
			id: 2,
			email: 'doctor@example.com',
			userType: 'doctor',
			name: 'Dr. Jane Smith'
		};
		localStorage.setItem('currentUser', JSON.stringify(defaultDoctor));
		sessionStorage.setItem('currentUser', JSON.stringify(defaultDoctor));
		
		// Show success notification instead of alert
		toast('Auto-logged in as Dr. Jane Smith for testing', 'success');
		console.log('✅ Auto-login successful as Dr. Jane Smith');
		
		// Update header with new user info
		loadDoctorHeader(defaultDoctor);
		
		return defaultDoctor;
	}
	return user;
}

function loadDoctorHeader(user){
	document.getElementById('doctorName').textContent = user.name || 'Doctor';
	document.getElementById('doctorEmail').textContent = user.email || '';
}

const DOCTOR_PROFILE_KEY = 'elyx_doctor_profile_v1';
const PATIENTS_KEY = 'elyx_patients_seed_v1';

function loadDoctorProfile(){
	const user = getCurrentUser();
	const all = JSON.parse(localStorage.getItem(DOCTOR_PROFILE_KEY) || '{}');
	return all[user?.email || 'default'] || {};
}

function saveDoctorProfile(profile){
	const user = getCurrentUser();
	const all = JSON.parse(localStorage.getItem(DOCTOR_PROFILE_KEY) || '{}');
	all[user?.email || 'default'] = profile;
	localStorage.setItem(DOCTOR_PROFILE_KEY, JSON.stringify(all));
}

function seedPatients(){
	// Always refresh patient data to ensure emails are up to date
	const sample = [
		{ id:'p1', name:'John Doe', age:34, email:'member@example.com' },
		{ id:'p2', name:'Alice Johnson', age:29, email:'alice@example.com' },
		{ id:'p3', name:'Michael Smith', age:41, email:'michael@example.com' },
		{ id:'p4', name:'Priya Patel', age:37, email:'priya@example.com' },
		{ id:'p5', name:'Wei Chen', age:46, email:'wei@example.com' }
	];
	localStorage.setItem(PATIENTS_KEY, JSON.stringify(sample));
	console.log('✅ Patient data seeded with emails:', sample);
}

function getPatients(){
	return JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
}

function getPatientById(id){
	return getPatients().find(p=>p.id===id);
}

function renderPatients(list){
	const root = document.getElementById('patientsList');
	root.innerHTML = '';
	list.forEach(p => {
		const card = document.createElement('div');
		card.className = 'patient-card';
		card.innerHTML = `<div class="patient-name">${p.name}</div><div class="patient-age">Age: ${p.age}</div>`;
		card.addEventListener('click', ()=> openPatientModal(p));
		root.appendChild(card);
	});
}

function openPatientModal(patient){
	document.getElementById('patientModalTitle').textContent = patient.name;
	const modal = document.getElementById('patientModal');
	modal.classList.add('show');
	modal.dataset.patientId = patient.id;
}

function closePatientModal(){
	document.getElementById('patientModal').classList.remove('show');
}

function handlePatientAction(action){
	const id = document.getElementById('patientModal').dataset.patientId;
	if (!id) return;
	if (action === 'plan') window.location.href = `current-plan.html?patientId=${encodeURIComponent(id)}`;
	if (action === 'query') alert('Member Current Query - coming soon');
	if (action === 'report') window.location.href = `health-report.html?view=doctor&patientId=${encodeURIComponent(id)}`;
	if (action === 'chat') {
		closePatientModal();
		startConversationWithPatient(id);
	}
}

function openDrawer(){
	document.getElementById('profileDrawer').classList.add('open');
	document.getElementById('drawerBackdrop').classList.add('show');
	// fill form from saved profile
	const p = loadDoctorProfile();
	document.getElementById('docName').value = p.name || '';
	document.getElementById('docDob').value = p.dob || '';
	document.getElementById('docAge').value = p.age || '';
	document.getElementById('docGender').value = p.gender || '';
	document.getElementById('docAbout').value = p.about || '';
}

function closeDrawer(){
	document.getElementById('profileDrawer').classList.remove('open');
	document.getElementById('drawerBackdrop').classList.remove('show');
}

function logout(){
	localStorage.removeItem('currentUser');
	sessionStorage.removeItem('currentUser');
	location.href = 'index.html';
}

// Init
window.addEventListener('DOMContentLoaded', async ()=>{
	const doctor = ensureDoctor();
	if (!doctor) return;
	loadDoctorHeader(doctor);
	seedPatients();
	renderPatients(getPatients());
	
	// Show loading indicator
	showChatStatus('Loading chat system...', 'info');
	
	// Wait for data manager to be ready
	try {
		// Wait for data manager to exist and load
		await waitForDataManager();
		
		console.log('✅ Data manager loaded successfully');
		
		// Initialize chat after data is loaded
		updateUnreadCounter();
		showChatStatus('Chat system ready!', 'success');
		
		// Hide status after 2 seconds
		setTimeout(() => {
			hideChatStatus();
		}, 2000);
		
	} catch (error) {
		console.error('❌ Error loading data manager:', error);
		showChatStatus('Error loading chat system. Please refresh the page.', 'error');
	}
	// search
	document.getElementById('patientSearch').addEventListener('input', (e)=>{
		const q = e.target.value.toLowerCase();
		const filtered = getPatients().filter(p => p.name.toLowerCase().includes(q));
		renderPatients(filtered);
	});
	// drawer
	document.getElementById('openProfile').addEventListener('click', openDrawer);
	document.getElementById('closeProfile').addEventListener('click', closeDrawer);
	document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
	document.getElementById('cancelProfile').addEventListener('click', closeDrawer);
	document.getElementById('doctorProfileForm').addEventListener('submit', (e)=>{
		e.preventDefault();
		const profile = {
			name: document.getElementById('docName').value.trim(),
			dob: document.getElementById('docDob').value,
			age: document.getElementById('docAge').value,
			gender: document.getElementById('docGender').value,
			about: document.getElementById('docAbout').value.trim()
		};
		saveDoctorProfile(profile);
		loadDoctorHeader({ ...getCurrentUser(), name: profile.name || getCurrentUser()?.name });
		closeDrawer();
		toast('Profile updated');
	});
	// modal
	document.getElementById('closePatientModal').addEventListener('click', closePatientModal);
	document.querySelectorAll('.patient-actions .action').forEach(btn=>{
		btn.addEventListener('click', ()=>{
			handlePatientAction(btn.dataset.action);
			closePatientModal();
		});
	});
});

function toast(msg){
	const t = document.createElement('div');
	t.textContent = msg;
	t.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#667eea;color:#fff;padding:10px 14px;border-radius:8px;z-index:9999;';
	document.body.appendChild(t);
	setTimeout(()=> t.remove(), 2000);
}

// ===== CHAT FUNCTIONALITY =====

let currentConversation = null;
let currentPatientInfo = null;
let chatInitialized = false;
let messageContext = 'general';
let messagePriority = 'normal';
let selectedTags = [];

function initializeChat() {
	if (chatInitialized) return;
	
	// Chat event listeners
	document.getElementById('toggleChatBtn')?.addEventListener('click', toggleChatContainer);
	document.getElementById('conversationSearch')?.addEventListener('input', filterConversations);
	document.getElementById('messageInput')?.addEventListener('input', handleMessageInput);
	document.getElementById('messageInput')?.addEventListener('keydown', handleMessageKeydown);
	document.getElementById('sendMessageBtn')?.addEventListener('click', sendMessage);
	
	// Chat action buttons
	document.getElementById('chatSearchBtn')?.addEventListener('click', () => openModal('messageSearchModal'));
	document.getElementById('chatExportBtn')?.addEventListener('click', exportCurrentConversation);
	document.getElementById('closeChatBtn')?.addEventListener('click', () => toggleChatContainer(false));
	
	// Message tools
	document.getElementById('addTagBtn')?.addEventListener('click', () => openModal('messageTagsModal'));
	document.getElementById('markUrgentBtn')?.addEventListener('click', toggleUrgentMessage);
	
	// Modal event listeners
	document.getElementById('closeMessageSearchModal')?.addEventListener('click', () => closeModal('messageSearchModal'));
	document.getElementById('closeMessageTagsModal')?.addEventListener('click', () => closeModal('messageTagsModal'));
	document.getElementById('performSearch')?.addEventListener('click', performMessageSearch);
	document.getElementById('cancelTags')?.addEventListener('click', () => closeModal('messageTagsModal'));
	document.getElementById('applyTags')?.addEventListener('click', applyMessageTags);
	
	// Preset tag clicks
	document.querySelectorAll('.preset-tag').forEach(tag => {
		tag.addEventListener('click', togglePresetTag);
	});
	
	// Real-time message listener (same tab)
	console.log('🎧 Attaching doctor real-time message listener...');
	window.addEventListener('elyxNewMessage', handleRealTimeMessage);
	console.log('✅ Doctor real-time message listener attached');
	
	// Cross-tab message listener
	console.log('📡 Attaching cross-tab message listener...');
	window.addEventListener('storage', handleCrossTabMessage);
	console.log('✅ Cross-tab message listener attached');
	
	// Load conversations and update UI
	loadConversations();
	updateUnreadCounter();
	
	chatInitialized = true;
	console.log('Chat system initialized');
}

function toggleChatContainer(show = null) {
	const container = document.getElementById('chatContainer');
	const isVisible = container.style.display !== 'none';
	
	if (show === null) show = !isVisible;
	
	container.style.display = show ? 'flex' : 'none';
	
	if (show && !chatInitialized) {
		initializeChat();
	}
}

async function loadConversations() {
	const doctor = getCurrentUser();
	if (!doctor) return;
	
	try {
		const conversations = window.dataManager.getConversationsForUser(doctor.id);
		renderConversations(conversations);
		console.log('Loaded conversations:', conversations);
	} catch (error) {
		console.error('Error loading conversations:', error);
		toast('Error loading conversations');
	}
}

function renderConversations(conversations) {
	const container = document.getElementById('conversationsContent');
	if (!container) return;
	
	container.innerHTML = '';
	
	if (conversations.length === 0) {
		container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No conversations yet</div>';
		return;
	}
	
	conversations.forEach(conv => {
		const otherParticipant = conv.otherParticipants[0];
		if (!otherParticipant) return;
		
		const item = document.createElement('div');
		item.className = 'conversation-item';
		if (currentConversation && currentConversation.id === conv.id) {
			item.classList.add('active');
		}
		
		const lastMessagePreview = conv.lastMessage 
			? truncateText(conv.lastMessage.content, 40)
			: 'No messages yet';
		
		const timeAgo = conv.lastMessage 
			? formatTimeAgo(new Date(conv.lastMessage.timestamp))
			: formatTimeAgo(new Date(conv.createdAt));
		
		item.innerHTML = `
			<div class="conversation-avatar">
				${getInitials(otherParticipant.name)}
			</div>
			<div class="conversation-info">
				<div class="conversation-name">${otherParticipant.name}</div>
				<div class="conversation-preview">${lastMessagePreview}</div>
			</div>
			<div class="conversation-meta">
				<div class="conversation-time">${timeAgo}</div>
				${conv.unreadCount > 0 ? `<div class="conversation-unread">${conv.unreadCount}</div>` : ''}
			</div>
		`;
		
		item.addEventListener('click', () => openConversation(conv, otherParticipant));
		container.appendChild(item);
	});
}

function filterConversations() {
	const query = document.getElementById('conversationSearch').value.toLowerCase();
	const items = document.querySelectorAll('.conversation-item');
	
	items.forEach(item => {
		const name = item.querySelector('.conversation-name').textContent.toLowerCase();
		const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
		const matches = name.includes(query) || preview.includes(query);
		item.style.display = matches ? 'flex' : 'none';
	});
}

async function openConversation(conversation, patientInfo) {
	currentConversation = conversation;
	currentPatientInfo = patientInfo;
	
	// Update UI
	updateChatHeader(patientInfo);
	
	// Mark conversation as active
	document.querySelectorAll('.conversation-item').forEach(item => {
		item.classList.remove('active');
	});
	event.currentTarget.classList.add('active');
	
	// Load and display messages
	await loadMessages(conversation.id);
	
	// Mark messages as read
	const doctor = getCurrentUser();
	if (doctor) {
		await window.dataManager.markMessagesAsRead(doctor.id, conversation.id);
		updateUnreadCounter();
		loadConversations(); // Refresh to update unread counts
	}
}

function updateChatHeader(patientInfo) {
	document.getElementById('chatPatientName').textContent = patientInfo.name;
	document.getElementById('chatPatientStatus').textContent = `Patient • ID: ${patientInfo.id}`;
	
	// Show chat input
	document.getElementById('chatInputContainer').style.display = 'block';
}

async function loadMessages(conversationId) {
	try {
		const messages = window.dataManager.getMessagesForConversation(conversationId);
		renderMessages(messages);
		scrollToBottom();
		console.log('Loaded messages:', messages);
	} catch (error) {
		console.error('Error loading messages:', error);
		toast('Error loading messages');
	}
}

function renderMessages(messages) {
	const container = document.getElementById('chatMessages');
	if (!container) return;
	
	container.innerHTML = '';
	
	if (messages.length === 0) {
		container.innerHTML = `
			<div class="chat-welcome">
				<i class="fas fa-comments"></i>
				<h3>Start Conversation</h3>
				<p>Send a message to ${currentPatientInfo ? currentPatientInfo.name : 'this patient'}</p>
			</div>
		`;
		return;
	}
	
	const doctor = getCurrentUser();
	
	messages.forEach(message => {
		const messageEl = document.createElement('div');
		messageEl.className = 'message';
		messageEl.classList.add(message.senderId === doctor.id ? 'sent' : 'received');
		
		if (message.metadata.priority === 'urgent') {
			messageEl.classList.add('priority-urgent');
		} else if (message.metadata.priority === 'high') {
			messageEl.classList.add('priority-high');
		}
		
		const tagsHtml = message.metadata.tags && message.metadata.tags.length > 0
			? `<div class="message-tags">${message.metadata.tags.map(tag => `<span class="message-tag">${tag}</span>`).join('')}</div>`
			: '';
		
		messageEl.innerHTML = `
			<div class="message-bubble">
				<div class="message-content">${escapeHtml(message.content)}</div>
				${tagsHtml}
				<div class="message-meta">
					<span class="message-time">${formatTime(new Date(message.timestamp))}</span>
					<span class="message-context">${message.metadata.context || 'general'}</span>
				</div>
			</div>
		`;
		
		container.appendChild(messageEl);
	});
}

function handleMessageInput() {
	const input = document.getElementById('messageInput');
	const sendBtn = document.getElementById('sendMessageBtn');
	const statusEl = document.getElementById('messageStatus');
	
	const content = input.value.trim();
	sendBtn.disabled = content.length === 0;
	
	// Update character count
	statusEl.textContent = `${content.length}/2000 characters`;
	
	// Auto-resize textarea
	input.style.height = 'auto';
	input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

function handleMessageKeydown(event) {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		sendMessage();
	}
}

async function sendMessage() {
	const input = document.getElementById('messageInput');
	const content = input.value.trim();
	
	if (!content) {
		toast('Please enter a message');
		return;
	}
	
	if (!currentConversation) {
		toast('Please select a conversation first');
		return;
	}
	
	const doctor = ensureDoctor();
	if (!doctor) {
		toast('Unable to initialize doctor session');
		return;
	}
	
	if (!window.dataManager || !window.dataManager.data) {
		toast('Chat system not ready. Please refresh the page.');
		return;
	}
	
	try {
		// Show sending status
		document.getElementById('messageStatus').textContent = 'Sending...';
		document.getElementById('sendMessageBtn').disabled = true;
		
		// Create message metadata
		const metadata = {
			context: messageContext,
			priority: messagePriority,
			tags: [...selectedTags],
			timestamp: new Date().toISOString(),
			doctorNote: true
		};
		
		// Send message
		await window.dataManager.sendMessage(
			doctor.id,
			currentConversation.id,
			content,
			'text',
			metadata
		);
		
		// Clear input and reset state
		input.value = '';
		input.style.height = 'auto';
		resetMessageState();
		
		// Reload messages and conversations
		await loadMessages(currentConversation.id);
		loadConversations();
		updateUnreadCounter();
		
		toast('Message sent successfully');
		
	} catch (error) {
		console.error('Error sending message:', error);
		toast('Error sending message');
	} finally {
		document.getElementById('messageStatus').textContent = '';
		document.getElementById('sendMessageBtn').disabled = false;
	}
}

function resetMessageState() {
	messageContext = 'general';
	messagePriority = 'normal';
	selectedTags = [];
	
	// Reset UI
	document.getElementById('addTagBtn').classList.remove('active');
	document.getElementById('markUrgentBtn').classList.remove('active');
}

async function startConversationWithPatient(patientId) {
	console.log('🚀 Starting conversation with patient:', patientId);
	
	const doctor = getCurrentUser();
	const patient = getPatientById(patientId);
	
	console.log('Doctor:', doctor);
	console.log('Patient:', patient);
	
	if (!doctor) {
		toast('Error: Doctor not logged in');
		return;
	}
	
	if (!patient) {
		toast('Error: Patient information not found');
		console.error('Patient not found for ID:', patientId);
		return;
	}
	
	if (!patient.email) {
		toast('Error: Patient email not configured');
		console.error('Patient has no email:', patient);
		return;
	}
	
	// Ensure data manager is ready
	try {
		showChatStatus('Loading chat data...', 'info');
		await waitForDataManager();
		hideChatStatus();
	} catch (error) {
		console.error('Error ensuring data manager ready:', error);
		toast('Error: Failed to load chat data. Please refresh the page.');
		return;
	}
	
	try {
		// Show chat container
		toggleChatContainer(true);
		
		// Find patient user in data
		console.log('Looking for patient user with email:', patient.email);
		const patientUser = window.dataManager.getUserByEmail(patient.email);
		console.log('Found patient user:', patientUser);
		
		if (!patientUser) {
			toast(`Patient ${patient.name} not found in system`);
			console.error('Patient user not found for email:', patient.email);
			return;
		}
		
		// Get or create conversation
		console.log('Creating conversation between doctor ID:', doctor.id, 'and patient ID:', patientUser.id);
		const conversation = await window.dataManager.getOrCreateConversation(doctor.id, patientUser.id);
		console.log('Conversation created/found:', conversation);
		
		// Create patient info object
		const patientInfo = {
			id: patientUser.id,
			name: patient.name,
			email: patient.email,
			userType: 'member'
		};
		
		// Open conversation
		await openConversation(conversation, patientInfo);
		loadConversations();
		
		toast(`✅ Started conversation with ${patient.name}`);
		console.log('✅ Conversation started successfully');
		
	} catch (error) {
		console.error('❌ Error starting conversation:', error);
		toast(`Error starting conversation: ${error.message}`);
	}
}

function updateUnreadCounter() {
	const doctor = getCurrentUser();
	if (!doctor) return;
	
	try {
		const unreadCount = window.dataManager.getUnreadMessageCount(doctor.id);
		const counter = document.getElementById('unreadCounter');
		
		if (counter) {
			counter.textContent = unreadCount;
			counter.style.display = unreadCount > 0 ? 'flex' : 'none';
		}
	} catch (error) {
		console.error('Error updating unread counter:', error);
	}
}

function handleRealTimeMessage(event) {
	console.log('🔔 Doctor received real-time message event:', event.detail);
	
	const { message, conversation } = event.detail;
	const doctor = getCurrentUser();
	
	console.log('👩‍⚕️ Current doctor:', doctor);
	console.log('💬 Message details:', message);
	console.log('🗨️ Conversation details:', conversation);
	
	if (!doctor || !conversation.participantIds.includes(doctor.id)) {
		console.log('❌ Doctor not in conversation participants, ignoring message');
		return;
	}
	
	console.log('✅ Doctor is in conversation, processing message...');
	
	// Update UI if this is the current conversation
	if (currentConversation && currentConversation.id === conversation.id) {
		console.log('🔄 Updating current conversation messages...');
		loadMessages(conversation.id);
	}
	
	// Update conversations list and counters
	loadConversations();
	updateUnreadCounter();
	
	// Show notification
	showMessageNotification(message);
}

function handleCrossTabMessage(event) {
	// Handle messages from other browser tabs
	if (event.key && event.key.startsWith('elyx_broadcast_')) {
		console.log('🔄 Doctor received cross-tab message:', event);
		
		try {
			const crossTabData = JSON.parse(event.newValue);
			console.log('📨 Cross-tab data:', crossTabData);
			
			if (crossTabData.type === 'elyxNewMessage') {
				// Re-trigger the message event as if it came from same tab
				console.log('🔄 Re-triggering message event from cross-tab...');
				handleRealTimeMessage({ detail: crossTabData.detail });
			}
		} catch (error) {
			console.error('❌ Error parsing cross-tab message:', error);
		}
	}
}

function showMessageNotification(message) {
	if (document.hidden) {
		// Show browser notification if page is not visible
		if (Notification.permission === 'granted') {
			new Notification(`New message from ${message.senderName}`, {
				body: truncateText(message.content, 100),
				icon: '/Elyx.png'
			});
		}
	} else {
		// Show in-app notification
		toast(`New message from ${message.senderName}`);
	}
}

// Modal functions
function openModal(modalId) {
	document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
	document.getElementById(modalId).classList.remove('show');
	
	if (modalId === 'messageTagsModal') {
		// Reset tags modal
		document.getElementById('messageContext').value = 'general';
		document.getElementById('messagePriority').value = 'normal';
		document.getElementById('customTags').value = '';
		document.querySelectorAll('.preset-tag').forEach(tag => tag.classList.remove('selected'));
	}
}

function performMessageSearch() {
	const query = document.getElementById('searchQuery').value.trim();
	if (!query) return;
	
	const doctor = getCurrentUser();
	if (!doctor) return;
	
	try {
		const results = window.dataManager.searchMessages(doctor.id, query, currentConversation?.id);
		renderSearchResults(results);
	} catch (error) {
		console.error('Error searching messages:', error);
		toast('Error searching messages');
	}
}

function renderSearchResults(results) {
	const container = document.getElementById('searchResults');
	if (!container) return;
	
	container.innerHTML = '';
	
	if (results.length === 0) {
		container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No messages found</div>';
		return;
	}
	
	results.forEach(message => {
		const item = document.createElement('div');
		item.className = 'search-result-item';
		
		item.innerHTML = `
			<div class="search-result-content">${escapeHtml(truncateText(message.content, 100))}</div>
			<div class="search-result-meta">
				${message.senderName} • ${formatTime(new Date(message.timestamp))} • ${message.metadata.context}
			</div>
		`;
		
		item.addEventListener('click', () => {
			closeModal('messageSearchModal');
			// Could scroll to message in conversation
		});
		
		container.appendChild(item);
	});
}

function togglePresetTag(event) {
	const tag = event.target;
	const tagValue = tag.dataset.tag;
	
	tag.classList.toggle('selected');
	
	if (tag.classList.contains('selected')) {
		if (!selectedTags.includes(tagValue)) {
			selectedTags.push(tagValue);
		}
	} else {
		selectedTags = selectedTags.filter(t => t !== tagValue);
	}
	
	updateCustomTagsInput();
}

function updateCustomTagsInput() {
	const input = document.getElementById('customTags');
	input.value = selectedTags.join(', ');
}

function applyMessageTags() {
	messageContext = document.getElementById('messageContext').value;
	messagePriority = document.getElementById('messagePriority').value;
	
	// Get custom tags
	const customTagsValue = document.getElementById('customTags').value;
	const customTags = customTagsValue.split(',').map(tag => tag.trim()).filter(tag => tag);
	
	selectedTags = [...new Set([...selectedTags, ...customTags])];
	
	// Update UI
	document.getElementById('addTagBtn').classList.add('active');
	
	closeModal('messageTagsModal');
	toast('Message tags applied');
}

function toggleUrgentMessage() {
	const btn = document.getElementById('markUrgentBtn');
	const isActive = btn.classList.contains('active');
	
	if (isActive) {
		messagePriority = 'normal';
		btn.classList.remove('active');
		toast('Normal priority set');
	} else {
		messagePriority = 'urgent';
		btn.classList.add('active');
		toast('Urgent priority set');
	}
}

async function exportCurrentConversation() {
	if (!currentConversation) {
		toast('No conversation selected');
		return;
	}
	
	try {
		const exportData = window.dataManager.exportConversationForTraining(currentConversation.id);
		
		const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement('a');
		a.href = url;
		a.download = `conversation_${currentConversation.id}_${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		
		toast('Conversation exported successfully');
	} catch (error) {
		console.error('Error exporting conversation:', error);
		toast('Error exporting conversation');
	}
}

// Utility functions
function getInitials(name) {
	return name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
}

function truncateText(text, maxLength) {
	return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
}

function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

function formatTime(date) {
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatTimeAgo(date) {
	const now = new Date();
	const diffMs = now - date;
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);
	
	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString();
}

function scrollToBottom() {
	const container = document.getElementById('chatMessages');
	if (container) {
		setTimeout(() => {
			container.scrollTop = container.scrollHeight;
		}, 100);
	}
}

// Wait for data manager to be available and loaded
async function waitForDataManager(maxWaitTime = 10000) {
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

// Chat status display functions
function showChatStatus(message, type = 'info') {
	let statusEl = document.getElementById('chatStatus');
	if (!statusEl) {
		statusEl = document.createElement('div');
		statusEl.id = 'chatStatus';
		statusEl.style.cssText = `
			position: fixed;
			top: 70px;
			right: 20px;
			padding: 10px 15px;
			border-radius: 8px;
			font-size: 0.9rem;
			font-weight: 500;
			z-index: 1000;
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		`;
		document.body.appendChild(statusEl);
	}
	
	statusEl.textContent = message;
	
	// Set colors based on type
	if (type === 'success') {
		statusEl.style.background = '#d4edda';
		statusEl.style.color = '#155724';
		statusEl.style.border = '1px solid #c3e6cb';
	} else if (type === 'error') {
		statusEl.style.background = '#f8d7da';
		statusEl.style.color = '#721c24';
		statusEl.style.border = '1px solid #f5c6cb';
	} else {
		statusEl.style.background = '#d1ecf1';
		statusEl.style.color = '#0c5460';
		statusEl.style.border = '1px solid #bee5eb';
	}
	
	statusEl.style.display = 'block';
}

function hideChatStatus() {
	const statusEl = document.getElementById('chatStatus');
	if (statusEl) {
		statusEl.style.display = 'none';
	}
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
	Notification.requestPermission();
}
