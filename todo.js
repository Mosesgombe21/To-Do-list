const text = document.getElementById("text");
const addBtn = document.getElementById("add");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const emptyState = document.getElementById("emptyState");

const STORAGE_KEY = "todoTasks";

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);
text.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const task = text.value.trim();

    if (task === "") {
        alert("Please enter a task.");
        return;
    }

    // Create list item
    const li = document.createElement("li");
    const id = Date.now();
    li.dataset.id = id;

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Task text
    const span = document.createElement("span");
    span.textContent = task;

    // Strike-through when checked
    checkbox.addEventListener("change", function() {
        if (this.checked) {
            span.classList.add("completed");
        } else {
            span.classList.remove("completed");
        }
        updateStats();
        saveTasks();
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function() {
        li.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
            li.remove();
            updateStats();
            saveTasks();
        }, 300);
    });

    // Append everything
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Clear input
    text.value = "";
    text.focus();

    updateStats();
    saveTasks();
}

function updateStats() {
    const totalTasks = taskList.children.length;
    const completedTasks = document.querySelectorAll("input[type='checkbox']:checked").length;

    taskCount.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
    completedCount.textContent = `${completedTasks} completed`;

    // Show/hide empty state
    if (totalTasks === 0) {
        emptyState.classList.add("show");
    } else {
        emptyState.classList.remove("show");
    }
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach(li => {
        tasks.push({
            id: li.dataset.id,
            text: li.querySelector("span").textContent,
            completed: li.querySelector("input[type='checkbox']").checked
        });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            // Create list item
            const li = document.createElement("li");
            li.dataset.id = task.id;

            // Create checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            // Task text
            const span = document.createElement("span");
            span.textContent = task.text;
            if (task.completed) {
                span.classList.add("completed");
            }

            // Strike-through when checked
            checkbox.addEventListener("change", function() {
                if (this.checked) {
                    span.classList.add("completed");
                } else {
                    span.classList.remove("completed");
                }
                updateStats();
                saveTasks();
            });

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "Delete";

            deleteBtn.addEventListener("click", function() {
                li.style.animation = "slideOut 0.3s ease";
                setTimeout(() => {
                    li.remove();
                    updateStats();
                    saveTasks();
                }, 300);
            });

            // Append everything
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }
    updateStats();
}
