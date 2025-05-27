// Select all draggable cards and all drop target lists
const cards = document.querySelectorAll(".card");
const lists = document.querySelectorAll(".list");

// Get DOM elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const toDoList = document.getElementById("list1");

// Adds a new task card to the To Do list when the button is clicked
addTaskBtn.addEventListener("click", () => {
  // Get input and remove extra spaces
  const taskText = taskInput.value.trim();

  // Only proceed if there's actual text
  if (taskText !== "") {
    // Create a new task card
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.textContent = taskText;
    newCard.setAttribute("draggable", "true");

    // Assign a unique ID for drag-and-drop
    newCard.id = `card${Date.now()}`;

    // Add drag event listeners
    newCard.addEventListener("dragstart", handleDragStart);
    newCard.addEventListener("dragend", handleDragEnd);

    // Add the new card to the To Do list
    toDoList.appendChild(newCard);

    // Clear input
    taskInput.value = "";
  }
});

// Add drag event listeners to each card
cards.forEach((card) => {
  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);
});

// Add drag/drop event listeners to each list (drop target)
lists.forEach((list) => {
  list.addEventListener("dragover", handleDragOver);
  list.addEventListener("dragenter", handleDragEnter);
  list.addEventListener("dragleave", handleDragLeave);
  list.addEventListener("drop", handleDrop);
});

// Handles the start of a drag operation
function handleDragStart(event) {
  // Store the id of the dragged card in the data transfer object
  event.dataTransfer.setData("text/plain", event.target.id);

  // Optional: Add visual feedback that the card is being dragged
  event.target.classList.add("dragging");
}

// Handles the end of a drag operation
function handleDragEnd(event) {
  event.target.classList.remove("dragging");
  console.log("Drag ended");
}

// Handles when a dragged card is over a list
function handleDragOver(event) {
  // Prevent default to allow dropping
  event.preventDefault();
}

// Handles when a dragged item enters a drop zone
function handleDragEnter(event) {
  event.preventDefault();

  // Add visual feedback that this is a valid drop target
  event.currentTarget.classList.add("over");
}

// Handles when a dragged item leaves a drop zone
function handleDragLeave(event) {
  event.currentTarget.classList.remove("over");
}

// Handles when a card is dropped on a list
function handleDrop(event) {
  event.preventDefault();

  // Get the ID of the dragged card from the transfer data
  const cardId = event.dataTransfer.getData("text/plain");

  // Find the card element using the ID
  const card = document.getElementById(cardId);

  // Append the card to the drop target (this list)
  event.currentTarget.appendChild(card);

  // Remove visual feedback class
  event.currentTarget.classList.remove("over");
}
