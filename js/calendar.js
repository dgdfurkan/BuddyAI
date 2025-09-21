// Calendar Management Module
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.tasks = [];
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.updateCalendar();
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('buddyai-tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }

    saveTasks() {
        localStorage.setItem('buddyai-tasks', JSON.stringify(this.tasks));
    }

    setupEventListeners() {
        // Calendar navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day')) {
                const dateStr = e.target.dataset.date;
                this.selectDate(new Date(dateStr));
            }
            
            if (e.target.classList.contains('calendar-prev')) {
                this.previousMonth();
            }
            
            if (e.target.classList.contains('calendar-next')) {
                this.nextMonth();
            }
        });
    }

    updateCalendar() {
        const container = document.getElementById('calendar-view');
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

        let calendarHTML = `
            <div class="calendar-header">
                <button class="calendar-nav calendar-prev">‹</button>
                <h3 class="calendar-title">${monthNames[month]} ${year}</h3>
                <button class="calendar-nav calendar-next">›</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-weekdays">
                    ${dayNames.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
                </div>
                <div class="calendar-days">
        `;

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = this.isToday(date);
            const isSelected = this.isSelectedDate(date);
            const hasTasks = this.hasTasksOnDate(date);
            
            const dayClasses = [
                'calendar-day',
                isToday ? 'today' : '',
                isSelected ? 'selected' : '',
                hasTasks ? 'has-tasks' : ''
            ].filter(Boolean).join(' ');

            calendarHTML += `
                <div class="${dayClasses}" data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                    ${hasTasks ? '<div class="task-indicator"></div>' : ''}
                </div>
            `;
        }

        calendarHTML += `
                </div>
            </div>
        `;

        container.innerHTML = calendarHTML;
        this.updateTaskList();
    }

    selectDate(date) {
        this.selectedDate = new Date(date);
        this.updateCalendar();
        this.updateTaskList();
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.updateCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.updateCalendar();
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isSelectedDate(date) {
        return date.toDateString() === this.selectedDate.toDateString();
    }

    hasTasksOnDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.tasks.some(task => task.date === dateStr);
    }

    updateTaskList() {
        const dateStr = this.selectedDate.toISOString().split('T')[0];
        const dayTasks = this.tasks.filter(task => task.date === dateStr);
        
        // Create task list container if it doesn't exist
        let taskListContainer = document.getElementById('task-list');
        if (!taskListContainer) {
            taskListContainer = document.createElement('div');
            taskListContainer.id = 'task-list';
            taskListContainer.className = 'task-list';
            
            const calendarContainer = document.getElementById('calendar-view');
            calendarContainer.appendChild(taskListContainer);
        }

        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = this.selectedDate.toLocaleDateString('tr-TR', dateOptions);

        taskListContainer.innerHTML = `
            <div class="task-list-header">
                <h4>${formattedDate} Görevleri</h4>
                <button class="add-task-btn" onclick="calendarManager.showAddTaskModal()">+ Görev Ekle</button>
            </div>
            <div class="task-items">
                ${dayTasks.length > 0 ? 
                    dayTasks.map(task => this.renderTask(task)).join('') :
                    '<p class="no-tasks">Bu gün için görev yok.</p>'
                }
            </div>
        `;
    }

    renderTask(task) {
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} 
                               onchange="calendarManager.toggleTask('${task.id}')">
                    </div>
                    <div class="task-details">
                        <h5 class="task-title">${task.title}</h5>
                        ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                        <div class="task-meta">
                            <span class="task-time">${task.time || ''}</span>
                            <span class="task-priority priority-${task.priority || 'medium'}">${this.getPriorityText(task.priority)}</span>
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-edit-btn" onclick="calendarManager.editTask('${task.id}')">✏️</button>
                    <button class="task-delete-btn" onclick="calendarManager.deleteTask('${task.id}')">🗑️</button>
                </div>
            </div>
        `;
    }

    getPriorityText(priority) {
        const priorities = {
            'low': 'Düşük',
            'medium': 'Orta',
            'high': 'Yüksek'
        };
        return priorities[priority] || 'Orta';
    }

    addTask(taskData) {
        const newTask = {
            id: Date.now().toString(),
            title: taskData.title,
            description: taskData.description,
            date: taskData.date,
            time: taskData.time,
            priority: taskData.priority || 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.updateCalendar();
        this.updateTaskList();
        
        return newTask;
    }

    updateTask(taskId, updates) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updates };
            this.saveTasks();
            this.updateCalendar();
            this.updateTaskList();
            return this.tasks[index];
        }
        return null;
    }

    deleteTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.saveTasks();
            this.updateCalendar();
            this.updateTaskList();
            return true;
        }
        return false;
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.updateTaskList();
            
            // Send notification if task completed
            if (task.completed && window.notificationsManager) {
                window.notificationsManager.sendCustomNotification(
                    'Görev Tamamlandı! ✅',
                    `${task.title} görevini başarıyla tamamladın!`
                );
            }
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.showEditTaskModal(task);
        }
    }

    showAddTaskModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="add-task-modal" class="modal">
                <div class="modal-header">
                    <h3>Yeni Görev Ekle</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="add-task-form">
                        <div class="form-group">
                            <label for="task-title">Görev Başlığı</label>
                            <input type="text" id="task-title" required>
                        </div>
                        <div class="form-group">
                            <label for="task-description">Açıklama</label>
                            <textarea id="task-description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="task-date">Tarih</label>
                            <input type="date" id="task-date" value="${this.selectedDate.toISOString().split('T')[0]}" required>
                        </div>
                        <div class="form-group">
                            <label for="task-time">Saat</label>
                            <input type="time" id="task-time">
                        </div>
                        <div class="form-group">
                            <label for="task-priority">Öncelik</label>
                            <select id="task-priority">
                                <option value="low">Düşük</option>
                                <option value="medium" selected>Orta</option>
                                <option value="high">Yüksek</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary close-btn">İptal</button>
                            <button type="submit" class="btn-primary">Ekle</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Show modal
        document.getElementById('modal-overlay').innerHTML = modalHTML;
        document.getElementById('modal-overlay').classList.add('active');

        // Setup form submission
        document.getElementById('add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Setup close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('modal-overlay').classList.remove('active');
            });
        });
    }

    handleAddTask() {
        const formData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            date: document.getElementById('task-date').value,
            time: document.getElementById('task-time').value,
            priority: document.getElementById('task-priority').value
        };

        this.addTask(formData);
        document.getElementById('modal-overlay').classList.remove('active');
        
        if (window.app) {
            window.app.showNotification('Görev eklendi! 📝', 'success');
        }
    }

    showEditTaskModal(task) {
        // Similar to add task modal but pre-filled with task data
        const modalHTML = `
            <div id="edit-task-modal" class="modal">
                <div class="modal-header">
                    <h3>Görev Düzenle</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="edit-task-form">
                        <div class="form-group">
                            <label for="edit-task-title">Görev Başlığı</label>
                            <input type="text" id="edit-task-title" value="${task.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-task-description">Açıklama</label>
                            <textarea id="edit-task-description">${task.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit-task-date">Tarih</label>
                            <input type="date" id="edit-task-date" value="${task.date}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-task-time">Saat</label>
                            <input type="time" id="edit-task-time" value="${task.time || ''}">
                        </div>
                        <div class="form-group">
                            <label for="edit-task-priority">Öncelik</label>
                            <select id="edit-task-priority">
                                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Düşük</option>
                                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Orta</option>
                                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Yüksek</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary close-btn">İptal</button>
                            <button type="submit" class="btn-primary">Güncelle</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('modal-overlay').innerHTML = modalHTML;
        document.getElementById('modal-overlay').classList.add('active');

        document.getElementById('edit-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditTask(task.id);
        });

        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('modal-overlay').classList.remove('active');
            });
        });
    }

    handleEditTask(taskId) {
        const updates = {
            title: document.getElementById('edit-task-title').value,
            description: document.getElementById('edit-task-description').value,
            date: document.getElementById('edit-task-date').value,
            time: document.getElementById('edit-task-time').value,
            priority: document.getElementById('edit-task-priority').value
        };

        this.updateTask(taskId, updates);
        document.getElementById('modal-overlay').classList.remove('active');
        
        if (window.app) {
            window.app.showNotification('Görev güncellendi! ✏️', 'success');
        }
    }

    getTasksForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.tasks.filter(task => task.date === dateStr);
    }

    getTasksForWeek(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        return this.tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= startDate && taskDate <= endDate;
        });
    }

    getTasksForMonth(year, month) {
        return this.tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate.getFullYear() === year && taskDate.getMonth() === month;
        });
    }
}

// Initialize calendar manager
window.calendarManager = new CalendarManager();
