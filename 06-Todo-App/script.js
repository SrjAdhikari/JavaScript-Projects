// DOM Elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

// Array to store all tasks
let tasks = [];

// Current filter setting
let currentFilter = "all";

// Display today's date
const showDate = () => {
	const today = new Date();
	const options = {
		weekday: "long",
		month: "short",
		day: "numeric",
	};

	dateElement.textContent = today.toLocaleDateString("en-US", options);
};

// Save tasks to localStorage and update UI
const saveTasks = () => {
	localStorage.setItem("tasks", JSON.stringify(tasks));
	updateItemsCount();
	checkEmptyState();
};

// Update the count of remaining active tasks
const updateItemsCount = () => {
	const lefttask = tasks.filter((task) => !task.completed);
	const itemsCount = lefttask.length;
	itemsLeft.textContent = `${itemsCount} item${
		itemsCount !== 1 ? "s" : ""
	} left`;
};

// Show/hide empty state message based on current task filter
const checkEmptyState = () => {
	const filteredTasks = filterTasks(currentFilter);
	if (filteredTasks.length === 0) emptyState.classList.remove("hidden");
	else emptyState.classList.add("hidden");
};

// Return a filtered list of tasks depending on the selected filter
const filterTasks = (filter) => {
	if (filter === "active") return tasks.filter((task) => !task.completed);
	if (filter === "completed") return tasks.filter((task) => task.completed);

	// Default: show all
	return tasks;
};

// Load tasks from localStorage and set up filter event listeners
const loadTasks = () => {
	const savedTasks = localStorage.getItem("tasks");

	// Restore saved tasks from localStorage
	if (savedTasks) tasks = JSON.parse(savedTasks);
	renderTasks();

	// Attach click listeners to filter tabs
	filters.forEach((filter) => {
		filter.addEventListener("click", () => {
			setActiveFilter(filter.getAttribute("data-filter"));
		});
	});
};

// Set active filter and re-render task list
const setActiveFilter = (filter) => {
	currentFilter = filter;

	// Add 'active' class only to the selected filter tab
	filters.forEach((item) => {
		if (item.getAttribute("data-filter") === filter)
			item.classList.add("active");
		else item.classList.remove("active");
	});

	renderTasks();
};

// Render tasks to the DOM based on current filter
const renderTasks = () => {
	// Clear current tasks
	todosList.innerHTML = "";

	// Get filtered list
	const filteredTasks = filterTasks(currentFilter);

	filteredTasks.forEach((task) => {
		const taskItem = document.createElement("li");
		taskItem.classList.add("todo-item");
		if (task.completed) taskItem.classList.add("completed");

		// Checkbox section
		const checkboxContainer = document.createElement("label");
		checkboxContainer.classList.add("checkbox-container");

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.classList.add("todo-checkbox");
		checkbox.checked = task.completed;
		checkbox.addEventListener("change", () => toggleTask(task.id));

		const checkmark = document.createElement("span");
		checkmark.classList.add("checkmark");

		checkboxContainer.appendChild(checkbox);
		checkboxContainer.appendChild(checkmark);

		// Task text
		const taskText = document.createElement("span");
		taskText.classList.add("todo-item-text");
		taskText.textContent = task.text;

		// Delete button
		const deleteBtn = document.createElement("button");
		deleteBtn.classList.add("delete-btn");
		deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
		deleteBtn.addEventListener("click", () => deleteTask(task.id));

		// Combine elements
		taskItem.appendChild(checkboxContainer);
		taskItem.appendChild(taskText);
		taskItem.appendChild(deleteBtn);

		// Add to the task list
		todosList.appendChild(taskItem);
	});

	checkEmptyState();
};

// Add a new task to the list
const addTask = () => {
	const taskText = taskInput.value;

	// Prevent empty entries
	if (!taskText.trim()) return;

	const newTask = {
		id: Date.now(),
		text: taskText,
		completed: false,
	};

	tasks.push(newTask);

	saveTasks();
	renderTasks();

	taskInput.value = "";
};

// Toggle task completion status
const toggleTask = (taskId) => {
	tasks = tasks.map((task) => {
		if (task.id === taskId) {
			return { ...task, completed: !task.completed };
		}
		return task;
	});

	saveTasks();
	renderTasks();
};

// Delete a task from the list
const deleteTask = (taskId) => {
	tasks = tasks.filter((task) => task.id !== taskId);
	saveTasks();
	renderTasks();
};

// Clear all completed tasks
const clearCompletedTask = () => {
	tasks = tasks.filter((task) => !task.completed);
	saveTasks();
	renderTasks();
};

// Event listeners
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") addTask();
});

clearCompletedBtn.addEventListener("click", clearCompletedTask);

// Initialize the app
showDate();
loadTasks();
