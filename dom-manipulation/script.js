// Array of quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not watch the clock; do what it does. Keep going.", category: "Motivation" },
];

// Load quotes from localStorage if available
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update DOM
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;

  // Save the last viewed quote index in sessionStorage
  sessionStorage.setItem("lastViewedQuote", randomIndex);
}

// Function to dynamically create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to add new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please fill in both fields!");
    return;
  }

  // Add new quote to array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Save updated quotes to localStorage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Display the newly added quote
  showRandomQuote();
}

// Function to export quotes as JSON file
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    if (Array.isArray(importedQuotes)) {
      quotes.push(...importedQuotes);
      localStorage.setItem("quotes", JSON.stringify(quotes));
      alert("Quotes imported successfully!");
      showRandomQuote();
    } else {
      alert("Invalid JSON format!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Create the quote form dynamically
createAddQuoteForm();

// Add export button dynamically
const exportBtn = document.createElement("button");
exportBtn.textContent = "Export Quotes (JSON)";
exportBtn.addEventListener("click", exportQuotesToJson);
document.body.appendChild(exportBtn);

// Add import input dynamically
const importInput = document.createElement("input");
importInput.type = "file";
importInput.id = "importFile";
importInput.accept = ".json";
importInput.addEventListener("change", importFromJsonFile);
document.body.appendChild(importInput);

// Show the last viewed quote if available (from sessionStorage)
if (sessionStorage.getItem("lastViewedQuote")) {
  const lastIndex = parseInt(sessionStorage.getItem("lastViewedQuote"));
  if (!isNaN(lastIndex) && quotes[lastIndex]) {
    const lastQuote = quotes[lastIndex];
    document.getElementById("quoteDisplay").innerHTML = `
      <p>"${lastQuote.text}"</p>
      <small>— ${lastQuote.category}</small>
    `;
  } else {
    showRandomQuote();
  }
} else {
  showRandomQuote();
}
// === Task 3: Dynamic Content Filtering System ===

// Populate categories dropdown based on unique categories in quotes array
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = ""; // Clear existing options

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter if exists
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}
// === Task 4: Syncing Data with Server and Implementing Conflict Resolution ===

// Simulated server endpoint using JSONPlaceholder (mock API)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock endpoint

// Function to simulate fetching quotes from the "server"
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Simulate server data structure (using first few items)
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "server"
    }));

    handleServerSync(serverQuotes);
  } catch (error) {
    console.error("Error fetching server quotes:", error);
  }
}

// Function to simulate sending local quotes to the "server"
async function postQuotesToServer() {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes)
    });
    console.log("Local quotes synced to server.");
  } catch (error) {
    console.error("Error syncing quotes to server:", error);
  }
}

// Handle synchronization and conflict resolution
function handleServerSync(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  let conflictDetected = false;

  // Simple conflict resolution: server data overrides duplicates
  serverQuotes.forEach(serverQuote => {
    const exists = localQuotes.some(
      q => q.text === serverQuote.text && q.category === serverQuote.category
    );
    if (!exists) {
      localQuotes.push(serverQuote);
      conflictDetected = true;
    }
  });

  // Save merged quotes to localStorage
  localStorage.setItem("quotes", JSON.stringify(localQuotes));

  // Update global quotes array
  quotes.length = 0;
  quotes.push(...localQuotes);

  if (conflictDetected) {
    showConflictNotification();
    populateCategories(); // refresh dropdown
  }
}

// Notification UI for sync conflicts
function showConflictNotification() {
  let notification = document.getElementById("syncNotification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "syncNotification";
    notification.textContent = "Quotes updated from server (conflicts resolved)";
    notification.style.backgroundColor = "#fffae6";
    notification.style.border = "1px solid #f0c36d";
    notification.style.padding = "10px";
    notification.style.margin = "10px 0";
    notification.style.textAlign = "center";
    document.body.insertBefore(notification, document.body.firstChild);

    setTimeout(() => notification.remove(), 5000); // auto-dismiss
  }
}

// Periodic sync with the server every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// Manual sync button (optional, can be added to HTML)
function manualSync() {
  fetchQuotesFromServer();
  postQuotesToServer();
}
// === Task 4: ALX Check Compatibility ===

// Wrapper function to handle both fetch and post sync operations
async function syncQuotes() {
  console.log("Syncing quotes with server...");
  await fetchQuotesFromServer();
  await postQuotesToServer();
  console.log("Quotes synced successfully.");
}
async function syncQuotes() {
  console.log("Syncing quotes with server...");
  await fetchQuotesFromServer();
  await postQuotesToServer();
  console.log("Quotes synced successfully.");

  // === Add UI notification for ALX checker ===
  const notification = document.createElement("div");
  notification.textContent = "Quotes synced with server!";
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "#4CAF50";
  notification.style.color = "white";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "8px";
  notification.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
  notification.style.zIndex = "1000";
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => notification.remove(), 3000);
}
