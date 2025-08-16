# 💬 elyx Chat Testing Guide

## 🚀 Quick Start

### 1. **Start Local Server**
```bash
cd /path/to/elyx-main
python3 -m http.server 8000
```

### 2. **Access via HTTP**
Open your browser and go to: `http://localhost:8000`

## 🧪 **Testing Steps**

### **Step 1: Real-time Messaging Test**
1. Go to `http://localhost:8000/test-realtime.html`
2. Click "🔧 Test Data Manager" to verify data loading
3. Click "🎧 Test Event Listener" to verify event system
4. Click "📤 Send Test Message" to test message sending
5. Check debug log for detailed information

### **Step 2: Doctor Dashboard Test**

#### **Option A: Quick Login (Recommended)**
1. Go to `http://localhost:8000/quick-login.html`
2. Click "Login as Doctor (Dr. Jane Smith)"
3. Will auto-redirect to doctor dashboard
4. Click the chat toggle button (comment icon)
5. Select a patient and click "Start Conversation"
6. Try sending a message

#### **Option B: Direct Access**
1. Go to `http://localhost:8000/doctor-dashboard.html`
2. If you get "Please login as doctor" alert, the system will auto-login you as Dr. Jane Smith
3. Open browser console (F12) and look for:
   - `✅ Auto-login successful as Dr. Jane Smith`
   - `✅ Data manager loaded successfully`
   - `✅ Chat system ready`
4. Click the chat toggle button (comment icon)
5. Select a patient and click "Start Conversation"
6. Try sending a message

### **Step 3: Member Dashboard Test**

#### **Option A: Quick Login (Recommended)**
1. Go to `http://localhost:8000/quick-login.html`
2. Click "Login as Member (John Doe)" 
3. Will auto-redirect to member dashboard
4. Click "Chat with Doctor" card
5. Try sending a message using quick questions or typing

#### **Option B: Direct Access**
1. Go to `http://localhost:8000/member-dashboard.html`
2. If you get "Please login as a member" error, the system will auto-login you as John Doe
3. Check console for initialization messages
4. Click "Chat with Doctor" card
5. Try sending a message using quick questions or typing

## 🔄 **Real-time Messaging Test**

**To test if messages from doctor reach member dashboard:**

1. **Open two browser tabs/windows:**
   - Tab 1: `http://localhost:8000/doctor-dashboard.html`
   - Tab 2: `http://localhost:8000/member-dashboard.html`

2. **In Doctor tab (Tab 1):**
   - Open browser console (F12)
   - Look for: `🎧 Attaching doctor real-time message listener...`
   - Click chat icon → select a patient → start conversation
   - Send a message to the patient

3. **In Member tab (Tab 2):**
   - Open browser console (F12)  
   - Look for: `🎧 Attaching member real-time message listener...`
   - Click "Chat with Doctor" card
   - **Watch console for**: `🔔 Member received real-time message event`

4. **Debug the issue:**
   - Check console logs in both tabs
   - Use `http://localhost:8000/test-realtime.html` for isolated testing
   - Look for error messages in red
   - **Look for cross-tab communication logs:**
     - `📡 Broadcasting message to other tabs...`
     - `🔄 Member received cross-tab message:`
     - `🔄 Doctor received cross-tab message:`

## 🔍 **Troubleshooting**

### **Error: "Chat system not ready"**
- **Solution**: Refresh the page and wait for console messages
- **Check**: Browser console for data loading errors

### **Error: "Please select a conversation first"**
- **Solution**: Click on a patient in the doctor dashboard and select "Start Conversation"

### **Error: "Please login as a member to access chat"**
- **Solution Option 1**: Use the quick login page: `http://localhost:8000/quick-login.html`
- **Solution Option 2**: The system will auto-login you as John Doe for testing
- **Manual Fix**: Open browser console and run: 
  ```javascript
  localStorage.setItem('currentUser', JSON.stringify({id: 1, email: 'member@example.com', userType: 'member', name: 'John Doe'}))
  ```

### **Error: "Please login as doctor" or doctor alert**
- **Solution Option 1**: Use the quick login page: `http://localhost:8000/quick-login.html`
- **Solution Option 2**: The system will auto-login you as Dr. Jane Smith for testing
- **Manual Fix**: Open browser console and run:
  ```javascript
  localStorage.setItem('currentUser', JSON.stringify({id: 2, email: 'doctor@example.com', userType: 'doctor', name: 'Dr. Jane Smith'}))
  ```

### **Error: Data loading failed**
- **Solution**: Make sure you're accessing via `http://localhost:8000` not `file://`

### **Send button disabled**
- **Check**: Make sure you've typed a message
- **Check**: Console for any JavaScript errors

## 📱 **Expected Behavior**

### **Login Flow:**
1. **Quick Login Page**: Easy one-click login for testing
2. **Auto-Login**: If no login found, system auto-logs in as John Doe
3. **Welcome Message**: Shows current user name in header
4. **Session Persistence**: Login saved in localStorage and sessionStorage

### **Doctor Side:**
1. Unread counter shows number of unread messages
2. Can see list of patient conversations
3. Can start new conversations from patient modal
4. Can send messages with medical tags and priority
5. Can export conversations

### **Member Side:**
1. Unread badge on chat card
2. Quick question buttons work
3. Can type and send custom messages
4. Receives real-time updates from doctor
5. Can export conversation

## 🛠 **Console Commands for Testing**

Open browser console (F12) and try these:

```javascript
// Check if data manager is loaded
console.log('Data loaded:', !!window.dataManager.data);

// Check current user
console.log('Current user:', localStorage.getItem('currentUser'));

// Test send message function
window.dataManager.sendMessage(1, 'conv_1', 'Test message', 'text', {context: 'test'});

// Get conversations
console.log('Conversations:', window.dataManager.getConversationsForUser(1));
```

## 📧 **Test Messages**

Try sending these test messages:

**Member Messages:**
- "How are my blood pressure readings looking?"
- "I'm experiencing some side effects from my medication."
- "I'd like to schedule a follow-up appointment."

**Doctor Messages (with tags):**
- Add tags: `blood_pressure`, `medication`
- Set priority: `urgent` for important messages
- Use context: `medication_change`, `health_inquiry`

## 🎯 **Success Indicators**

✅ **Working correctly if you see:**
- Messages appear in chat bubbles
- Timestamps display properly
- Unread counters update
- Real-time messaging works between doctor/patient
- Export function downloads JSON files
- Console shows no errors

❌ **Issues if you see:**
- "Chat system not ready" messages
- Send button stays disabled
- Console errors about fetch/CORS
- Messages don't appear after sending

## 🆘 **Still Not Working?**

1. **Clear browser cache** and try again
2. **Check browser console** for specific error messages
3. **Verify server is running** on port 8000
4. **Try incognito/private mode** to rule out cache issues
5. **Use the debug tool** to identify specific issues

---

*Need help? Check the console output and look for specific error messages to identify the issue.*
