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
