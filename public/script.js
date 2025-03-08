const API_URL = "http://localhost:5000/tasks";

// Fetch and display tasks
async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`;
        
        li.innerHTML = `
            <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.text}</span>
            <div>
                <button class="btn btn-sm btn-success" onclick="toggleComplete(${task.id}, ${!task.completed})">
                    ${task.completed ? 'Undo' : 'Done'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Add a new task
async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    
    if (taskText === "") return alert("Task cannot be empty!");

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: taskText })
    });

    taskInput.value = "";
    fetchTasks();
}

// Delete a task
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}

// Mark task as complete/incomplete
async function toggleComplete(id, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
    });

    fetchTasks();
}

// Load tasks when page loads
window.onload = fetchTasks;
