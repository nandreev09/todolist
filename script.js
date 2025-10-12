const addButton = document.getElementById('add-button')
const taskInput = document.getElementById('task-text');
const taskList = document.getElementById('task-list');
const list = document.querySelector('.list');
const allTaskButton = document.querySelector('.alltask-button')
const doneButton = document.querySelector('.done-button')
const outstandingTaskButton = document.querySelector('.outstandingtask-button')

class CreateTask {
    constructor(text, save = true) {
        this.text = text;
        this.save = save;
        this.createTask()
    }
    createTask() {
        this.task = document.createElement('div')
        this.checkTask = document.createElement('input')
        this.toDoText = document.createElement('div');
        this.alarmButton = document.createElement('button');
        this.alarmImg = document.createElement('img');
        this.removeButton = document.createElement('button');
        this.alarm = document.createElement('div');
        this.notifyAndDelete = document.createElement('div')
        this.checkboxAndText = document.createElement('div')

        this.task.className = 'task';
        this.checkTask.setAttribute('type', 'checkbox');
        this.checkTask.className = 'check';
        this.checkTask.style.marginRight = '10px'
        this.toDoText.className = 'todo-text';
        this.notifyAndDelete.className = 'notify-and-delete'
        this.checkboxAndText.className = 'checkbox-and-text'
        this.toDoText.textContent = this.text;
        this.alarmButton.className = 'alarm';
        this.alarmImg.src = '/icons/bell-icon-notification-bell-vector-icon_564974-1243.svg'
        this.alarmButton.appendChild(this.alarmImg);
        this.removeButton.textContent = 'Удалить';
        this.removeButton.className = 'remove-btn';


        this.checkboxAndText.appendChild(this.checkTask);
        this.checkboxAndText.appendChild(this.toDoText);
        this.notifyAndDelete.appendChild(this.alarmButton);
        this.notifyAndDelete.appendChild(this.removeButton);
        this.task.appendChild(this.checkboxAndText)
        this.task.appendChild(this.notifyAndDelete)


        taskList.appendChild(this.task);
        this.addEventListener();
        this.taskDone();
        if (this.save) {
            this.setItem();
        }
    }

    addEventListener() {
        this.removeButton.addEventListener('click', () => {
            this.task.remove();
            this.removeFromStorage();
        });

        this.alarmButton.addEventListener('click', () => {
            this.alarmText = document.createElement('div');
            this.inputTimer = document.createElement('input');
            this.inputTimer.className = 'input-timer'
            this.startTimer = document.createElement('button');
            this.startTimer.className = 'start-timer';
            this.reminder = document.createElement('div');
            this.deleteAlarm = document.createElement('button');
            this.startTimer.textContent = 'Начать';
            this.deleteAlarm.textContent = 'ОК';
            this.alarm.appendChild(this.alarmText);
            list.appendChild(this.alarm);
            this.alarm.appendChild(this.inputTimer);
            this.alarmText.textContent = `Введите время для напоминания задачи "${this.toDoText.textContent}"`
            this.alarm.appendChild(this.startTimer);
            this.startTimer.addEventListener('click', () => {
                const time = Number(this.inputTimer.value);
                if (isNaN(time) || time <= 0) {
                    alert("Введите корректное положительное число секунд");
                    return;
                }
                this.alarmText.remove();
                this.inputTimer.remove();
                this.startTimer.remove()
                setTimeout(() => {
                    this.reminder.textContent = `Пора выполнить задачу ${this.toDoText.textContent}!`
                    this.alarm.appendChild(this.reminder);
                    this.alarm.appendChild(this.deleteAlarm);
                }, this.inputTimer.value * 1000);
            })
            this.deleteAlarm.addEventListener('click', () => {
                this.reminder.remove();
                this.deleteAlarm.remove()
            })
        })
    }

    taskDone() {
        this.checkTask.addEventListener('change', () => {
            if (this.checkTask.checked) {
                this.toDoText.style.textDecoration = 'line-through'
                this.moveToDone();
            }
            else {
                this.toDoText.style.textDecoration = 'none';
                this.moveToActive();
            }
        });

    }

    moveToDone() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.text !== this.text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        let doneTasks = JSON.parse(localStorage.getItem('done tasks')) || [];
        doneTasks.push({ text: this.text });
        localStorage.setItem('done tasks', JSON.stringify(doneTasks));
    }

    moveToActive() {
        let doneTasks = JSON.parse(localStorage.getItem('done tasks')) || [];
        doneTasks = doneTasks.filter(task => task.text !== this.text);
        localStorage.setItem('done tasks', JSON.stringify(doneTasks));
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: this.text });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    setItem() {
        let tasksStorage = JSON.parse(localStorage.getItem('tasks')) || [];
        tasksStorage.push({ text: this.text });
        localStorage.setItem('tasks', JSON.stringify(tasksStorage));
    }

    removeFromStorage() {
        let tasksStorage = JSON.parse(localStorage.getItem('tasks')) || [];
        tasksStorage = tasksStorage.filter(task => task.text !== this.text);
        localStorage.setItem('tasks', JSON.stringify(tasksStorage));
        let doneTasksStorage = JSON.parse(localStorage.getItem('done tasks')) || [];
        doneTasksStorage = doneTasksStorage.filter(task => task.text !== this.text);
        localStorage.setItem('done tasks', JSON.stringify(doneTasksStorage));
    }
}





addButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        new CreateTask(text)
        taskInput.value = '';
    }
})

doneButton.addEventListener('click', showDoneTasks);
outstandingTaskButton.addEventListener('click', showOutstandingTasks);
allTaskButton.addEventListener('click', showAllTasks);

function firstStart() {
    const alreadyLoaded = localStorage.getItem('firstVisitDone');
    if (alreadyLoaded) return;
    fetch('https://jsonplaceholder.typicode.com/todos/')
        .then(response => response.json())
        .then(data => {
            for (let id = 1; id <= 5; id++) {
                new CreateTask(data[id].title)
            }
            localStorage.setItem('firstVisitDone', 'true');
        })
        .catch(error => console.error('Ошибка:', error))
}

function loadFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const doneTasks = JSON.parse(localStorage.getItem('done tasks')) || [];

    tasks.forEach(task => {
        new CreateTask(task.text, false);
    });

    doneTasks.forEach(task => {
        const taskObj = new CreateTask(task.text, false);
        taskObj.checkTask.checked = true;
        taskObj.toDoText.style.textDecoration = 'line-through';
    });
}

function clearTaskList() {
    taskList.innerHTML = '';
}

function showDoneTasks() {
    clearTaskList();
    const doneTasks = JSON.parse(localStorage.getItem('done tasks')) || [];
    doneTasks.forEach(task => {
        const taskObj = new CreateTask(task.text, false);
        taskObj.checkTask.checked = true;
        taskObj.toDoText.style.textDecoration = 'none';
    });
}

function showOutstandingTasks() {
    clearTaskList();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        new CreateTask(task.text, false);
    });
}

function showAllTasks() {
    clearTaskList();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const doneTasks = JSON.parse(localStorage.getItem('done tasks')) || [];

    tasks.forEach(task => {
        new CreateTask(task.text, false);
    });

    doneTasks.forEach(task => {
        const taskObj = new CreateTask(task.text, false);
        taskObj.checkTask.checked = true;
        taskObj.toDoText.style.textDecoration = 'line-through';
    });
}

firstStart();
loadFromStorage();


