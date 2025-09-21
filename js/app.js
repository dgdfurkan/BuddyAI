// BuddyAI Main Application
class BuddyAI {
    constructor() {
        this.currentPage = 'dashboard';
        this.routines = [];
        this.tasks = [];
        this.progress = {
            daily: {},
            weekly: {},
            monthly: {}
        };
        
        this.init();
    }

    async init() {
        // Show loading screen
        this.showLoadingScreen();
        
        // Initialize components
        await this.loadData();
        this.setupEventListeners();
        this.loadTheme();
        this.updateCurrentDate();
        this.updateDashboard();
        
        // Hide loading screen
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 1500);
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
    }

    async loadData() {
        // Load routines from localStorage
        const savedRoutines = localStorage.getItem('buddyai-routines');
        if (savedRoutines) {
            this.routines = JSON.parse(savedRoutines);
        } else {
            // Initialize with default routines
            this.routines = this.getDefaultRoutines();
            this.saveData();
        }

        // Load tasks from localStorage
        const savedTasks = localStorage.getItem('buddyai-tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }

        // Load progress from localStorage
        const savedProgress = localStorage.getItem('buddyai-progress');
        if (savedProgress) {
            this.progress = JSON.parse(savedProgress);
        }
    }

    saveData() {
        localStorage.setItem('buddyai-routines', JSON.stringify(this.routines));
        localStorage.setItem('buddyai-tasks', JSON.stringify(this.tasks));
        localStorage.setItem('buddyai-progress', JSON.stringify(this.progress));
    }

    loadTheme() {
        const settings = window.storageManager ? window.storageManager.getSettings() : {};
        const theme = settings.theme || 'light';
        this.applyTheme(theme);
    }

    getDefaultRoutines() {
        return [
            {
                id: 'yemek',
                name: 'Yemek Rutini',
                description: 'Günlük öğün planlaması ve kalori takibi',
                icon: '🍽️',
                frequency: 'daily',
                time: '08:00',
                completed: false,
                streak: 0,
                category: 'health'
            },
            {
                id: 'spor',
                name: 'Spor Rutini',
                description: 'Egzersiz planlaması ve kalori yakım takibi',
                icon: '💪',
                frequency: 'daily',
                time: '18:00',
                completed: false,
                streak: 0,
                category: 'health'
            },
            {
                id: 'namaz',
                name: 'Namaz Rutini',
                description: 'Namaz vakitleri ve dua takibi',
                icon: '🕌',
                frequency: 'daily',
                time: '05:00',
                completed: false,
                streak: 0,
                category: 'spiritual'
            },
            {
                id: 'ezber',
                name: 'Ezber Rutini',
                description: 'Sure ezberleme ve tekrar sistemi',
                icon: '📖',
                frequency: 'daily',
                time: '20:00',
                completed: false,
                streak: 0,
                category: 'spiritual'
            },
            {
                id: 'zincir',
                name: 'Zincir Rutini',
                description: 'Kötü alışkanlık kırma ve motivasyon',
                icon: '🔗',
                frequency: 'daily',
                time: '22:00',
                completed: false,
                streak: 0,
                category: 'personal'
            },
            {
                id: 'sureler',
                name: 'Sureler Rutini',
                description: 'Kur\'an okuma takibi ve sure listesi',
                icon: '📜',
                frequency: 'daily',
                time: '19:00',
                completed: false,
                streak: 0,
                category: 'spiritual'
            },
            {
                id: 'evcil-hayvan',
                name: 'Evcil Hayvan Besleme',
                description: 'Besleme zamanları ve sağlık takibi',
                icon: '🐕',
                frequency: 'daily',
                time: '07:00',
                completed: false,
                streak: 0,
                category: 'care'
            },
            {
                id: 'dis-fircalama',
                name: 'Diş Fırçalama',
                description: 'Günlük fırçalama takibi ve hatırlatıcılar',
                icon: '🦷',
                frequency: 'daily',
                time: '21:00',
                completed: false,
                streak: 0,
                category: 'health'
            },
            {
                id: 'ev-temizligi',
                name: 'Ev Temizliği',
                description: 'Temizlik planlaması ve haftalık görevler',
                icon: '🧹',
                frequency: 'weekly',
                time: '10:00',
                completed: false,
                streak: 0,
                category: 'home'
            }
        ];
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Add routine button
        document.getElementById('add-routine-btn').addEventListener('click', () => {
            this.showModal('add-routine-modal');
        });

        // Add task button
        document.getElementById('add-task-btn').addEventListener('click', () => {
            this.showModal('add-task-modal');
        });

        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettingsModal();
        });

        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal();
            });
        });

        // Modal overlay click
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });

        // Add routine form
        document.getElementById('add-routine-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRoutine();
        });

        // Period selector buttons
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.currentTarget.dataset.period;
                this.selectPeriod(period);
            });
        });
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');

        this.currentPage = page;

        // Update page content
        switch (page) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'routines':
                this.updateRoutinesPage();
                break;
            case 'calendar':
                this.updateCalendarPage();
                break;
            case 'progress':
                this.updateProgressPage();
                break;
        }
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('tr-TR', options);
        document.getElementById('current-date').textContent = dateString;
    }

    updateDashboard() {
        const today = new Date().toDateString();
        const todayRoutines = this.routines.filter(routine => {
            if (routine.frequency === 'daily') return true;
            if (routine.frequency === 'weekly') {
                const dayOfWeek = new Date().getDay();
                return routine.weeklyDays && routine.weeklyDays.includes(dayOfWeek);
            }
            return false;
        });

        const completedToday = todayRoutines.filter(routine => {
            const lastCompleted = routine.lastCompleted;
            return lastCompleted && new Date(lastCompleted).toDateString() === today;
        });

        // Update progress
        document.getElementById('completed-routines').textContent = completedToday.length;
        document.getElementById('total-routines').textContent = todayRoutines.length;
        
        const progressPercentage = todayRoutines.length > 0 ? 
            (completedToday.length / todayRoutines.length) * 100 : 0;
        document.getElementById('daily-progress').style.width = `${progressPercentage}%`;

        // Update motivation message
        this.updateMotivationMessage(completedToday.length, todayRoutines.length);

        // Update quick access
        this.updateQuickAccess();
    }

    updateMotivationMessage(completed, total) {
        const messages = [
            { text: "Harika bir gün geçiriyorsun! 🌟", min: 0.8 },
            { text: "Çok iyi gidiyorsun! 💪", min: 0.6 },
            { text: "Gayretli çalışıyorsun! 🔥", min: 0.4 },
            { text: "Başlamak için hiç geç değil! 🚀", min: 0.2 },
            { text: "Bugün yeni bir başlangıç yap! ✨", min: 0 }
        ];

        const percentage = total > 0 ? completed / total : 0;
        const message = messages.find(msg => percentage >= msg.min);
        
        document.getElementById('motivation-message').textContent = message.text;
    }

    updateQuickAccess() {
        const quickRoutines = this.routines.slice(0, 4);
        const container = document.getElementById('quick-routines');
        
        container.innerHTML = quickRoutines.map(routine => `
            <button class="quick-routine-btn" onclick="app.completeRoutine('${routine.id}')">
                <div class="quick-routine-icon">${routine.icon}</div>
                <div class="quick-routine-name">${routine.name}</div>
            </button>
        `).join('');
    }

    updateRoutinesPage() {
        const container = document.getElementById('routines-list');
        
        container.innerHTML = this.routines.map(routine => `
            <div class="routine-card" onclick="app.showRoutineDetails('${routine.id}')">
                <div class="routine-header">
                    <h3 class="routine-name">${routine.name}</h3>
                    <span class="routine-icon">${routine.icon}</span>
                </div>
                <p class="routine-description">${routine.description}</p>
                <div class="routine-stats">
                    <div class="routine-streak">
                        <span>🔥</span>
                        <span>${routine.streak} gün</span>
                    </div>
                    <span class="routine-status ${routine.completed ? 'completed' : 'pending'}">
                        ${routine.completed ? 'Tamamlandı' : 'Bekliyor'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateCalendarPage() {
        // Calendar implementation will be in calendar.js
        if (window.calendarManager) {
            window.calendarManager.updateCalendar();
        }
    }

    updateProgressPage() {
        // Progress implementation will be in progress.js
        if (window.progressManager) {
            window.progressManager.updateProgress();
        }
    }

    completeRoutine(routineId) {
        const routine = this.routines.find(r => r.id === routineId);
        if (!routine) return;

        const today = new Date().toDateString();
        const lastCompleted = routine.lastCompleted;
        
        // Check if already completed today
        if (lastCompleted && new Date(lastCompleted).toDateString() === today) {
            alert('Bu rutin bugün zaten tamamlandı!');
            return;
        }

        // Mark as completed
        routine.completed = true;
        routine.lastCompleted = new Date().toISOString();
        
        // Update streak
        if (lastCompleted) {
            const lastDate = new Date(lastCompleted);
            const todayDate = new Date();
            const diffTime = todayDate - lastDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                routine.streak++;
            } else if (diffDays > 1) {
                routine.streak = 1;
            }
        } else {
            routine.streak = 1;
        }

        this.saveData();
        this.updateDashboard();
        this.updateRoutinesPage();

        // Show success message
        this.showNotification(`${routine.name} tamamlandı! 🔥`, 'success');
    }

    addRoutine() {
        const form = document.getElementById('add-routine-form');
        const formData = new FormData(form);
        
        const newRoutine = {
            id: Date.now().toString(),
            name: document.getElementById('routine-name').value,
            description: document.getElementById('routine-description').value,
            icon: '⭐',
            frequency: document.getElementById('routine-frequency').value,
            time: document.getElementById('routine-time').value,
            completed: false,
            streak: 0,
            category: 'custom'
        };

        this.routines.push(newRoutine);
        this.saveData();
        this.updateRoutinesPage();
        this.hideModal();
        
        // Reset form
        form.reset();
        
        this.showNotification('Yeni rutin eklendi! 🎉', 'success');
    }

    showRoutineDetails(routineId) {
        const routine = this.routines.find(r => r.id === routineId);
        if (!routine) return;

        // Show routine details modal
        alert(`${routine.name} detayları:\n\nAçıklama: ${routine.description}\nSıklık: ${routine.frequency}\nSaat: ${routine.time}\nZincir: ${routine.streak} gün`);
    }

    selectPeriod(period) {
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        this.updateProgressPage();
    }

    showSettingsModal() {
        this.showModal('settings-modal');
        this.loadSettings();
        this.setupSettingsEventListeners();
    }

    loadSettings() {
        const settings = window.storageManager ? window.storageManager.getSettings() : {};
        
        // Load notification settings
        document.getElementById('notifications-enabled').checked = settings.notifications !== false;
        document.getElementById('motivational-messages').checked = settings.motivationalMessages !== false;
        document.getElementById('streak-notifications').checked = settings.streakNotifications !== false;
        
        // Load theme setting
        document.getElementById('theme-select').value = settings.theme || 'light';
    }

    setupSettingsEventListeners() {
        // Notification settings
        document.getElementById('notifications-enabled').addEventListener('change', (e) => {
            this.updateSetting('notifications', e.target.checked);
        });

        document.getElementById('motivational-messages').addEventListener('change', (e) => {
            this.updateSetting('motivationalMessages', e.target.checked);
        });

        document.getElementById('streak-notifications').addEventListener('change', (e) => {
            this.updateSetting('streakNotifications', e.target.checked);
        });

        // Theme setting
        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.updateSetting('theme', e.target.value);
            this.applyTheme(e.target.value);
        });

        // Data management
        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-data-btn').addEventListener('click', () => {
            document.getElementById('import-data-input').click();
        });

        document.getElementById('import-data-input').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            this.clearAllData();
        });
    }

    updateSetting(key, value) {
        if (window.storageManager) {
            window.storageManager.updateSetting(key, value);
        }
    }

    applyTheme(theme) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('theme-light', 'theme-dark');
        
        if (theme === 'dark') {
            body.classList.add('theme-dark');
        } else if (theme === 'light') {
            body.classList.add('theme-light');
        } else if (theme === 'auto') {
            // Auto theme based on system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                body.classList.add('theme-dark');
            } else {
                body.classList.add('theme-light');
            }
        }
    }

    exportData() {
        if (window.storageManager) {
            const data = window.storageManager.exportToJSON();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `buddyai-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Veriler başarıyla dışa aktarıldı! 📊', 'success');
        }
    }

    importData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (window.storageManager) {
                    const success = window.storageManager.importFromJSON(e.target.result);
                    if (success) {
                        this.showNotification('Veriler başarıyla içe aktarıldı! 📊', 'success');
                        // Reload the app
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        this.showNotification('Veri içe aktarma hatası! ❌', 'error');
                    }
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('Veri içe aktarma hatası! ❌', 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('Tüm verileriniz silinecek. Bu işlem geri alınamaz. Emin misiniz?')) {
            if (window.storageManager) {
                window.storageManager.clearAllData();
                this.showNotification('Tüm veriler temizlendi! 🗑️', 'success');
                // Reload the app
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        }
    }

    hideModal() {
        document.getElementById('modal-overlay').classList.remove('active');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#4F46E5'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BuddyAI();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
