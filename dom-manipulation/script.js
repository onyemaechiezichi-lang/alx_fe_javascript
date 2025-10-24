// Array of quotes with text and category
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not watch the clock; do what it does. Keep going.", category: "Motivation" },
];

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ✅ Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><small>— ${randomQuote.category}</small>`;
}

// ✅ Function to add a new quote dynamically
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please fill in both fields!");
    return;
  }

  // Add the new quote to the array
  quotes.push({ text: text, category: category });

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  // Display a new random quote
  displayRandomQuote();
}

// ✅ Event listener for “Show New Quote” button
newQuoteBtn.addEventListener("click", displayRandomQuote);

// ✅ Display a random quote when the page loads
displayRandomQuote();
