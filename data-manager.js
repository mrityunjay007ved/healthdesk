// Data Manager for handling JSON storage
class DataManager {
    constructor() {
        this.data = null;
        this.isLoading = false;
        this.isLoaded = false;
        this.loadPromise = null;
    }

    // Load data from JSON file
    async loadData() {
        // If already loaded, return immediately
        if (this.isLoaded && this.data) {
            return this.data;
        }
        
        // If currently loading, wait for existing promise
        if (this.isLoading && this.loadPromise) {
            return await this.loadPromise;
        }
        
        // Start loading
        this.isLoading = true;
        this.loadPromise = this._performLoad();
        
        try {
            const result = await this.loadPromise;
            this.isLoaded = true;
            this.isLoading = false;
            return result;
        } catch (error) {
            this.isLoading = false;
            this.loadPromise = null;
            throw error;
        }
    }
    
    async _performLoad() {
        try {
            console.log('🔄 Loading data from data.json...');
            const response = await fetch('data.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            console.log('✅ Data loaded successfully:', this.data);
            
            // Validate data structure
            if (!this.data.users || !Array.isArray(this.data.users)) {
                throw new Error('Invalid data structure: users array missing');
            }
            
            return this.data;
        } catch (error) {
            console.error('❌ Error loading data:', error);
            
            // Initialize with default data if file doesn't exist or is invalid
            console.log('🔧 Initializing with default data...');
            this.data = {
                users: [
                    {
                        id: 1,
                        email: "member@example.com",
                        password: "password123",
                        userType: "member",
                        name: "John Doe",
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    },
                    {
                        id: 2,
                        email: "doctor@example.com",
                        password: "doctor123",
                        userType: "doctor",
                        name: "Dr. Jane Smith",
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    }
                ],
                loginHistory: [],
                conversations: [],
                messages: [],
                settings: {
                    maxLoginAttempts: 5,
                    sessionTimeout: 3600,
                    requirePasswordChange: false,
                    messaging: {
                        maxMessageLength: 2000,
                        allowFileAttachments: true,
                        enableRealTimeNotifications: true,
                        messageRetentionDays: 365
                    }
                }
            };
            
            console.log('✅ Default data initialized');
            return this.data;
        }
    }

    // Save data to JSON file (simulated - in real app, this would go to backend)
    async saveData() {
        try {
            // In a real application, this would be a POST request to a backend API
            console.log('Saving data:', this.data);
            
            // For demonstration, we'll store in localStorage as well
            localStorage.setItem('elyxData', JSON.stringify(this.data));
            
            // Simulate API call
            await this.simulateAPICall('POST', '/api/save-data', this.data);
            
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Add new user
    async addUser(userData) {
        if (!this.data) await this.loadData();
        
        const newUser = {
            id: this.data.users.length + 1,
            email: userData.email,
            password: userData.password, // In real app, this should be hashed
            userType: userData.userType,
            name: userData.name || 'Unknown User',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        this.data.users.push(newUser);
        await this.saveData();
        
        console.log('User added:', newUser);
        return newUser;
    }

    // Authenticate user
    async authenticateUser(email, password, userType) {
        if (!this.data) await this.loadData();
        
        const user = this.data.users.find(u => 
            u.email === email && 
            u.password === password && 
            u.userType === userType
        );

        if (user) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            
            // Add to login history
            this.addLoginHistory(email, userType, true);
            
            await this.saveData();
            return user;
        }
        
        // Add failed login attempt
        this.addLoginHistory(email, userType, false);
        await this.saveData();
        
        return null;
    }

    // Add login history entry
    addLoginHistory(email, userType, success) {
        const loginEntry = {
            id: this.data.loginHistory.length + 1,
            email: email,
            userType: userType,
            loginTime: new Date().toISOString(),
            success: success,
            ipAddress: '127.0.0.1' // In real app, get actual IP
        };

        this.data.loginHistory.push(loginEntry);
    }

    // Get all users
    getUsers() {
        return this.data ? this.data.users : [];
    }

    // Get login history
    getLoginHistory() {
        return this.data ? this.data.loginHistory : [];
    }

    // Get user by email
    getUserByEmail(email) {
        if (!this.data) return null;
        return this.data.users.find(u => u.email === email);
    }

    // Update user
    async updateUser(email, updates) {
        if (!this.data) await this.loadData();
        
        const userIndex = this.data.users.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates };
            await this.saveData();
            return this.data.users[userIndex];
        }
        return null;
    }

    // Delete user
    async deleteUser(email) {
        if (!this.data) await this.loadData();
        
        const userIndex = this.data.users.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            const deletedUser = this.data.users.splice(userIndex, 1)[0];
            await this.saveData();
            return deletedUser;
        }
        return null;
    }

    // Get statistics
    getStats() {
        if (!this.data) return null;
        
        return {
            totalUsers: this.data.users.length,
            memberUsers: this.data.users.filter(u => u.userType === 'member').length,
            doctorUsers: this.data.users.filter(u => u.userType === 'doctor').length,
            totalLogins: this.data.loginHistory.length,
            successfulLogins: this.data.loginHistory.filter(l => l.success).length,
            failedLogins: this.data.loginHistory.filter(l => !l.success).length
        };
    }

    // Simulate API call (for demonstration)
    async simulateAPICall(method, endpoint, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`API Call: ${method} ${endpoint}`, data);
                resolve({ success: true, message: 'Data saved successfully' });
            }, 500);
        });
    }

    // Export data as JSON string
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    // Import data from JSON string
    async importData(jsonString) {
        try {
            const importedData = JSON.parse(jsonString);
            this.data = importedData;
            await this.saveData();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // ===== CHAT MANAGER FUNCTIONALITY =====

    // Get or create conversation between two users
    async getOrCreateConversation(user1Id, user2Id) {
        if (!this.data) await this.loadData();
        
        // Find existing conversation
        let conversation = this.data.conversations.find(conv => 
            (conv.participantIds.includes(user1Id) && conv.participantIds.includes(user2Id))
        );
        
        if (!conversation) {
            // Create new conversation
            const user1 = this.data.users.find(u => u.id === user1Id);
            const user2 = this.data.users.find(u => u.id === user2Id);
            
            if (!user1 || !user2) {
                throw new Error('One or both users not found');
            }
            
            conversation = {
                id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                participantIds: [user1Id, user2Id],
                participantEmails: [user1.email, user2.email],
                participantNames: [user1.name, user2.name],
                createdAt: new Date().toISOString(),
                lastMessageAt: new Date().toISOString(),
                unreadCount: {
                    [user1Id]: 0,
                    [user2Id]: 0
                }
            };
            
            this.data.conversations.push(conversation);
            await this.saveData();
        }
        
        return conversation;
    }

    // Send a message
    async sendMessage(senderId, conversationId, content, messageType = 'text', metadata = {}) {
        if (!this.data) await this.loadData();
        
        const sender = this.data.users.find(u => u.id === senderId);
        const conversation = this.data.conversations.find(c => c.id === conversationId);
        
        if (!sender || !conversation) {
            throw new Error('Sender or conversation not found');
        }
        
        // Create message
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: conversationId,
            senderId: senderId,
            senderEmail: sender.email,
            senderName: sender.name,
            senderType: sender.userType,
            content: content.trim(),
            timestamp: new Date().toISOString(),
            readBy: [senderId], // Sender has read their own message
            messageType: messageType,
            metadata: {
                context: metadata.context || 'general',
                priority: metadata.priority || 'normal',
                tags: metadata.tags || [],
                ...metadata
            }
        };
        
        // Add message to data
        this.data.messages.push(message);
        
        // Update conversation
        conversation.lastMessageAt = message.timestamp;
        
        // Update unread counts for other participants
        conversation.participantIds.forEach(participantId => {
            if (participantId !== senderId) {
                conversation.unreadCount[participantId] = (conversation.unreadCount[participantId] || 0) + 1;
            }
        });
        
        await this.saveData();
        
        // Simulate real-time notification
        this.simulateRealTimeNotification(message, conversation);
        
        return message;
    }

    // Mark messages as read
    async markMessagesAsRead(userId, conversationId, messageIds = null) {
        if (!this.data) await this.loadData();
        
        const conversation = this.data.conversations.find(c => c.id === conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        
        // Get messages to mark as read
        let messagesToUpdate;
        if (messageIds) {
            messagesToUpdate = this.data.messages.filter(m => 
                m.conversationId === conversationId && messageIds.includes(m.id)
            );
        } else {
            // Mark all unread messages as read
            messagesToUpdate = this.data.messages.filter(m => 
                m.conversationId === conversationId && !m.readBy.includes(userId)
            );
        }
        
        // Update read status
        messagesToUpdate.forEach(message => {
            if (!message.readBy.includes(userId)) {
                message.readBy.push(userId);
            }
        });
        
        // Reset unread count for this user
        conversation.unreadCount[userId] = 0;
        
        await this.saveData();
        
        return messagesToUpdate.length;
    }

    // Get conversations for a user
    getConversationsForUser(userId) {
        if (!this.data) return [];
        
        return this.data.conversations
            .filter(conv => conv.participantIds.includes(userId))
            .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
            .map(conv => {
                // Get the other participant(s)
                const otherParticipants = conv.participantIds
                    .filter(id => id !== userId)
                    .map(id => {
                        const user = this.data.users.find(u => u.id === id);
                        return user ? { id: user.id, name: user.name, email: user.email, userType: user.userType } : null;
                    })
                    .filter(Boolean);
                
                // Get last message
                const lastMessage = this.data.messages
                    .filter(m => m.conversationId === conv.id)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                
                return {
                    ...conv,
                    otherParticipants,
                    lastMessage,
                    unreadCount: conv.unreadCount[userId] || 0
                };
            });
    }

    // Get messages for a conversation
    getMessagesForConversation(conversationId, limit = 50, offset = 0) {
        if (!this.data) return [];
        
        return this.data.messages
            .filter(m => m.conversationId === conversationId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .slice(offset, offset + limit);
    }

    // Get unread message count for a user
    getUnreadMessageCount(userId) {
        if (!this.data) return 0;
        
        return this.data.conversations
            .filter(conv => conv.participantIds.includes(userId))
            .reduce((total, conv) => total + (conv.unreadCount[userId] || 0), 0);
    }

    // Search messages
    searchMessages(userId, query, conversationId = null) {
        if (!this.data) return [];
        
        let messages = this.data.messages;
        
        // Filter by conversation if specified
        if (conversationId) {
            messages = messages.filter(m => m.conversationId === conversationId);
        } else {
            // Only search in conversations where user is a participant
            const userConversations = this.data.conversations
                .filter(conv => conv.participantIds.includes(userId))
                .map(conv => conv.id);
            messages = messages.filter(m => userConversations.includes(m.conversationId));
        }
        
        // Search in message content
        const searchTerm = query.toLowerCase();
        return messages
            .filter(m => 
                m.content.toLowerCase().includes(searchTerm) ||
                m.senderName.toLowerCase().includes(searchTerm) ||
                (m.metadata.tags && m.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            )
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Get conversation between specific users
    getConversationBetweenUsers(user1Id, user2Id) {
        if (!this.data) return null;
        
        return this.data.conversations.find(conv => 
            conv.participantIds.includes(user1Id) && conv.participantIds.includes(user2Id)
        );
    }

    // Delete conversation
    async deleteConversation(conversationId, userId) {
        if (!this.data) await this.loadData();
        
        const conversation = this.data.conversations.find(c => c.id === conversationId);
        if (!conversation || !conversation.participantIds.includes(userId)) {
            throw new Error('Conversation not found or user not authorized');
        }
        
        // Remove conversation
        this.data.conversations = this.data.conversations.filter(c => c.id !== conversationId);
        
        // Remove all messages in conversation
        this.data.messages = this.data.messages.filter(m => m.conversationId !== conversationId);
        
        await this.saveData();
        return true;
    }

    // Get conversation statistics
    getConversationStats(conversationId) {
        if (!this.data) return null;
        
        const conversation = this.data.conversations.find(c => c.id === conversationId);
        if (!conversation) return null;
        
        const messages = this.data.messages.filter(m => m.conversationId === conversationId);
        
        const messagesByType = messages.reduce((acc, msg) => {
            acc[msg.messageType] = (acc[msg.messageType] || 0) + 1;
            return acc;
        }, {});
        
        const messagesBySender = messages.reduce((acc, msg) => {
            acc[msg.senderId] = (acc[msg.senderId] || 0) + 1;
            return acc;
        }, {});
        
        return {
            conversationId,
            totalMessages: messages.length,
            messagesByType,
            messagesBySender,
            createdAt: conversation.createdAt,
            lastMessageAt: conversation.lastMessageAt,
            participants: conversation.participantNames
        };
    }

    // Simulate real-time notification (for demo purposes)
    simulateRealTimeNotification(message, conversation) {
        console.log('📡 Starting real-time notification...');
        console.log('📤 Message to broadcast:', message);
        console.log('🗨️ Conversation details:', conversation);
        
        // In a real application, this would use WebSockets or Server-Sent Events
        const notification = {
            type: 'new_message',
            message: message,
            conversation: conversation,
            timestamp: new Date().toISOString()
        };
        
        console.log('📋 Notification payload:', notification);
        
        // Store notification in localStorage for demo
        const notifications = JSON.parse(localStorage.getItem('elyx_notifications') || '[]');
        notifications.unshift(notification);
        notifications.splice(10); // Keep only last 10 notifications
        localStorage.setItem('elyx_notifications', JSON.stringify(notifications));
        
        console.log('💾 Notification stored in localStorage');
        
        // Trigger custom event for real-time updates (same tab)
        console.log('🚀 Dispatching elyxNewMessage event for same tab...');
        window.dispatchEvent(new CustomEvent('elyxNewMessage', { detail: notification }));
        
        // Cross-tab communication using localStorage
        console.log('📡 Broadcasting message to other tabs...');
        const crossTabData = {
            type: 'elyxNewMessage',
            detail: notification,
            timestamp: Date.now(),
            tabId: Math.random().toString(36).substr(2, 9)
        };
        
        // Use a unique key that changes each time to trigger storage event
        localStorage.setItem(`elyx_broadcast_${Date.now()}_${Math.random()}`, JSON.stringify(crossTabData));
        
        // Clean up old broadcast messages (keep only last 5)
        const allKeys = Object.keys(localStorage);
        const broadcastKeys = allKeys.filter(key => key.startsWith('elyx_broadcast_')).sort();
        if (broadcastKeys.length > 5) {
            broadcastKeys.slice(0, -5).forEach(key => localStorage.removeItem(key));
        }
        
        console.log('✅ Real-time notification sent to all tabs');
        
        // Simple listener count check (DevTools only)
        try {
            if (typeof getEventListeners !== 'undefined') {
                const listeners = getEventListeners(window);
                if (listeners && listeners.elyxNewMessage) {
                    console.log('👂 Current elyxNewMessage listeners:', listeners.elyxNewMessage.length);
                }
            } else {
                console.log('📡 Event dispatched (listener count check unavailable)');
            }
        } catch (e) {
            console.log('📡 Event dispatched successfully');
        }
    }

    // Get recent messages for dashboard
    getRecentMessages(userId, limit = 5) {
        if (!this.data) return [];
        
        const userConversations = this.data.conversations
            .filter(conv => conv.participantIds.includes(userId))
            .map(conv => conv.id);
        
        return this.data.messages
            .filter(m => userConversations.includes(m.conversationId) && m.senderId !== userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    // Export conversation data for LLM training
    exportConversationForTraining(conversationId) {
        if (!this.data) return null;
        
        const conversation = this.data.conversations.find(c => c.id === conversationId);
        if (!conversation) return null;
        
        const messages = this.data.messages
            .filter(m => m.conversationId === conversationId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return {
            conversation: {
                id: conversation.id,
                participants: conversation.participantNames,
                participantTypes: conversation.participantIds.map(id => {
                    const user = this.data.users.find(u => u.id === id);
                    return user ? user.userType : 'unknown';
                }),
                duration: new Date(conversation.lastMessageAt) - new Date(conversation.createdAt),
                createdAt: conversation.createdAt,
                lastMessageAt: conversation.lastMessageAt
            },
            messages: messages.map(msg => ({
                id: msg.id,
                senderType: msg.senderType,
                senderName: msg.senderName,
                content: msg.content,
                timestamp: msg.timestamp,
                messageType: msg.messageType,
                metadata: msg.metadata
            })),
            statistics: this.getConversationStats(conversationId),
            exportedAt: new Date().toISOString()
        };
    }
}

// Initialize global data manager
window.dataManager = new DataManager();

// Auto-load data when script loads
window.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Auto-loading data manager...');
        await window.dataManager.loadData();
        console.log('✅ Data manager ready');
        
        // Dispatch custom event to notify that data manager is ready
        window.dispatchEvent(new CustomEvent('dataManagerReady'));
    } catch (error) {
        console.error('❌ Failed to initialize data manager:', error);
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
