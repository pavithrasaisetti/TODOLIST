window.onload = function () {
  // 🔔 Request Notification Permission on page load
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  console.log(tasks);  // Check the value of 'tasks' in the console

  const taskList = document.getElementById("task-list");

  if (!Array.isArray(tasks)) {
    console.error("Tasks is not an array:", tasks);
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement("div");
    item.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      saveTasks();
    };

    const info = document.createElement("div");
    info.className = "task-info";
    if (task.completed) info.classList.add("completed");
    
    // Check if the task has a valid datetime and it is in the future
    if (!task.completed && task.datetime) {
      const now = new Date();
      const taskTime = new Date(task.datetime);
      console.log("Current time:", now);
      console.log("Task time:", taskTime);

      const timeUntil = taskTime.getTime() - now.getTime();
      console.log("Time until notification:", timeUntil);

      if (timeUntil > 0) {  // Only trigger notifications if the time is in the future
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification(`⏰ Reminder: ${task.title}`, {
              body: `It's time for your task: ${task.details}`,
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                new Notification(`⏰ Reminder: ${task.title}`, {
                  body: `It's time for your task: ${task.details}`,
                });
              }
            });
          }
        }, timeUntil);
      } else {
        console.log("Task time is in the past, notification won't trigger.");
      }
    }

    // 🎨 Add this priority-based color strip
    if (task.priority === "Urgent") {
      info.style.borderLeft = "5px solid red";
    } else if (task.priority === "Medium") {
      info.style.borderLeft = "5px solid orange";
    } else {
      info.style.borderLeft = "5px solid green";
    }

    info.innerHTML = `
      <strong>${task.title}</strong><br/>
      ${task.details}<br/>
      <small>Category: ${task.category} | Priority: ${task.priority} | Due: ${task.datetime}</small>
    `;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Delete Button with SweetAlert2
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Delete";
    deleteBtn.onclick = () => {
      Swal.fire({
        title: 'Confirm Deletion',
        text: "Do you really want to delete this task? This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4caf50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        background: '#1e1e1e',
        color: '#ffffff',
        iconColor: '#f44336'
      }).then((result) => {
        if (result.isConfirmed) {
          tasks.splice(index, 1);
          saveTasks();
          Swal.fire({
            title: 'Deleted!',
            text: 'Your task has been removed.',
            icon: 'success',
            background: '#1e1e1e',
            color: '#ffffff',
            confirmButtonColor: '#4caf50'
          });
        }
      });
    };

    // Edit Button with SweetAlert2
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit";
    editBtn.onclick = () => {
      Swal.fire({
        title: 'Edit Task Title',
        input: 'text',
        inputLabel: 'Task Title',
        inputValue: task.title,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        background: '#1e1e1e',
        color: '#ffffff',
        inputAttributes: {
          style: 'background-color: #333; color: white; border: none; padding: 8px; width: 100%;'
        }
      }).then((result) => {
        if (result.isConfirmed && result.value.trim() !== '') {
          task.title = result.value;
          saveTasks();
          Swal.fire({
            title: 'Updated!',
            text: 'Task title has been updated.',
            icon: 'success',
            background: '#1e1e1e',
            color: '#ffffff',
            confirmButtonColor: '#4caf50'
          });
        }
      });
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(checkbox);
    item.appendChild(info);
    item.appendChild(actions);
    taskList.appendChild(item);
  });
};


// Function to add a task
function addTask() {
  const title = document.getElementById("task-title").value.trim();
  const details = document.getElementById("task-details").value.trim();
  const category = document.getElementById("task-category").value;
  const priority = document.getElementById("task-priority").value;
  const datetime = document.getElementById("task-datetime").value;

  if (!title) {
    Swal.fire({
      title: 'Error',
      text: 'Please enter a task title.',
      icon: 'error',
      background: '#1e1e1e',
      color: '#ffffff',
      confirmButtonColor: '#4caf50'
    });
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  if (datetime && new Date(datetime) < new Date()) {
    Swal.fire({
      title: 'Invalid Date',
      text: 'You cannot set a past date.',
      icon: 'error',
      background: '#1e1e1e',
      color: '#ffffff',
      confirmButtonColor: '#4caf50'
    });
    return;
  }

  const task = { title, details, category, priority, datetime, completed: false };

  // Save to localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  Swal.fire({
    title: 'Task Added!',
    text: 'Your task has been added successfully.',
    icon: 'success',
    background: '#1e1e1e',
    color: '#ffffff',
    confirmButtonColor: '#4caf50'
  });

  document.getElementById("task-title").value = "";
  document.getElementById("task-details").value = "";
  document.getElementById("task-category").value = "Work";
  document.getElementById("task-priority").value = "Low";
  document.getElementById("task-date").value = "";
}
