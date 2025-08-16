// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.dataManager = window.dataManager;
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateStatistics();
        this.renderUsersTable();
        this.renderLoginHistoryTable();
    }

    async loadData() {
        // Wait for data manager to be ready
        while (!this.dataManager.data) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    setupEventListeners() {
        // Add user form submission
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => this.handleAddUser(e));
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('addUserModal');
            if (e.target === modal) {
                this.closeAddUserModal();
            }
        });
    }

    updateStatistics() {
        const stats = this.dataManager.getStats();
        if (stats) {
            document.getElementById('totalUsers').textContent = stats.totalUsers;
            document.getElementById('memberUsers').textContent = stats.memberUsers;
            document.getElementById('doctorUsers').textContent = stats.doctorUsers;
            document.getElementById('totalLogins').textContent = stats.totalLogins;
        }
    }

    renderUsersTable() {
        const users = this.dataManager.getUsers();
        const tbody = document.getElementById('usersTableBody');
        
        if (!tbody) return;

        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="user-type ${user.userType}">
                        ${user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                    </span>
                </td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>${this.formatDate(user.lastLogin)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="adminPanel.editUser('${user.email}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="adminPanel.deleteUser('${user.email}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderLoginHistoryTable() {
        const loginHistory = this.dataManager.getLoginHistory();
        const tbody = document.getElementById('loginHistoryTableBody');
        
        if (!tbody) return;

        tbody.innerHTML = '';
        
        // Show most recent first
        const recentLogins = loginHistory.slice().reverse();
        
        recentLogins.forEach(login => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${login.id}</td>
                <td>${login.email}</td>
                <td>
                    <span class="user-type ${login.userType}">
                        ${login.userType.charAt(0).toUpperCase() + login.userType.slice(1)}
                    </span>
                </td>
                <td>${this.formatDate(login.loginTime)}</td>
                <td>
                    <span class="status-${login.success ? 'success' : 'failed'}">
                        ${login.success ? 'Success' : 'Failed'}
                    </span>
                </td>
                <td>${login.ipAddress}</td>
            `;
            tbody.appendChild(row);
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    async handleAddUser(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            userType: formData.get('userType')
        };

        try {
            // Check if user already exists
            const existingUser = this.dataManager.getUserByEmail(userData.email);
            if (existingUser) {
                this.showNotification('User with this email already exists!', 'error');
                return;
            }

            await this.dataManager.addUser(userData);
            this.showNotification('User added successfully!', 'success');
            this.closeAddUserModal();
            this.refreshData();
        } catch (error) {
            console.error('Error adding user:', error);
            this.showNotification('Error adding user. Please try again.', 'error');
        }
    }

    async editUser(email) {
        const user = this.dataManager.getUserByEmail(email);
        if (!user) {
            this.showNotification('User not found!', 'error');
            return;
        }

        // For now, just show user info
        this.showNotification(`Editing user: ${user.name} (${user.email})`, 'info');
        // In a real app, you would open an edit modal
    }

    async deleteUser(email) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const deletedUser = await this.dataManager.deleteUser(email);
            if (deletedUser) {
                this.showNotification('User deleted successfully!', 'success');
                this.refreshData();
            } else {
                this.showNotification('User not found!', 'error');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showNotification('Error deleting user. Please try again.', 'error');
        }
    }

    refreshData() {
        this.updateStatistics();
        this.renderUsersTable();
        this.renderLoginHistoryTable();
    }

    showAddUserModal() {
        const modal = document.getElementById('addUserModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeAddUserModal() {
        const modal = document.getElementById('addUserModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Reset form
            const form = document.getElementById('addUserForm');
            if (form) {
                form.reset();
            }
        }
    }

    exportData() {
        const data = this.dataManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elyx-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
    }

    async importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const success = await this.dataManager.importData(text);
            
            if (success) {
                this.showNotification('Data imported successfully!', 'success');
                this.refreshData();
            } else {
                this.showNotification('Error importing data. Please check the file format.', 'error');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            this.showNotification('Error importing data. Please try again.', 'error');
        }

        // Reset file input
        event.target.value = '';
    }

    showNotification(message, type = 'info') {
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
}

// Global functions for HTML onclick handlers
function logout() {
    window.location.href = 'index.html';
}

function showAddUserModal() {
    if (window.adminPanel) {
        window.adminPanel.showAddUserModal();
    }
}

function closeAddUserModal() {
    if (window.adminPanel) {
        window.adminPanel.closeAddUserModal();
    }
}

function refreshData() {
    if (window.adminPanel) {
        window.adminPanel.refreshData();
    }
}

function exportData() {
    if (window.adminPanel) {
        window.adminPanel.exportData();
    }
}

function importData(event) {
    if (window.adminPanel) {
        window.adminPanel.importData(event);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminPanel = new AdminPanel();
});
