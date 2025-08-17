# 🏥 HealthDesk - Healthcare Portal

A modern, responsive healthcare management system built with HTML, CSS, and JavaScript. Complete medication synchronization system with patient timeline and real-time updates.

## 🌟 Features

### 🔐 Authentication System
- **User Registration & Login** - Secure member and doctor authentication
- **Session Management** - Persistent login with "Remember Me" functionality
- **Password Security** - Secure password handling
- **Role-based Access** - Separate portals for members and doctors

### 👤 Member Dashboard
- **Personalized Welcome** - Dynamic user name display
- **Profile Management** - Complete member snapshot with editable fields
- **Current Medications** - View user-specific medications with real-time sync
- **Consultation Desk** - Real-time chat with healthcare providers
- **Health Information** - Medical records and history
- **Appointment Booking** - Request and manage appointments
- **Weekly Reviews** - Health progress tracking and analytics

### 🩺 Doctor Portal
- **Patient Management** - View and manage patient records
- **Current Medications** - Add, edit, and discontinue patient medications
- **Patient Timeline** - Complete medical history with medication changes
- **Consultation Desk** - Real-time chat with patients
- **Appointment Scheduling** - Manage patient appointments
- **Medical Records** - Access and update patient information

### 📊 Patient Timeline
- **Complete Medical History** - 8-month digital health monitoring
- **Medication Changes** - Track all prescription modifications
- **Real-time Sync** - Automatic updates when medications change
- **Conversation History** - Full patient-doctor dialogue records

### 📊 Admin Panel
- **User Management** - View all registered users
- **System Statistics** - Login history and user analytics
- **Data Management** - Export and import functionality

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Inter)

### Data Management
- **localStorage** - Client-side data persistence
- **Real-time Updates** - Cross-tab synchronization
- **JSON Data** - Structured data management

## 📁 Project Structure

```
healthdesk/
├── index.html              # Main login page
├── member-dashboard.html   # Member dashboard
├── member-dashboard.css    # Member dashboard styles
├── member-dashboard.js     # Member dashboard functionality
├── doctor-dashboard.html   # Doctor dashboard
├── doctor-dashboard.css    # Doctor dashboard styles
├── doctor-dashboard.js     # Doctor dashboard functionality
├── patient-timeline.html   # Patient timeline
├── patient-timeline.css    # Patient timeline styles
├── patient-timeline.js     # Patient timeline functionality
├── profile.html           # Member profile page
├── profile.css            # Profile page styles
├── profile.js             # Profile page functionality
├── admin-panel.html       # Admin panel
├── admin-panel.css        # Admin panel styles
├── admin-panel.js         # Admin panel functionality
├── styles.css             # Global styles
├── script.js              # Main JavaScript functionality
├── data-manager.js        # Data management utilities
├── data.json              # Sample user and medication data
└── README.md             # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrityunjay007ved/healthdesk.git
   cd healthdesk
   ```

2. **Start the local server**
   ```bash
   python -m http.server 8080
   ```

3. **Access the application**
   - Open your browser and go to: http://localhost:8080

## 👥 User Types

### Member Users
- **John Doe**: `member@example.com` / `password123`
- **Alice Johnson**: `alice@example.com` / `alice123`
- **Michael Smith**: `michael@example.com` / `michael123`
- **Priya Patel**: `priya@example.com` / `priya123`
- **Wei Chen**: `wei@example.com` / `wei123`

### Doctor Users
- **Dr. Jane Smith**: `doctor@example.com` / `doctor123`

## 💊 Medication Management

### Current Medications by Patient:
- **John Doe**: Vitamin D3 2000 IU, Sertraline 12.5mg
- **Alice Johnson**: Metformin 500mg, Glimepiride 1mg
- **Michael Smith**: Atorvastatin 10mg, Escitalopram 5mg
- **Priya Patel**: Lisinopril 10mg, Amlodipine 5mg
- **Wei Chen**: Simvastatin 20mg, Vitamin B12 1000mcg

## 🔄 Real-time Features

- **Cross-tab Synchronization** - Updates across multiple browser tabs
- **Medication Sync** - Changes reflect immediately across all dashboards
- **Timeline Updates** - New medication events appear in patient timeline
- **Live Chat** - Real-time messaging between doctors and patients

## 🎨 Design Features

- **Responsive Design** - Works on all device sizes
- **Modern UI** - Clean, professional interface
- **Smooth Animations** - Enhanced user experience
- **Accessibility** - WCAG compliant design
- **Professional Healthcare Theme** - Trustworthy medical interface

## 🔒 Security Features

- **Client-side Validation** - Input validation and sanitization
- **Session Management** - Secure user sessions
- **Data Persistence** - Reliable data storage and retrieval

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mrityunjay Kumar**
- GitHub: [@mrityunjay007ved](https://github.com/mrityunjay007ved)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- All contributors and testers

## 📞 Support

For support, create an issue in this repository.

---

**Made with ❤️ for better healthcare**
