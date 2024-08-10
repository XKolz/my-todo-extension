document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task');
    const deadlineInput = document.getElementById('deadline');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
  
    // Load tasks from storage
    chrome.storage.sync.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      tasks.forEach(task => addTaskToList(task));
    });
  
    // Add new task
    addTaskButton.addEventListener('click', () => {
      const task = taskInput.value;
      const deadline = deadlineInput.value;
  
      if (task) {
        const taskObj = { task, deadline, completed: false };
        addTaskToList(taskObj);
        saveTask(taskObj);
        taskInput.value = '';
        deadlineInput.value = '';
      }
    });
  
    // Add task to the list
    function addTaskToList(taskObj) {
      const li = document.createElement('li');
      li.textContent = `${taskObj.task} (Due: ${taskObj.deadline})`;
      if (taskObj.completed) {
        li.classList.add('completed');
      }
  
      const completeButton = document.createElement('button');
      completeButton.textContent = 'Complete';
      completeButton.addEventListener('click', () => {
        taskObj.completed = !taskObj.completed;
        li.classList.toggle('completed');
        updateTask(taskObj);
      });
  
      li.appendChild(completeButton);
      taskList.appendChild(li);
    }
  
    // Save task to storage
    function saveTask(taskObj) {
      chrome.storage.sync.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        tasks.push(taskObj);
        chrome.storage.sync.set({ tasks });
      });
    }
  
    // Update task in storage
    function updateTask(updatedTask) {
      chrome.storage.sync.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        const taskIndex = tasks.findIndex(task => task.task === updatedTask.task && task.deadline === updatedTask.deadline);
        if (taskIndex > -1) {
          tasks[taskIndex] = updatedTask;
          chrome.storage.sync.set({ tasks });
        }
      });
    }
  });
  