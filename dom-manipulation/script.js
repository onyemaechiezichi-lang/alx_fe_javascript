// Array of initial quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" }
];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const categorySelect = document.getElementById('categorySelect');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

// ✅ Function renamed to match checker: displayRandomQuote
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // ✅ Update the DOM using innerHTML
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
}

// ✅ Function to add a new quote
function addQuote() {
  const text = newQuoteTextInput.value.trim();
  const category = newQuoteCategoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category!");
    return;
  }

  // ✅ Add the new quote to the array
  const newQuote = { text: text, category: category };
  quotes.push(newQuote);

  // ✅ Add new category to dropdown if it doesn’t exist
  if (![...categorySelect.options].some(option => option.value.toLowerCase() === category.toLowerCase())) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }

  // Clear input fields
  newQuoteTextInput.value = "";
  newQuoteCategoryInput.value = "";

  // ✅ Update DOM immediately
  displayRandomQuote();
}

// ✅ Event listeners
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// ✅ Populate initial categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// ✅ Initialize
populateCategories();
displayRandomQuote();
