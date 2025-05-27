// Get references to HTML elements
const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income-amount");
const expenseDisplay = document.getElementById("expense-amount");
const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");

// Load transactions from localStorage or start with an empty list
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Show transactions and summary when page loads
displayTransactions();
updateSummary();

// When user submits the form
transactionForm.addEventListener("submit", function (event) {
  // prevent page reload
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  // Create a new transaction object
  const newTransaction = {
    id: Date.now(), // unique ID using timestamp
    description,
    amount,
  };

  // Add the new transaction to the list
  transactions.push(newTransaction);

  // Save to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Update the UI
  displayTransactions();
  updateSummary();

  // Clear the form fields
  transactionForm.reset();
});

// Function to display all transactions
function displayTransactions() {
  // Clear existing list
  transactionList.innerHTML = "";

  // Show most recent transactions at the top
  const sortedTransactions = [...transactions].reverse();

  // Loop through and display each transaction
  sortedTransactions.forEach(function (transaction) {
    const listItem = document.createElement("li");
    listItem.classList.add("transaction");

    // Add a class for color styling (income or expense)
    if (transaction.amount >= 0) {
      listItem.classList.add("incomes");
    } else {
      listItem.classList.add("expense");
    }

    // Add the HTML content for the transaction
    listItem.innerHTML = `
      <span>${transaction.description}</span>
      <span>
        ${formatCurrency(transaction.amount)}
        <button class="delete-btn" onclick="deleteTransaction(${
          transaction.id
        })">
          <i class="fas fa-trash"></i>
        </button>
      </span>
    `;

    transactionList.appendChild(listItem);
  });
}

// Function to update the balance, income, and expense totals
function updateSummary() {
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach(function (transaction) {
    totalBalance += transaction.amount;

    if (transaction.amount > 0) {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  // Update the UI with formatted amounts
  balanceDisplay.textContent = formatCurrency(totalBalance);
  incomeDisplay.textContent = formatCurrency(totalIncome);
  expenseDisplay.textContent = formatCurrency(totalExpenses);
}

// Function to delete a transaction by ID
function deleteTransaction(id) {
  // Remove the transaction from the array
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // Save updated list to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Update the UI
  displayTransactions();
  updateSummary();
}

// Helper function to format numbers as currency
function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}
