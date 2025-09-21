// Routines Management Module
class RoutinesManager {
    constructor() {
        this.routines = [];
        this.init();
    }

    init() {
        this.loadRoutines();
        this.setupDefaultRoutines();
    }

    loadRoutines() {
        const savedRoutines = localStorage.getItem('buddyai-routines');
        if (savedRoutines) {
            this.routines = JSON.parse(savedRoutines);
        }
    }

    saveRoutines() {
        localStorage.setItem('buddyai-routines', JSON.stringify(this.routines));
    }

    setupDefaultRoutines() {
        if (this.routines.length === 0) {
            this.routines = this.getDefaultRoutines();
            this.saveRoutines();
        }
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
                category: 'health',
                notifications: true,
                weeklyDays: null,
                customInterval: null
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
                category: 'health',
                notifications: true,
                weeklyDays: null,
                customInterval: null
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
                category: 'spiritual',
                notifications: true,
                weeklyDays: null,
                customInterval: null
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
                category: 'spiritual',
                notifications: true,
                weeklyDays: null,
                customInterval: null
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
                category: 'personal',
                notifications: true,
                weeklyDays: null,
                customInterval: null
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
                category: 'spiritual',
                notifications: true,
                weeklyDays: null,
                customInterval: null
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
                category: 'care',
                notifications: true,
                weeklyDays: null,
                customInterval: null
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
                category: 'health',
                notifications: true,
                weeklyDays: null,
                customInterval: null
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
                category: 'home',
                notifications: true,
                weeklyDays: [1, 3, 5], // Pazartesi, Çarşamba, Cuma
                customInterval: null
            }
        ];
    }

    addRoutine(routineData) {
        const newRoutine = {
            id: Date.now().toString(),
            name: routineData.name,
            description: routineData.description,
            icon: routineData.icon || '⭐',
            frequency: routineData.frequency,
            time: routineData.time,
            completed: false,
            streak: 0,
            category: routineData.category || 'custom',
            notifications: routineData.notifications !== false,
            weeklyDays: routineData.weeklyDays,
            customInterval: routineData.customInterval,
            createdAt: new Date().toISOString()
        };

        this.routines.push(newRoutine);
        this.saveRoutines();
        return newRoutine;
    }

    updateRoutine(routineId, updates) {
        const index = this.routines.findIndex(r => r.id === routineId);
        if (index !== -1) {
            this.routines[index] = { ...this.routines[index], ...updates };
            this.saveRoutines();
            return this.routines[index];
        }
        return null;
    }

    deleteRoutine(routineId) {
        const index = this.routines.findIndex(r => r.id === routineId);
        if (index !== -1) {
            this.routines.splice(index, 1);
            this.saveRoutines();
            return true;
        }
        return false;
    }

    completeRoutine(routineId) {
        const routine = this.routines.find(r => r.id === routineId);
        if (!routine) return false;

        const today = new Date().toDateString();
        const lastCompleted = routine.lastCompleted;
        
        // Check if already completed today
        if (lastCompleted && new Date(lastCompleted).toDateString() === today) {
            return false; // Already completed today
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

        this.saveRoutines();
        return true;
    }

    getRoutineById(routineId) {
        return this.routines.find(r => r.id === routineId);
    }

    getRoutinesByCategory(category) {
        return this.routines.filter(r => r.category === category);
    }

    getTodaysRoutines() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        return this.routines.filter(routine => {
            if (routine.frequency === 'daily') return true;
            if (routine.frequency === 'weekly') {
                return routine.weeklyDays && routine.weeklyDays.includes(dayOfWeek);
            }
            if (routine.frequency === 'custom') {
                // Custom interval logic
                if (routine.customInterval) {
                    const lastCompleted = routine.lastCompleted;
                    if (!lastCompleted) return true;
                    
                    const lastDate = new Date(lastCompleted);
                    const diffTime = today - lastDate;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    
                    return diffDays >= routine.customInterval;
                }
            }
            return false;
        });
    }

    getCompletedToday() {
        const today = new Date().toDateString();
        return this.routines.filter(routine => {
            const lastCompleted = routine.lastCompleted;
            return lastCompleted && new Date(lastCompleted).toDateString() === today;
        });
    }

    getRoutineStats(routineId) {
        const routine = this.getRoutineById(routineId);
        if (!routine) return null;

        const today = new Date().toDateString();
        const completedToday = routine.lastCompleted && 
            new Date(routine.lastCompleted).toDateString() === today;

        return {
            streak: routine.streak,
            completedToday,
            lastCompleted: routine.lastCompleted,
            totalCompletions: this.getTotalCompletions(routineId)
        };
    }

    getTotalCompletions(routineId) {
        // This would need to be implemented with a more detailed history
        // For now, we'll use streak as a proxy
        const routine = this.getRoutineById(routineId);
        return routine ? routine.streak : 0;
    }

    getMotivationMessage(completedCount, totalCount) {
        const percentage = totalCount > 0 ? completedCount / totalCount : 0;
        
        const messages = [
            { text: "Mükemmel! Tüm rutinlerin tamamlandı! 🎉", min: 1.0 },
            { text: "Harika bir gün geçiriyorsun! 🌟", min: 0.8 },
            { text: "Çok iyi gidiyorsun! 💪", min: 0.6 },
            { text: "Gayretli çalışıyorsun! 🔥", min: 0.4 },
            { text: "Başlamak için hiç geç değil! 🚀", min: 0.2 },
            { text: "Bugün yeni bir başlangıç yap! ✨", min: 0 }
        ];

        return messages.find(msg => percentage >= msg.min).text;
    }

    // Routine-specific methods
    getYemekRoutine() {
        return this.getRoutineById('yemek');
    }

    getSporRoutine() {
        return this.getRoutineById('spor');
    }

    getNamazRoutine() {
        return this.getRoutineById('namaz');
    }

    getEzberRoutine() {
        return this.getRoutineById('ezber');
    }

    getZincirRoutine() {
        return this.getRoutineById('zincir');
    }

    getSurelerRoutine() {
        return this.getRoutineById('sureler');
    }

    getEvcilHayvanRoutine() {
        return this.getRoutineById('evcil-hayvan');
    }

    getDisFircalamaRoutine() {
        return this.getRoutineById('dis-fircalama');
    }

    getEvTemizligiRoutine() {
        return this.getRoutineById('ev-temizligi');
    }
}

// Initialize routines manager
window.routinesManager = new RoutinesManager();
