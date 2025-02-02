let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown

    let categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories
    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected filter
    const lastSelected = localStorage.getItem("selectedCategory");
    if (lastSelected) {
        categoryFilter.value = lastSelected;
        filterQuotes();
    }
}

// Display a random quote
function displayQuote(quote) {
    document.getElementById("quoteDisplay").textContent = quote.text;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory); // Save filter selection

    let filteredQuotes = quotes;
    if (selectedCategory !== "all") {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    if (filteredQuotes.length > 0) {
        displayQuote(filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]);
    } else {
        document.getElementById("quoteDisplay").textContent = "No quotes available in this category.";
    }
}

// Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        localStorage.setItem("quotes", JSON.stringify(quotes));

        populateCategories(); // Update categories dynamically
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Show a new random quote
document.getElementById("newQuote").addEventListener("click", () => {
    filterQuotes();
});

// Load initial data on page load
document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    filterQuotes();
});
