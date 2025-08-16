# Elyx Chatbot System - Complete Guide

## 🎯 Overview

The Elyx chatbot system provides real-time messaging between doctors and members (patients) with advanced features including unread message indicators, priority messaging, medical tagging, and enhanced notifications.

## ✨ Features

### For Members (Patients)
- **Chat with Doctor**: Direct messaging interface with healthcare providers
- **Unread Message Badge**: Visual indicator showing number of unread messages
- **Quick Questions**: Pre-defined health-related questions for easy communication
- **Real-time Messaging**: Instant message delivery and synchronization
- **Message History**: Complete conversation history with timestamps
- **Export Conversations**: Download conversation data for personal records
- **Enhanced Notifications**: Browser and in-app notifications for new messages

### For Doctors
- **Patient Messages**: Centralized messaging hub for all patient communications
- **Unread Counter**: Real-time unread message count with visual indicator
- **Conversation Management**: List of all patient conversations with preview
- **Medical Tagging**: Add medical context, priority levels, and custom tags
- **Message Search**: Search through conversations and messages
- **Priority Messaging**: Mark messages as urgent, high, normal, or low priority
- **Professional Tools**: Export conversations, search functionality, and more

### Technical Features
- **Real-time Synchronization**: Messages sync across all browser tabs
- **Cross-tab Communication**: Notifications work across multiple browser windows
- **Data Persistence**: All messages and conversations are stored locally
- **Auto-login System**: Testing mode with automatic user login
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for testing)

### Installation
1. Clone or download the Elyx project
2. Start a local web server in the project directory:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   # or
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### Testing the Chatbot

#### Member Testing
1. Navigate to `member-dashboard.html`
2. The system will auto-login as "John Doe" (member@example.com)
3. Click on "Chat with Doctor" card to open the messaging interface
4. Send messages using the input field or quick question buttons
5. Messages will appear in real-time

#### Doctor Testing
1. Navigate to `doctor-dashboard.html`
2. The system will auto-login as "Dr. Jane Smith" (doctor@example.com)
3. The "Patient Messages" section shows all conversations
4. Click on a conversation to open the chat window
5. Send messages and use medical tagging features

## 📱 User Interface

### Member Dashboard Chat Interface
- **Chat Header**: Shows doctor information and close button
- **Message Area**: Displays conversation history with sent/received indicators
- **Quick Questions**: Pre-defined health questions for easy communication
- **Input Area**: Message composition with character limit and send button
- **Unread Badge**: Shows number of unread messages on the chat card

### Doctor Dashboard Chat Interface
- **Conversations List**: Shows all patient conversations with preview
- **Search**: Filter conversations by patient name or message content
- **Chat Window**: Main messaging area with patient information
- **Message Tools**: Medical tagging, priority setting, and search
- **Unread Counter**: Shows total unread messages across all conversations

## 🔧 Configuration

### Data Management
The system uses `data-manager.js` for all data operations:

```javascript
// Initialize data manager
await window.dataManager.loadData();

// Send a message
await window.dataManager.sendMessage(senderId, conversationId, content, type, metadata);

// Get conversations for user
const conversations = window.dataManager.getConversationsForUser(userId);

// Mark messages as read
await window.dataManager.markMessagesAsRead(userId, conversationId);
```

### User Management
Default users are defined in `data.json`:

```json
{
  "users": [
    {
      "id": 1,
      "email": "member@example.com",
      "password": "password123",
      "userType": "member",
      "name": "John Doe"
    },
    {
      "id": 2,
      "email": "doctor@example.com",
      "password": "doctor123",
      "userType": "doctor",
      "name": "Dr. Jane Smith"
    }
  ]
}
```

### Notification Settings
Enhanced notifications can be configured:

```javascript
// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Check notification status
if (Notification.permission === 'granted') {
    // Notifications are enabled
}
```

## 🎨 Customization

### Styling
The chatbot interface can be customized by modifying:

- `member-dashboard.css` - Member chat interface styles
- `doctor-dashboard.css` - Doctor chat interface styles

### Colors and Themes
Primary colors used in the system:
- Primary: `#667eea` (Blue)
- Secondary: `#764ba2` (Purple)
- Success: `#27ae60` (Green)
- Warning: `#f39c12` (Orange)
- Error: `#e74c3c` (Red)
- Urgent: `#ff4757` (Bright Red)

### Adding New Features
To add new features to the chatbot:

1. **New Message Types**: Extend the `messageType` parameter in `sendMessage()`
2. **Additional Tags**: Add new medical tags in the doctor interface
3. **Custom Notifications**: Modify the notification system in `data-manager.js`
4. **New Quick Questions**: Add buttons to the member interface

## 🔒 Security Considerations

### Current Implementation
- Data is stored locally in browser storage
- No server-side validation
- Auto-login for testing purposes

### Production Recommendations
- Implement proper user authentication
- Add server-side message validation
- Use HTTPS for all communications
- Implement message encryption
- Add rate limiting for message sending
- Implement proper session management

## 🐛 Troubleshooting

### Common Issues

#### Messages Not Appearing
1. Check browser console for JavaScript errors
2. Ensure data manager is properly loaded
3. Verify user authentication
4. Check if conversation exists

#### Notifications Not Working
1. Check browser notification permissions
2. Ensure HTTPS is used (required for notifications)
3. Verify notification code is properly loaded

#### Real-time Updates Not Working
1. Check if multiple tabs are open
2. Verify localStorage is enabled
3. Check for JavaScript errors in console

#### Chat Interface Not Loading
1. Ensure all CSS and JS files are loaded
2. Check for missing dependencies
3. Verify HTML structure is correct

### Debug Mode
Enable debug logging by checking the browser console. The system provides detailed logging for:
- Data loading operations
- Message sending/receiving
- Real-time notifications
- Error conditions

## 📊 Performance

### Optimization Tips
- Messages are loaded in batches (50 messages at a time)
- Unread counts are cached and updated efficiently
- Real-time updates use efficient event dispatching
- CSS animations are hardware-accelerated

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔮 Future Enhancements

### Planned Features
- File attachments (images, documents)
- Voice messages
- Video calling integration
- AI-powered message suggestions
- Message reactions and emojis
- Message editing and deletion
- Read receipts
- Typing indicators
- Message scheduling
- Automated responses

### Integration Possibilities
- Electronic Health Records (EHR) integration
- Appointment scheduling
- Prescription management
- Lab result sharing
- Telemedicine integration
- Mobile app development

## 📞 Support

For technical support or feature requests:
- Check the browser console for error messages
- Review the data structure in `data.json`
- Test with different browsers
- Verify all dependencies are loaded

## 📄 License

This chatbot system is part of the Elyx healthcare platform. Please refer to the main project license for usage terms.

---

**Note**: This is a demonstration system designed for testing and development. For production use, implement proper security measures and server-side validation.

