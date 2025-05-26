// Get DOM elements
const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.querySelector(".palette-container");

// Event listener for the generate button
generateBtn.addEventListener("click", generateColorPalette);

// Main function to generate color palette
function generateColorPalette() {
  const colors = [];

  // Generate 5 random colors
  for (let i = 0; i < 5; i++) {
    colors.push(generateRandomColor());
  }
  updatePaletteDisplay(colors);
}

// Function to generate a random hex color
function generateRandomColor() {
  const hexChars = "0123456789ABCDEF";
  let color = "#";

  // A hex color has 6 characters after #
  for (let i = 0; i < 6; i++) {
    // Get random index from 0 to 15
    const randomIndex = Math.floor(Math.random() * 16);
    color += hexChars[randomIndex];
  }
  return color;
}

// Function to update the display with new colors
function updatePaletteDisplay(colors) {
  const colorBoxes = document.querySelectorAll(".color-box");

  colorBoxes.forEach((box, index) => {
    const color = colors[index];
    const colorDiv = box.querySelector(".color");
    const hexValue = box.querySelector(".hex-value");

    // Update the color and hex value display
    colorDiv.style.backgroundColor = color;
    hexValue.textContent = color;
  });
}

// Event listener for palette container (handles clicks on color boxes and copy buttons)
paletteContainer.addEventListener("click", handlePaletteClick);

function handlePaletteClick(e) {
  let hexValue;

  // Check if copy button was clicked
  if (e.target.classList.contains("copy-btn")) {
    hexValue = e.target.previousElementSibling.textContent;
    copyToClipboard(hexValue, e.target);
  }
  // Check if color div was clicked
  else if (e.target.classList.contains("color")) {
    hexValue =
      e.target.nextElementSibling.querySelector(".hex-value").textContent;
    const copyBtn = e.target.nextElementSibling.querySelector(".copy-btn");
    copyToClipboard(hexValue, copyBtn);
  }
}

// Function to copy text to clipboard
function copyToClipboard(text, element) {
  navigator.clipboard
    .writeText(text)
    .then(() => showCopySuccess(element))
    .catch((err) => console.error("Failed to copy: ", err));
}

// Function to show copy success feedback
function showCopySuccess(element) {
  // Change icon to checkmark and color to green
  element.classList.remove("far", "fa-copy");
  element.classList.add("fas", "fa-check");
  element.style.color = "#48bb78";

  // Reset after 1.5 seconds
  setTimeout(() => {
    element.classList.remove("fas", "fa-check");
    element.classList.add("far", "fa-copy");
    element.style.color = "";
  }, 1500);
}
