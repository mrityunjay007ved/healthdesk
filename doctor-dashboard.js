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
	if (action === 'report') window.location.href = `health-report.html?view=doctor&patientId=${encodeURIComponent(id)}`;
	if (action === 'chat') {
		closePatientModal();
		startConversationWithPatient(id);
	}
	if (action === 'medications') {
		closePatientModal();
		openMedicationsModal(id);
	}
	if (action === 'daily-progress') {
		closePatientModal();
		openDailyProgressModal(id);
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
		
		// Force refresh the page data to ensure we have the latest
		console.log('🔄 Refreshing data to ensure latest messages...');
		await window.dataManager.loadData();
		
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
	
	// Polling update listener
	console.log('🔄 Attaching doctor polling update listener...');
	window.addEventListener('elyxPollingUpdate', handleDoctorPollingUpdate);
	console.log('✅ Doctor polling update listener attached');
	
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
	
	// Simple toggle without animations to prevent flickering
	container.style.display = show ? 'flex' : 'none';
	
	if (show && !chatInitialized) {
		initializeChat();
	}
}

async function loadConversations() {
	const doctor = getCurrentUser();
	if (!doctor) return;
	
	try {
		console.log('🔄 Loading conversations for doctor:', doctor);
		const conversations = window.dataManager.getConversationsForUser(doctor.id);
		console.log('📋 Found conversations:', conversations);
		renderConversations(conversations);
		console.log('✅ Conversations loaded and rendered successfully');
	} catch (error) {
		console.error('❌ Error loading conversations:', error);
		toast('Error loading conversations');
	}
}

function renderConversations(conversations) {
	const container = document.getElementById('conversationsContent');
	if (!container) return;
	
	console.log('🎨 Rendering conversations:', conversations);
	container.innerHTML = '';
	
	if (conversations.length === 0) {
		container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No conversations yet</div>';
		console.log('ℹ️ No conversations to render');
		return;
	}
	
	conversations.forEach(conv => {
		console.log('📝 Processing conversation:', conv);
		const otherParticipant = conv.otherParticipants[0];
		if (!otherParticipant) {
			console.log('⚠️ No other participant found for conversation:', conv.id);
			return;
		}
		
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
		
		console.log('💬 Last message preview:', lastMessagePreview);
		console.log('⏰ Time ago:', timeAgo);
		
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
		console.log('✅ Conversation item added:', otherParticipant.name);
	});
	
	console.log('✅ All conversations rendered');
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
	console.log('🔄 Opening conversation:', conversation);
	console.log('👤 Patient info:', patientInfo);
	
	currentConversation = conversation;
	currentPatientInfo = patientInfo;
	
	// Update UI
	updateChatHeader(patientInfo);
	
	// Mark conversation as active
	document.querySelectorAll('.conversation-item').forEach(item => {
		item.classList.remove('active');
	});
	
	// Find and mark the correct conversation item as active
	const conversationItems = document.querySelectorAll('.conversation-item');
	conversationItems.forEach(item => {
		const conversationName = item.querySelector('.conversation-name');
		if (conversationName && conversationName.textContent === patientInfo.name) {
			item.classList.add('active');
		}
	});
	
	// Load and display messages
	await loadMessages(conversation.id);
	
	// Mark messages as read
	const doctor = getCurrentUser();
	if (doctor) {
		console.log('📖 Marking messages as read for doctor:', doctor.id);
		await window.dataManager.markMessagesAsRead(doctor.id, conversation.id);
		updateUnreadCounter();
		loadConversations(); // Refresh to update unread counts
		console.log('✅ Messages marked as read');
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
		console.log('🔄 Loading messages for conversation:', conversationId);
		const messages = window.dataManager.getMessagesForConversation(conversationId);
		console.log('📨 Found messages:', messages);
		renderMessages(messages);
		scrollToBottom();
		console.log('✅ Messages loaded and rendered successfully');
	} catch (error) {
		console.error('❌ Error loading messages:', error);
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
		await loadConversations();
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
			
			// Add click functionality to open unread messages
			if (unreadCount > 0) {
				counter.style.cursor = 'pointer';
				counter.title = `Click to view ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`;
				
				// Remove existing click listener to avoid duplicates
				counter.removeEventListener('click', openUnreadMessages);
				counter.addEventListener('click', openUnreadMessages);
			} else {
				counter.style.cursor = 'default';
				counter.title = '';
				counter.removeEventListener('click', openUnreadMessages);
			}
		}
	} catch (error) {
		console.error('Error updating unread counter:', error);
	}
}

// Function to open conversation with unread messages
async function openUnreadMessages() {
	console.log('🔄 Opening unread messages...');
	
	const doctor = getCurrentUser();
	if (!doctor) return;
	
	try {
		// Get all conversations for the doctor
		const conversations = window.dataManager.getConversationsForUser(doctor.id);
		
		// Find the conversation with the most recent unread messages
		let conversationWithUnread = null;
		let latestUnreadTime = null;
		
		for (const conv of conversations) {
			if (conv.unreadCount > 0) {
				// Get the latest unread message for this conversation
				const messages = window.dataManager.getMessagesForConversation(conv.id);
				const unreadMessages = messages.filter(msg => 
					msg.senderId !== doctor.id && !msg.readBy.includes(doctor.id)
				);
				
				if (unreadMessages.length > 0) {
					const latestMessage = unreadMessages[unreadMessages.length - 1];
					const messageTime = new Date(latestMessage.timestamp);
					
					if (!latestUnreadTime || messageTime > latestUnreadTime) {
						latestUnreadTime = messageTime;
						conversationWithUnread = conv;
					}
				}
			}
		}
		
		if (conversationWithUnread) {
			console.log('✅ Found conversation with unread messages:', conversationWithUnread);
			
			// Show chat container if not visible
			if (document.getElementById('chatContainer').style.display === 'none') {
				toggleChatContainer(true);
			}
			
			// Open the conversation
			const otherParticipant = conversationWithUnread.otherParticipants[0];
			if (otherParticipant) {
				await openConversation(conversationWithUnread, otherParticipant);
				
				// Show a notification
				toast(`Opened conversation with ${otherParticipant.name} (${conversationWithUnread.unreadCount} unread messages)`);
			}
		} else {
			console.log('ℹ️ No conversations with unread messages found');
			toast('No unread messages found');
		}
		
	} catch (error) {
		console.error('❌ Error opening unread messages:', error);
		toast('Error opening unread messages');
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
		
		// Reload messages to get the latest
		setTimeout(async () => {
			await loadMessages(conversation.id);
		}, 500);
	}
	
	// Update conversations list and counters
	setTimeout(async () => {
		await loadConversations();
		updateUnreadCounter();
	}, 300);
	
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
				setTimeout(() => {
					handleRealTimeMessage({ detail: crossTabData.detail });
				}, 100);
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

// Enhanced notification event listeners
window.addEventListener('openConversation', function(event) {
	const { conversationId, messageId } = event.detail;
	console.log('🔄 Opening conversation from notification:', conversationId);
	
	// Show chat container if not visible
	if (document.getElementById('chatContainer').style.display === 'none') {
		toggleChatContainer(true);
	}
	
	// Find and open the specific conversation
	if (conversationId) {
		const conversations = window.dataManager.getConversationsForUser(getCurrentUser().id);
		const targetConversation = conversations.find(conv => conv.id === conversationId);
		
		if (targetConversation) {
			const otherParticipant = targetConversation.otherParticipants[0];
			openConversation(targetConversation, otherParticipant);
		}
	}
});

// Enhanced notification permission request
function requestEnhancedNotifications() {
	if ('Notification' in window) {
		if (Notification.permission === 'default') {
			Notification.requestPermission().then(permission => {
				if (permission === 'granted') {
					toast('Enhanced notifications enabled!');
				}
			});
		} else if (Notification.permission === 'granted') {
			toast('Enhanced notifications are already enabled');
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
	
	// Start message polling for better synchronization
	if (window.dataManager) {
		window.dataManager.startMessagePolling();
	}

// Debug function to check data loading
function debugDataLoading() {
	console.log('🔍 DEBUG: Checking data loading...');
	console.log('📊 Data manager:', window.dataManager);
	console.log('📋 Data loaded:', window.dataManager?.data);
	console.log('👥 Users:', window.dataManager?.data?.users);
	console.log('🗨️ Conversations:', window.dataManager?.data?.conversations);
	console.log('📨 Messages:', window.dataManager?.data?.messages);
	
	const doctor = getCurrentUser();
	console.log('👩‍⚕️ Current doctor:', doctor);
	
	if (doctor && window.dataManager?.data) {
		const conversations = window.dataManager.getConversationsForUser(doctor.id);
		console.log('💬 Doctor conversations:', conversations);
		
		if (conversations.length > 0) {
			const messages = window.dataManager.getMessagesForConversation(conversations[0].id);
			console.log('📝 Conversation messages:', messages);
		}
	}
}

// Run debug after 5 seconds
setTimeout(debugDataLoading, 5000);

// Handle polling updates for doctor
function handleDoctorPollingUpdate(event) {
	console.log('🔄 Doctor received polling update:', event.detail);
	
	const doctor = getCurrentUser();
	if (!doctor) return;
	
	try {
		// Reload conversations to check for updates
		loadConversations();
		
		// Update unread counter
		updateUnreadCounter();
		
		// If a conversation is currently open, reload its messages
		if (currentConversation) {
			loadMessages(currentConversation.id);
		}
		
		console.log('✅ Doctor polling update processed');
	} catch (error) {
		console.error('❌ Error processing doctor polling update:', error);
	}
}

// Patient Timeline Functions
function openPatientTimeline() {
    window.location.href = 'patient-timeline.html';
    console.log('🕒 Opening patient timeline...');
}

// Current Medications Functions
function openMedicationsModal(patientId) {
    const patient = getPatientById(patientId);
    if (!patient) {
        toast('Patient not found', 'error');
        return;
    }
    
    // Load patient medications from data manager - only active medications
    console.log('🔍 Loading medications for patient ID:', patientId);
    console.log('📊 All medications in data manager:', window.dataManager?.data?.medications);
    
    const medications = window.dataManager?.data?.medications?.filter(med => med.patientId === patientId && med.status === 'active') || [];
    console.log('💊 Filtered medications for patient:', medications);
    
    // Display medications in a modal
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; width: 90%;">
            <div class="modal-header">
                <h3>Current Medications - ${patient.name}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="medications-container">
                    ${medications.length > 0 ? `
                        <div class="medications-list">
                            ${medications.map(med => `
                                <div class="medication-item" style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                                    <div class="medication-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                        <h4 style="margin: 0; color: #333; font-size: 1.2rem;">${med.name}</h4>
                                        <span class="medication-status ${med.status}" style="background: ${med.status === 'active' ? '#28a745' : '#dc3545'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">${med.status}</span>
                                    </div>
                                    <div class="medication-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                        <div>
                                            <p style="margin: 5px 0;"><strong>Dosage:</strong> ${med.dosage}</p>
                                            <p style="margin: 5px 0;"><strong>Frequency:</strong> ${med.frequency}</p>
                                        </div>
                                        <div>
                                            <p style="margin: 5px 0;"><strong>Start Date:</strong> ${new Date(med.startDate).toLocaleDateString()}</p>
                                            ${med.endDate ? `<p style="margin: 5px 0;"><strong>End Date:</strong> ${new Date(med.endDate).toLocaleDateString()}</p>` : ''}
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                        <p style="margin: 5px 0;"><strong>Instructions:</strong> ${med.instructions}</p>
                                    </div>
                                    <div class="medication-actions" style="display: flex; gap: 10px;">
                                        <button class="btn secondary" onclick="editMedication('${med.id}')" style="padding: 8px 16px;">Edit</button>
                                        <button class="btn danger" onclick="discontinueMedication('${med.id}')" style="padding: 8px 16px;">Discontinue</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="add-medication-section" style="background: #e9ecef; border-radius: 12px; padding: 20px; margin-top: 20px;">
                            <h4 style="margin-bottom: 20px; color: #333;">Add New Medication</h4>
                            <form id="addMedicationForm">
                                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                    <input type="text" id="medName" placeholder="Medication Name" required style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                    <input type="text" id="medDosage" placeholder="Dosage" required style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                </div>
                                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                    <select id="medFrequency" required style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                        <option value="">Select Frequency</option>
                                        <option value="Daily">Daily</option>
                                        <option value="Twice daily">Twice daily</option>
                                        <option value="Three times daily">Three times daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="As needed">As needed</option>
                                        <option value="Every 4 hours">Every 4 hours</option>
                                        <option value="Every 6 hours">Every 6 hours</option>
                                        <option value="Every 8 hours">Every 8 hours</option>
                                        <option value="Every 12 hours">Every 12 hours</option>
                                    </select>
                                    <textarea id="medInstructions" placeholder="Instructions" rows="3" style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%; resize: vertical;"></textarea>
                                </div>
                                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                    <input type="date" id="medStartDate" required style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                    <input type="date" id="medEndDate" placeholder="End Date (optional)" style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                </div>
                                <button type="submit" class="btn primary" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Add Medication</button>
                            </form>
                        </div>
                    ` : `
                        <div class="no-medications" style="text-align: center; padding: 40px;">
                            <p style="font-size: 1.1rem; color: #666; margin-bottom: 20px;">No medications found for this patient.</p>
                            <div class="add-medication-section" style="background: #e9ecef; border-radius: 12px; padding: 20px; margin-top: 20px;">
                                <h4 style="margin-bottom: 20px; color: #333;">Add New Medication</h4>
                                <form id="addMedicationForm">
                                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                        <input type="text" id="medName" placeholder="Medication Name" required style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                        <input type="text" id="medDosage" placeholder="Dosage" required style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                    </div>
                                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                        <select id="medFrequency" required style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                            <option value="">Select Frequency</option>
                                            <option value="Daily">Daily</option>
                                            <option value="Twice daily">Twice daily</option>
                                            <option value="Three times daily">Three times daily</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="As needed">As needed</option>
                                            <option value="Every 4 hours">Every 4 hours</option>
                                            <option value="Every 6 hours">Every 6 hours</option>
                                            <option value="Every 8 hours">Every 8 hours</option>
                                            <option value="Every 12 hours">Every 12 hours</option>
                                        </select>
                                        <textarea id="medInstructions" placeholder="Instructions" rows="3" style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%; resize: vertical;"></textarea>
                                    </div>
                                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                        <input type="date" id="medStartDate" required style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                        <input type="date" id="medEndDate" placeholder="End Date (optional)" style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; width: 100%;">
                                    </div>
                                    <button type="submit" class="btn primary" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Add Medication</button>
                                </form>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('addMedicationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddMedication(patientId);
    });
    
    console.log('💊 Opened medications modal for patient:', patient.name);
}

function handleAddMedication(patientId) {
    const formData = {
        name: document.getElementById('medName').value,
        dosage: document.getElementById('medDosage').value,
        frequency: document.getElementById('medFrequency').value,
        instructions: document.getElementById('medInstructions').value,
        startDate: document.getElementById('medStartDate').value,
        endDate: document.getElementById('medEndDate').value || null,
        status: 'active',
        patientId: patientId,
        prescribedBy: getCurrentUser().id,
        prescribedAt: new Date().toISOString()
    };
    
    // Add to data manager
    if (window.dataManager) {
        const newMedication = {
            id: 'med_' + Date.now(),
            ...formData
        };
        
        if (!window.dataManager.data.medications) {
            window.dataManager.data.medications = [];
        }
        
        window.dataManager.data.medications.push(newMedication);
        window.dataManager.saveData();
        
        // Add medication change to timeline
        addMedicationChangeToTimeline(newMedication, 'added');
        
        toast('Medication added successfully', 'success');
        
        // Refresh the modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            modal.remove();
            openMedicationsModal(patientId);
        }
    }
}

function addMedicationChangeToTimeline(medication, action) {
    console.log(`💊 Medication ${action}: ${medication.name} for patient ${medication.patientId}`);
    
    // Get patient info
    const patient = getPatientById(medication.patientId);
    if (!patient) {
        console.error('Patient not found for timeline update');
        return;
    }
    
    // Create timeline event
    const timelineEvent = {
        date: new Date().toISOString().split('T')[0],
        title: action === 'added' ? 'Medication Added' : 'Medication Discontinued',
        content: action === 'added' 
            ? `New medication prescribed: ${medication.name} ${medication.dosage} ${medication.frequency}`
            : `Medication discontinued: ${medication.name}`,
        medications: action === 'added' 
            ? [`${medication.name} ${medication.dosage} - ${medication.frequency}`]
            : [],
        conversation: action === 'added'
            ? `Doctor: "I'm prescribing ${medication.name} ${medication.dosage} ${medication.frequency} for your condition."\n\nPatient: "Thank you, doctor. When should I take it?"\n\nDoctor: "${medication.instructions}"`
            : `Doctor: "We're discontinuing ${medication.name} as it's no longer needed."\n\nPatient: "Understood, thank you."`
    };
    
    // Store timeline event in localStorage for persistence
    const timelineKey = `patient_timeline_${medication.patientId}`;
    let patientTimeline = JSON.parse(localStorage.getItem(timelineKey) || '[]');
    patientTimeline.push(timelineEvent);
    localStorage.setItem(timelineKey, JSON.stringify(patientTimeline));
    
    console.log('✅ Timeline event added:', timelineEvent);
}

function editMedication(medicationId) {
    // Implementation for editing medication
    toast('Edit medication functionality coming soon', 'info');
}

function discontinueMedication(medicationId) {
    if (confirm('Are you sure you want to discontinue this medication?')) {
        if (window.dataManager) {
            const medication = window.dataManager.data.medications.find(med => med.id === medicationId);
            if (medication) {
                medication.status = 'discontinued';
                medication.endDate = new Date().toISOString();
                window.dataManager.saveData();
                
                // Add medication change to timeline
                addMedicationChangeToTimeline(medication, 'discontinued');
                
                toast('Medication discontinued', 'success');
                
                // Refresh the modal
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    modal.remove();
                    const patientId = medication.patientId;
                    openMedicationsModal(patientId);
                }
            }
        }
    }
}

// Daily Progress Functions
function openDailyProgressModal(patientId) {
    const patient = getPatientById(patientId);
    if (!patient) {
        toast('Patient not found', 'error');
        return;
    }
    
    // Set patient name in modal
    document.getElementById('progressPatientName').textContent = patient.name;
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('progressDate').value = today;
    
    // Show modal
    document.getElementById('dailyProgressModal').classList.add('show');
    
    // Load progress for today
    loadDailyProgress();
    
    console.log('📊 Opening daily progress modal for patient:', patient.name);
}

function closeDailyProgressModal() {
    document.getElementById('dailyProgressModal').classList.remove('show');
}

function loadDailyProgress() {
    const patientId = document.getElementById('patientModal').dataset.patientId;
    const selectedDate = document.getElementById('progressDate').value;
    
    if (!patientId || !selectedDate) return;
    
    const patient = getPatientById(patientId);
    if (!patient) return;
    
    // Get progress data from data manager
    if (window.dataManager) {
        const progressData = window.dataManager.getDailyProgress(patient.email, selectedDate);
        
        if (progressData.length > 0) {
            const progress = progressData[0]; // Get the most recent entry
            displayDailyProgress(progress);
        } else {
            showNoProgressMessage();
        }
    }
}

function displayDailyProgress(progress) {
    // Hide no progress message
    document.getElementById('noProgressMessage').style.display = 'none';
    
    // Show progress sections
    document.getElementById('progressSummary').style.display = 'block';
    document.getElementById('progressGoalsList').style.display = 'block';
    document.getElementById('progressLifestyleGoals').style.display = 'block';
    
    // Update progress summary
    const summary = document.getElementById('progressSummary');
    summary.innerHTML = `
        <div class="progress-overview">
            <div class="progress-stat">
                <span class="stat-number">${progress.completedCount}</span>
                <span class="stat-label">Completed</span>
            </div>
            <div class="progress-stat">
                <span class="stat-number">${progress.totalCount}</span>
                <span class="stat-label">Total Goals</span>
            </div>
            <div class="progress-stat">
                <span class="stat-number">${progress.percentage}%</span>
                <span class="stat-label">Completion Rate</span>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
        </div>
    `;
    
    // Display workout goals
    const goalsList = document.getElementById('progressGoalsList');
    goalsList.innerHTML = '';
    
    if (progress.goals && progress.goals.length > 0) {
        progress.goals.forEach(goal => {
            const isCompleted = progress.progress[goal.id] || false;
            const goalElement = document.createElement('div');
            goalElement.className = `goal-item ${isCompleted ? 'completed' : ''}`;
            goalElement.innerHTML = `
                <div class="goal-status">
                    <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'} ${isCompleted ? 'completed' : ''}"></i>
                </div>
                <div class="goal-content">
                    <div class="goal-title">${goal.title}</div>
                    ${goal.description ? `<div class="goal-description">${goal.description}</div>` : ''}
                </div>
            `;
            goalsList.appendChild(goalElement);
        });
    } else {
        goalsList.innerHTML = '<p class="no-goals">No workout goals for this day.</p>';
    }
    
    // Display lifestyle goals
    const lifestyleGoals = document.getElementById('progressLifestyleGoals');
    lifestyleGoals.innerHTML = '';
    
    if (progress.lifestyleGoals && progress.lifestyleGoals.length > 0) {
        progress.lifestyleGoals.forEach(goal => {
            const isCompleted = progress.progress[goal.id] || false;
            const goalElement = document.createElement('div');
            goalElement.className = `lifestyle-goal ${isCompleted ? 'completed' : ''}`;
            goalElement.innerHTML = `
                <div class="goal-status">
                    <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'} ${isCompleted ? 'completed' : ''}"></i>
                </div>
                <div class="goal-content">
                    <div class="goal-title">${goal.title}</div>
                    ${goal.description ? `<div class="goal-description">${goal.description}</div>` : ''}
                </div>
            `;
            lifestyleGoals.appendChild(goalElement);
        });
    } else {
        lifestyleGoals.innerHTML = '<p class="no-goals">No lifestyle goals for this day.</p>';
    }
}

function showNoProgressMessage() {
    // Hide progress sections
    document.getElementById('progressSummary').style.display = 'none';
    document.getElementById('progressGoalsList').style.display = 'none';
    document.getElementById('progressLifestyleGoals').style.display = 'none';
    
    // Show no progress message
    document.getElementById('noProgressMessage').style.display = 'block';
}

// Add event listeners for daily progress modal
document.addEventListener('DOMContentLoaded', function() {
    // Close daily progress modal
    document.getElementById('closeDailyProgressModal').addEventListener('click', closeDailyProgressModal);
    
    // Close modal when clicking outside
    document.getElementById('dailyProgressModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDailyProgressModal();
        }
    });
});
