// Progress Tracking Module
class ProgressManager {
    constructor() {
        this.progressData = {
            daily: {},
            weekly: {},
            monthly: {}
        };
        this.currentPeriod = 'daily';
        this.init();
    }

    init() {
        this.loadProgressData();
        this.setupEventListeners();
        this.updateProgress();
    }

    loadProgressData() {
        const savedProgress = localStorage.getItem('buddyai-progress');
        if (savedProgress) {
            this.progressData = JSON.parse(savedProgress);
        }
    }

    saveProgressData() {
        localStorage.setItem('buddyai-progress', JSON.stringify(this.progressData));
    }

    setupEventListeners() {
        // Period selector buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('period-btn')) {
                const period = e.target.dataset.period;
                this.selectPeriod(period);
            }
        });
    }

    selectPeriod(period) {
        this.currentPeriod = period;
        
        // Update button states
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        this.updateProgress();
    }

    updateProgress() {
        const container = document.getElementById('progress-content');
        if (!container) return;

        switch (this.currentPeriod) {
            case 'daily':
                this.renderDailyProgress(container);
                break;
            case 'weekly':
                this.renderWeeklyProgress(container);
                break;
            case 'monthly':
                this.renderMonthlyProgress(container);
                break;
        }
    }

    renderDailyProgress(container) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        const routines = window.routinesManager ? window.routinesManager.routines : [];
        const todaysRoutines = window.routinesManager ? window.routinesManager.getTodaysRoutines() : [];
        const completedToday = window.routinesManager ? window.routinesManager.getCompletedToday() : [];
        
        const completionRate = todaysRoutines.length > 0 ? 
            (completedToday.length / todaysRoutines.length) * 100 : 0;

        container.innerHTML = `
            <div class="progress-summary">
                <div class="progress-stat">
                    <h3>Bugünkü İlerleme</h3>
                    <div class="progress-circle">
                        <div class="progress-percentage">${Math.round(completionRate)}%</div>
                        <div class="progress-label">Tamamlandı</div>
                    </div>
                </div>
                
                <div class="progress-details">
                    <div class="detail-item">
                        <span class="detail-label">Tamamlanan Rutinler</span>
                        <span class="detail-value">${completedToday.length}/${todaysRoutines.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Aktif Zincirler</span>
                        <span class="detail-value">${this.getActiveStreaks()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Toplam Süre</span>
                        <span class="detail-value">${this.calculateTotalTime()} dk</span>
                    </div>
                </div>
            </div>
            
            <div class="routine-progress">
                <h3>Rutin Detayları</h3>
                <div class="routine-list">
                    ${todaysRoutines.map(routine => this.renderRoutineProgress(routine)).join('')}
                </div>
            </div>
        `;
    }

    renderWeeklyProgress(container) {
        const weekStart = this.getWeekStart();
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const weekData = this.getWeekData(weekStart);
        const weeklyCompletionRate = this.calculateWeeklyCompletionRate(weekData);

        container.innerHTML = `
            <div class="progress-summary">
                <div class="progress-stat">
                    <h3>Haftalık İlerleme</h3>
                    <div class="progress-circle">
                        <div class="progress-percentage">${Math.round(weeklyCompletionRate)}%</div>
                        <div class="progress-label">Tamamlandı</div>
                    </div>
                </div>
                
                <div class="progress-details">
                    <div class="detail-item">
                        <span class="detail-label">Haftalık Hedef</span>
                        <span class="detail-value">${weekData.totalPossible} rutin</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tamamlanan</span>
                        <span class="detail-value">${weekData.completed} rutin</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">En Uzun Zincir</span>
                        <span class="detail-value">${weekData.longestStreak} gün</span>
                    </div>
                </div>
            </div>
            
            <div class="weekly-chart">
                <h3>Günlük İlerleme</h3>
                <div class="chart-container">
                    ${this.renderWeeklyChart(weekData)}
                </div>
            </div>
        `;
    }

    renderMonthlyProgress(container) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const monthData = this.getMonthData(monthStart);
        const monthlyCompletionRate = this.calculateMonthlyCompletionRate(monthData);

        container.innerHTML = `
            <div class="progress-summary">
                <div class="progress-stat">
                    <h3>Aylık İlerleme</h3>
                    <div class="progress-circle">
                        <div class="progress-percentage">${Math.round(monthlyCompletionRate)}%</div>
                        <div class="progress-label">Tamamlandı</div>
                    </div>
                </div>
                
                <div class="progress-details">
                    <div class="detail-item">
                        <span class="detail-label">Aylık Hedef</span>
                        <span class="detail-value">${monthData.totalPossible} rutin</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tamamlanan</span>
                        <span class="detail-value">${monthData.completed} rutin</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Başarılı Günler</span>
                        <span class="detail-value">${monthData.successfulDays} gün</span>
                    </div>
                </div>
            </div>
            
            <div class="monthly-chart">
                <h3>Haftalık İlerleme</h3>
                <div class="chart-container">
                    ${this.renderMonthlyChart(monthData)}
                </div>
            </div>
            
            <div class="achievements">
                <h3>Bu Ayın Başarıları</h3>
                <div class="achievement-list">
                    ${this.renderAchievements(monthData)}
                </div>
            </div>
        `;
    }

    renderRoutineProgress(routine) {
        const stats = window.routinesManager ? 
            window.routinesManager.getRoutineStats(routine.id) : null;
        
        if (!stats) return '';

        return `
            <div class="routine-progress-item">
                <div class="routine-info">
                    <span class="routine-icon">${routine.icon}</span>
                    <div class="routine-details">
                        <h4>${routine.name}</h4>
                        <p>${routine.description}</p>
                    </div>
                </div>
                <div class="routine-stats">
                    <div class="stat-item">
                        <span class="stat-label">Zincir</span>
                        <span class="stat-value">${stats.streak} gün</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Durum</span>
                        <span class="stat-value ${stats.completedToday ? 'completed' : 'pending'}">
                            ${stats.completedToday ? 'Tamamlandı' : 'Bekliyor'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    renderWeeklyChart(weekData) {
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        
        return `
            <div class="weekly-chart-bars">
                ${weekData.dailyData.map((dayData, index) => {
                    const height = dayData.total > 0 ? (dayData.completed / dayData.total) * 100 : 0;
                    return `
                        <div class="chart-bar">
                            <div class="bar-container">
                                <div class="bar-fill" style="height: ${height}%"></div>
                            </div>
                            <div class="bar-label">${days[index]}</div>
                            <div class="bar-value">${dayData.completed}/${dayData.total}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderMonthlyChart(monthData) {
        const weeks = monthData.weeklyData;
        
        return `
            <div class="monthly-chart-bars">
                ${weeks.map((weekData, index) => {
                    const height = weekData.total > 0 ? (weekData.completed / weekData.total) * 100 : 0;
                    return `
                        <div class="chart-bar">
                            <div class="bar-container">
                                <div class="bar-fill" style="height: ${height}%"></div>
                            </div>
                            <div class="bar-label">Hafta ${index + 1}</div>
                            <div class="bar-value">${weekData.completed}/${weekData.total}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderAchievements(monthData) {
        const achievements = [];
        
        if (monthData.completed >= 100) {
            achievements.push({
                title: 'Rutin Ustası',
                description: '100+ rutin tamamladın!',
                icon: '🏆'
            });
        }
        
        if (monthData.successfulDays >= 20) {
            achievements.push({
                title: 'Tutarlılık Kahramanı',
                description: '20+ gün başarılı oldun!',
                icon: '🔥'
            });
        }
        
        if (monthData.longestStreak >= 7) {
            achievements.push({
                title: 'Zincir Ustası',
                description: '7+ günlük zincir kırdın!',
                icon: '🔗'
            });
        }

        if (achievements.length === 0) {
            return '<p class="no-achievements">Henüz başarı yok. Devam et! 💪</p>';
        }

        return achievements.map(achievement => `
            <div class="achievement-item">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-details">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `).join('');
    }

    getWeekStart() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday
        return new Date(now.setDate(diff));
    }

    getWeekData(weekStart) {
        const dailyData = [];
        const routines = window.routinesManager ? window.routinesManager.routines : [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayRoutines = routines.filter(routine => {
                if (routine.frequency === 'daily') return true;
                if (routine.frequency === 'weekly') {
                    return routine.weeklyDays && routine.weeklyDays.includes(date.getDay());
                }
                return false;
            });
            
            const completedToday = dayRoutines.filter(routine => {
                return routine.lastCompleted && 
                    new Date(routine.lastCompleted).toISOString().split('T')[0] === dateStr;
            });
            
            dailyData.push({
                date: dateStr,
                total: dayRoutines.length,
                completed: completedToday.length
            });
        }
        
        return {
            dailyData,
            totalPossible: dailyData.reduce((sum, day) => sum + day.total, 0),
            completed: dailyData.reduce((sum, day) => sum + day.completed, 0),
            longestStreak: this.calculateLongestStreak(dailyData)
        };
    }

    getMonthData(monthStart) {
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);
        
        const weeklyData = [];
        const routines = window.routinesManager ? window.routinesManager.routines : [];
        
        let currentWeekStart = new Date(monthStart);
        
        while (currentWeekStart <= monthEnd) {
            const weekData = this.getWeekData(currentWeekStart);
            weeklyData.push(weekData);
            
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        }
        
        return {
            weeklyData,
            totalPossible: weeklyData.reduce((sum, week) => sum + week.totalPossible, 0),
            completed: weeklyData.reduce((sum, week) => sum + week.completed, 0),
            successfulDays: this.calculateSuccessfulDays(monthStart, monthEnd),
            longestStreak: Math.max(...weeklyData.map(week => week.longestStreak))
        };
    }

    calculateWeeklyCompletionRate(weekData) {
        return weekData.totalPossible > 0 ? 
            (weekData.completed / weekData.totalPossible) * 100 : 0;
    }

    calculateMonthlyCompletionRate(monthData) {
        return monthData.totalPossible > 0 ? 
            (monthData.completed / monthData.totalPossible) * 100 : 0;
    }

    calculateLongestStreak(dailyData) {
        let currentStreak = 0;
        let longestStreak = 0;
        
        dailyData.forEach(day => {
            if (day.completed > 0) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });
        
        return longestStreak;
    }

    calculateSuccessfulDays(monthStart, monthEnd) {
        const routines = window.routinesManager ? window.routinesManager.routines : [];
        let successfulDays = 0;
        
        for (let date = new Date(monthStart); date <= monthEnd; date.setDate(date.getDate() + 1)) {
            const dateStr = date.toISOString().split('T')[0];
            
            const dayRoutines = routines.filter(routine => {
                if (routine.frequency === 'daily') return true;
                if (routine.frequency === 'weekly') {
                    return routine.weeklyDays && routine.weeklyDays.includes(date.getDay());
                }
                return false;
            });
            
            const completedToday = dayRoutines.filter(routine => {
                return routine.lastCompleted && 
                    new Date(routine.lastCompleted).toISOString().split('T')[0] === dateStr;
            });
            
            if (completedToday.length > 0) {
                successfulDays++;
            }
        }
        
        return successfulDays;
    }

    getActiveStreaks() {
        const routines = window.routinesManager ? window.routinesManager.routines : [];
        return routines.filter(routine => routine.streak > 0).length;
    }

    calculateTotalTime() {
        // Estimate 15 minutes per routine
        const completedToday = window.routinesManager ? window.routinesManager.getCompletedToday() : [];
        return completedToday.length * 15;
    }

    // Export progress data
    exportProgressData() {
        const data = {
            exportDate: new Date().toISOString(),
            progressData: this.progressData,
            routines: window.routinesManager ? window.routinesManager.routines : [],
            tasks: window.calendarManager ? window.calendarManager.tasks : []
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `buddyai-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import progress data
    importProgressData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.progressData) {
                    this.progressData = data.progressData;
                    this.saveProgressData();
                }
                
                if (data.routines && window.routinesManager) {
                    window.routinesManager.routines = data.routines;
                    window.routinesManager.saveRoutines();
                }
                
                if (data.tasks && window.calendarManager) {
                    window.calendarManager.tasks = data.tasks;
                    window.calendarManager.saveTasks();
                }
                
                this.updateProgress();
                
                if (window.app) {
                    window.app.showNotification('Veriler başarıyla içe aktarıldı! 📊', 'success');
                }
            } catch (error) {
                console.error('Import error:', error);
                if (window.app) {
                    window.app.showNotification('Veri içe aktarma hatası! ❌', 'error');
                }
            }
        };
        reader.readAsText(file);
    }
}

// Initialize progress manager
window.progressManager = new ProgressManager();
