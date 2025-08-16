# 🏥 elyx - Healthcare Portal

A modern, responsive healthcare management system built with HTML, CSS, JavaScript, and Python Flask backend.

## 🌟 Features

### 🔐 Authentication System
- **User Registration & Login** - Secure member and doctor authentication
- **Session Management** - Persistent login with "Remember Me" functionality
- **Password Security** - Hashed passwords with Werkzeug security
- **Role-based Access** - Separate portals for members and doctors

### 👤 Member Dashboard
- **Personalized Welcome** - Dynamic user name display
- **Profile Management** - Complete member snapshot with editable fields
- **Health Information** - Medical records and history (ready for expansion)
- **Appointment Booking** - Request and manage appointments
- **Weekly Reviews** - Health progress tracking and analytics

### 🩺 Doctor Portal
- **Patient Management** - View and manage patient records
- **Appointment Scheduling** - Manage patient appointments
- **Medical Records** - Access and update patient information

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

### Backend
- **Python Flask** - Web framework
- **SQLite** - Database
- **Flask-CORS** - Cross-origin resource sharing
- **Werkzeug** - Security utilities

## 📁 Project Structure

```
elyx/
├── index.html              # Main login page
├── member-dashboard.html   # Member dashboard
├── member-dashboard.css    # Member dashboard styles
├── member-dashboard.js     # Member dashboard functionality
├── profile.html           # Member profile page
├── profile.css            # Profile page styles
├── profile.js             # Profile page functionality
├── admin-panel.html       # Admin panel
├── admin-panel.css        # Admin panel styles
├── admin-panel.js         # Admin panel functionality
├── styles.css             # Global styles
├── script.js              # Main JavaScript functionality
├── data-manager.js        # Data management utilities
├── data.json              # Sample user data
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── elyx.db               # SQLite database
└── README.md             # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Modern web browser
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrityunjay007ved/elyx.git
   cd elyx
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask backend**
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5001`

4. **Start the frontend server**
   ```bash
   python -m http.server 8000
   ```
   The frontend will be available at `http://localhost:8000`

5. **Access the application**
   - Frontend: http://localhost:8000
   - Backend API: http://localhost:5001

## 👥 User Types

### Member Users
- **Default Credentials**: `member@example.com` / `password123`
- **Features**: Profile management, appointment booking, health tracking

### Doctor Users
- **Default Credentials**: `doctor@example.com` / `doctor123`
- **Features**: Patient management, appointment scheduling

## 📋 Member Snapshot Fields

The member profile includes the following information:

1. **Personal Information**
   - Preferred Name
   - Date of Birth
   - Age (auto-calculated)
   - Gender Identity

2. **Location Information**
   - Primary Residence
   - Frequent Travel Hubs

3. **Professional Information**
   - Occupation / Business Commitments
   - Personal Assistant

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### System
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## 🎨 Design Features

- **Responsive Design** - Works on all device sizes
- **Modern UI** - Clean, professional interface
- **Smooth Animations** - Enhanced user experience
- **Accessibility** - WCAG compliant design
- **Dark/Light Mode Ready** - Easy theme switching

## 🔒 Security Features

- **Password Hashing** - Secure password storage
- **Session Management** - Secure user sessions
- **Input Validation** - Client and server-side validation
- **CORS Protection** - Cross-origin request handling
- **SQL Injection Prevention** - Parameterized queries

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
- Flask community for the excellent framework
- All contributors and testers

## 📞 Support

For support, email support@elyx.com or create an issue in this repository.

---

**Made with ❤️ for better healthcare**
