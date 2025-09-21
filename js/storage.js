// Storage Management Module
class StorageManager {
    constructor() {
        this.storageKey = 'buddyai-data';
        this.init();
    }

    init() {
        this.checkStorageSupport();
        this.setupDataMigration();
    }

    checkStorageSupport() {
        if (!this.isStorageSupported()) {
            console.warn('LocalStorage not supported, using memory storage');
            this.useMemoryStorage = true;
            this.memoryStorage = {};
        }
    }

    isStorageSupported() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    setupDataMigration() {
        // Migrate old data format if needed
        this.migrateOldData();
    }

    migrateOldData() {
        const oldRoutines = localStorage.getItem('buddyai-routines');
        const oldTasks = localStorage.getItem('buddyai-tasks');
        const oldProgress = localStorage.getItem('buddyai-progress');

        if (oldRoutines || oldTasks || oldProgress) {
            const consolidatedData = {
                routines: oldRoutines ? JSON.parse(oldRoutines) : [],
                tasks: oldTasks ? JSON.parse(oldTasks) : [],
                progress: oldProgress ? JSON.parse(oldProgress) : {},
                settings: this.getSettings(),
                version: '1.0.0',
                lastUpdated: new Date().toISOString()
            };

            this.saveConsolidatedData(consolidatedData);
            
            // Clean up old keys
            localStorage.removeItem('buddyai-routines');
            localStorage.removeItem('buddyai-tasks');
            localStorage.removeItem('buddyai-progress');
        }
    }

    saveConsolidatedData(data) {
        if (this.useMemoryStorage) {
            this.memoryStorage = data;
        } else {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
    }

    loadConsolidatedData() {
        if (this.useMemoryStorage) {
            return this.memoryStorage;
        } else {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            routines: [],
            tasks: [],
            progress: {
                daily: {},
                weekly: {},
                monthly: {}
            },
            settings: this.getDefaultSettings(),
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
        };
    }

    // Routine storage methods
    saveRoutines(routines) {
        const data = this.loadConsolidatedData();
        data.routines = routines;
        data.lastUpdated = new Date().toISOString();
        this.saveConsolidatedData(data);
    }

    loadRoutines() {
        const data = this.loadConsolidatedData();
        return data.routines || [];
    }

    // Task storage methods
    saveTasks(tasks) {
        const data = this.loadConsolidatedData();
        data.tasks = tasks;
        data.lastUpdated = new Date().toISOString();
        this.saveConsolidatedData(data);
    }

    loadTasks() {
        const data = this.loadConsolidatedData();
        return data.tasks || [];
    }

    // Progress storage methods
    saveProgress(progress) {
        const data = this.loadConsolidatedData();
        data.progress = progress;
        data.lastUpdated = new Date().toISOString();
        this.saveConsolidatedData(data);
    }

    loadProgress() {
        const data = this.loadConsolidatedData();
        return data.progress || {
            daily: {},
            weekly: {},
            monthly: {}
        };
    }

    // Settings storage methods
    getDefaultSettings() {
        return {
            theme: 'light',
            notifications: true,
            soundEnabled: true,
            language: 'tr',
            timeFormat: '24',
            weekStart: 1, // Monday
            autoBackup: true,
            reminderTime: 5, // minutes before
            motivationalMessages: true,
            streakNotifications: true,
            achievementNotifications: true
        };
    }

    getSettings() {
        const data = this.loadConsolidatedData();
        return data.settings || this.getDefaultSettings();
    }

    saveSettings(settings) {
        const data = this.loadConsolidatedData();
        data.settings = { ...data.settings, ...settings };
        data.lastUpdated = new Date().toISOString();
        this.saveConsolidatedData(data);
    }

    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.saveSettings(settings);
    }

    // Backup and restore methods
    createBackup() {
        const data = this.loadConsolidatedData();
        const backup = {
            ...data,
            backupDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        return JSON.stringify(backup, null, 2);
    }

    restoreBackup(backupData) {
        try {
            const backup = JSON.parse(backupData);
            
            // Validate backup structure
            if (!backup.routines || !backup.tasks || !backup.progress) {
                throw new Error('Invalid backup format');
            }
            
            // Save backup data
            this.saveConsolidatedData(backup);
            
            return true;
        } catch (error) {
            console.error('Backup restore error:', error);
            return false;
        }
    }

    // Export methods
    exportToJSON() {
        return this.createBackup();
    }

    exportToCSV() {
        const data = this.loadConsolidatedData();
        const csv = this.convertToCSV(data);
        return csv;
    }

    convertToCSV(data) {
        let csv = 'Type,Name,Description,Date,Completed,Streak\n';
        
        // Add routines
        data.routines.forEach(routine => {
            csv += `Routine,"${routine.name}","${routine.description}",${routine.lastCompleted || ''},${routine.completed},${routine.streak}\n`;
        });
        
        // Add tasks
        data.tasks.forEach(task => {
            csv += `Task,"${task.title}","${task.description}",${task.date},${task.completed},0\n`;
        });
        
        return csv;
    }

    // Import methods
    importFromJSON(jsonData) {
        return this.restoreBackup(jsonData);
    }

    importFromCSV(csvData) {
        try {
            const lines = csvData.split('\n');
            const routines = [];
            const tasks = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const [type, name, description, date, completed, streak] = line.split(',');
                
                if (type === 'Routine') {
                    routines.push({
                        id: Date.now().toString() + i,
                        name: name.replace(/"/g, ''),
                        description: description.replace(/"/g, ''),
                        icon: '⭐',
                        frequency: 'daily',
                        time: '09:00',
                        completed: completed === 'true',
                        streak: parseInt(streak) || 0,
                        lastCompleted: date || null,
                        category: 'imported',
                        notifications: true,
                        weeklyDays: null,
                        customInterval: null
                    });
                } else if (type === 'Task') {
                    tasks.push({
                        id: Date.now().toString() + i,
                        title: name.replace(/"/g, ''),
                        description: description.replace(/"/g, ''),
                        date: date,
                        time: '',
                        priority: 'medium',
                        completed: completed === 'true',
                        createdAt: new Date().toISOString()
                    });
                }
            }
            
            const data = this.loadConsolidatedData();
            data.routines = [...data.routines, ...routines];
            data.tasks = [...data.tasks, ...tasks];
            data.lastUpdated = new Date().toISOString();
            
            this.saveConsolidatedData(data);
            return true;
        } catch (error) {
            console.error('CSV import error:', error);
            return false;
        }
    }

    // Storage management methods
    getStorageSize() {
        if (this.useMemoryStorage) {
            return JSON.stringify(this.memoryStorage).length;
        } else {
            return localStorage.getItem(this.storageKey) ? 
                localStorage.getItem(this.storageKey).length : 0;
        }
    }

    getStorageInfo() {
        const data = this.loadConsolidatedData();
        const size = this.getStorageSize();
        
        return {
            totalSize: size,
            routinesCount: data.routines.length,
            tasksCount: data.tasks.length,
            lastUpdated: data.lastUpdated,
            version: data.version,
            storageType: this.useMemoryStorage ? 'memory' : 'localStorage'
        };
    }

    clearAllData() {
        if (this.useMemoryStorage) {
            this.memoryStorage = this.getDefaultData();
        } else {
            localStorage.removeItem(this.storageKey);
        }
    }

    // Auto-backup functionality
    setupAutoBackup() {
        const settings = this.getSettings();
        if (settings.autoBackup) {
            // Backup every 24 hours
            setInterval(() => {
                this.performAutoBackup();
            }, 24 * 60 * 60 * 1000);
        }
    }

    performAutoBackup() {
        const backup = this.createBackup();
        const backupKey = `buddyai-backup-${new Date().toISOString().split('T')[0]}`;
        
        try {
            localStorage.setItem(backupKey, backup);
            
            // Keep only last 7 backups
            this.cleanupOldBackups();
        } catch (error) {
            console.error('Auto backup failed:', error);
        }
    }

    cleanupOldBackups() {
        const keys = Object.keys(localStorage);
        const backupKeys = keys.filter(key => key.startsWith('buddyai-backup-'));
        
        if (backupKeys.length > 7) {
            backupKeys.sort();
            const keysToRemove = backupKeys.slice(0, backupKeys.length - 7);
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
        }
    }

    // Data validation
    validateData(data) {
        const requiredFields = ['routines', 'tasks', 'progress'];
        
        for (const field of requiredFields) {
            if (!data.hasOwnProperty(field)) {
                return false;
            }
        }
        
        return true;
    }

    // Data repair
    repairData() {
        const data = this.loadConsolidatedData();
        
        // Ensure all required fields exist
        if (!data.routines) data.routines = [];
        if (!data.tasks) data.tasks = [];
        if (!data.progress) data.progress = { daily: {}, weekly: {}, monthly: {} };
        if (!data.settings) data.settings = this.getDefaultSettings();
        
        // Validate routine structure
        data.routines = data.routines.filter(routine => {
            return routine.id && routine.name && routine.frequency;
        });
        
        // Validate task structure
        data.tasks = data.tasks.filter(task => {
            return task.id && task.title && task.date;
        });
        
        this.saveConsolidatedData(data);
        return true;
    }
}

// Initialize storage manager
window.storageManager = new StorageManager();
