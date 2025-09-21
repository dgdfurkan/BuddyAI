// Notifications Management Module
class NotificationsManager {
    constructor() {
        this.permission = 'default';
        this.init();
    }

    async init() {
        await this.requestPermission();
        this.setupNotificationScheduler();
    }

    async requestPermission() {
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
            console.log('Notification permission:', this.permission);
        }
    }

    setupNotificationScheduler() {
        // Schedule notifications for routines
        this.scheduleRoutineNotifications();
        
        // Set up periodic checks
        setInterval(() => {
            this.checkScheduledNotifications();
        }, 60000); // Check every minute
    }

    scheduleRoutineNotifications() {
        const routines = window.routinesManager ? window.routinesManager.routines : [];
        
        routines.forEach(routine => {
            if (routine.notifications && routine.time) {
                this.scheduleRoutineNotification(routine);
            }
        });
    }

    scheduleRoutineNotification(routine) {
        const [hours, minutes] = routine.time.split(':').map(Number);
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const timeUntilNotification = scheduledTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.sendRoutineNotification(routine);
            // Reschedule for next day
            this.scheduleRoutineNotification(routine);
        }, timeUntilNotification);
    }

    sendRoutineNotification(routine) {
        if (this.permission !== 'granted') return;

        const options = {
            body: routine.description,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                routineId: routine.id,
                type: 'routine_reminder'
            },
            actions: [
                {
                    action: 'complete',
                    title: 'Tamamla',
                    icon: '/icons/icon-192x192.png'
                },
                {
                    action: 'snooze',
                    title: '5dk Sonra',
                    icon: '/icons/icon-192x192.png'
                }
            ],
            tag: `routine-${routine.id}`,
            renotify: true
        };

        const notification = new Notification(`${routine.icon} ${routine.name}`, options);
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }

    checkScheduledNotifications() {
        // Check if any notifications should be sent
        const routines = window.routinesManager ? window.routinesManager.routines : [];
        const now = new Date();
        
        routines.forEach(routine => {
            if (routine.notifications && routine.time) {
                const [hours, minutes] = routine.time.split(':').map(Number);
                const currentTime = now.getHours() * 60 + now.getMinutes();
                const routineTime = hours * 60 + minutes;
                
                // Send notification if it's time (within 1 minute tolerance)
                if (Math.abs(currentTime - routineTime) <= 1) {
                    this.sendRoutineNotification(routine);
                }
            }
        });
    }

    sendCustomNotification(title, body, options = {}) {
        if (this.permission !== 'granted') return;

        const defaultOptions = {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [100, 50, 100]
        };

        const notificationOptions = { ...defaultOptions, ...options };
        
        return new Notification(title, notificationOptions);
    }

    sendMotivationNotification() {
        const messages = [
            "Harika bir gün geçiriyorsun! 🌟",
            "Rutinlerinle ilerleme kaydediyorsun! 💪",
            "Bugün de başarılı bir gün! 🔥",
            "Motivasyonunu koruyorsun! ✨",
            "Hedeflerine yaklaşıyorsun! 🎯"
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        this.sendCustomNotification('BuddyAI Motivasyon', randomMessage, {
            tag: 'motivation',
            renotify: false
        });
    }

    sendStreakNotification(routineName, streakCount) {
        const messages = [
            `🔥 ${streakCount} günlük zincir! ${routineName} rutininde harika gidiyorsun!`,
            `💪 ${streakCount} gün üst üste! ${routineName} rutininde mükemmelsin!`,
            `🌟 ${streakCount} günlük başarı! ${routineName} rutininde süpersin!`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        this.sendCustomNotification('Zincir Başarısı!', randomMessage, {
            tag: 'streak',
            renotify: false
        });
    }

    sendGoalAchievementNotification(goalName) {
        this.sendCustomNotification('Hedef Tamamlandı! 🎉', 
            `${goalName} hedefini başarıyla tamamladın!`, {
            tag: 'goal_achievement',
            renotify: false
        });
    }

    // Push notification support (for future implementation)
    async registerForPushNotifications() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                });

                console.log('Push subscription:', subscription);
                return subscription;
            } catch (error) {
                console.error('Push registration failed:', error);
            }
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Notification settings
    enableNotifications() {
        localStorage.setItem('buddyai-notifications-enabled', 'true');
    }

    disableNotifications() {
        localStorage.setItem('buddyai-notifications-enabled', 'false');
    }

    isNotificationsEnabled() {
        return localStorage.getItem('buddyai-notifications-enabled') !== 'false';
    }

    // Snooze functionality
    snoozeNotification(routineId, minutes = 5) {
        setTimeout(() => {
            const routine = window.routinesManager ? 
                window.routinesManager.getRoutineById(routineId) : null;
            if (routine) {
                this.sendRoutineNotification(routine);
            }
        }, minutes * 60 * 1000);
    }

    // Test notification
    sendTestNotification() {
        this.sendCustomNotification('BuddyAI Test', 
            'Bildirimler düzgün çalışıyor! 🎉', {
            tag: 'test',
            renotify: false
        });
    }
}

// Initialize notifications manager
window.notificationsManager = new NotificationsManager();
