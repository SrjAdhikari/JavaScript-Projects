// DOM Elements - all the elements we need from HTML
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthLabel = document.querySelector("#strength-label");

// Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// Update length display when slider moves
lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

// Copy password to clipboard
copyButton.addEventListener("click", () => {
  if (!passwordInput.value) return;
  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch((err) => console.error("Failed to copy: ", err));
});

// Function to show copy success feedback
function showCopySuccess() {
  // Change icon to checkmark and color to green
  copyButton.classList.remove("far", "fa-copy");
  copyButton.classList.add("fas", "fa-check");
  copyButton.style.color = "#48bb78";

  // Reset after 1.5 seconds
  setTimeout(() => {
    copyButton.classList.remove("fas", "fa-check");
    copyButton.classList.add("far", "fa-copy");
    copyButton.style.color = "";
  }, 1500);
}

// Function to generate password
const generatePassword = () => {
  const length = Number(lengthSlider.value);
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;

  // Validate at least one option is selected
  if (
    !includeUppercase &&
    !includeLowercase &&
    !includeNumbers &&
    !includeSymbols
  ) {
    alert("Please select at least one character type.");
    return;
  }

  let str = "";
  let password = "";

  // Build string based on selections
  if (includeUppercase) str += uppercaseLetters;
  if (includeLowercase) str += lowercaseLetters;
  if (includeNumbers) str += numberCharacters;
  if (includeSymbols) str += symbolCharacters;

  // Generate password
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * str.length);
    password += str[index];
  }

  // Display the password
  passwordInput.value = password;

  // Update strength meter
  updateStrengthMeter(password);
};

// Update password strength indicator
const updateStrengthMeter = (password) => {
  const length = password.length;

  // Check if password contains at least one uppercase, lowercase, numbers and symbols
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/.test(password);

  let passwordStrength = 0;

  // Length contributes to strength
  passwordStrength += Math.min(length * 2, 40);
  console.log(`Before Password Strength: ${passwordStrength}`);

  // Add scores based on character variety
  if (hasUppercase) passwordStrength += 15;
  if (hasLowercase) passwordStrength += 15;
  if (hasNumbers) passwordStrength += 15;
  if (hasSymbols) passwordStrength += 20;
  console.log(`After Password Strength: ${passwordStrength}`);

  // Cap score if length is too short
  if (length < 8) {
    passwordStrength = Math.min(passwordStrength, 40);
  }

  // Ensure the width of the strength bar is a valid percentage
  const safeScore = Math.max(10, Math.min(100, passwordStrength));
  console.log(`Safe Score: ${safeScore}`);

  // Update UI
  strengthBar.style.width = `${safeScore}%`;

  // Set color and label based on strength
  if (passwordStrength < 40) {
    strengthBar.style.backgroundColor = "#ef4444";
    strengthLabel.textContent = "Weak";
  } else if (passwordStrength < 70) {
    strengthBar.style.backgroundColor = "#f59e0b";
    strengthLabel.textContent = "Medium";
  } else {
    strengthBar.style.backgroundColor = "#10b981";
    strengthLabel.textContent = "Strong";
  }
};

// Event listeners
generateButton.addEventListener("click", generatePassword);

// Generate initial password
generatePassword();
