window.onload = function () {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("task-list");
  
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      location.reload(); // Refresh to reflect changes
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
      
      // 🎨 Add this priority-based color strip here
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
        <small>Category: ${task.category} | Priority: ${task.priority} | Due: ${task.date}</small>
      `;
  
      const actions = document.createElement("div");
      actions.className = "task-actions";
  
      // SweetAlert2 Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.title = "Delete";
      deleteBtn.onclick = () => {
        Swal.fire({
          title: 'Confirm Deletion',
          text: "Do you really want to delete this task? This action cannot be undone.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            tasks.splice(index, 1);
            saveTasks();
            Swal.fire('Deleted!', 'Your task has been removed.', 'success');
          }
        });
      };
  
      // SweetAlert2 Edit Button
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
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed && result.value.trim() !== '') {
            task.title = result.value;
            saveTasks();
            Swal.fire('Updated!', 'Task title has been updated.', 'success');
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
  