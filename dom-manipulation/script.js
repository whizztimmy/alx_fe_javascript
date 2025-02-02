// Initialize quotes from local storage or use default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

// ---------------------
// Utility Functions
// ---------------------

// Populate the category filter dropdown dynamically based on the quotes array
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown

    // Get unique categories from quotes array
    let categories = [...new Set(quotes.map(quote => quote.category))];
    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected filter from local storage
    const lastSelected = localStorage.getItem("selectedCategory");
    if (lastSelected) {
        categoryFilter.value = lastSelected;
        filterQuotes();
    }
}

// Display a given quote in the UI and save it in session storage as the last viewed quote
function displayQuote(quote) {
    document.getElementById("quoteDisplay").textContent = quote.text;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Filter quotes based on the selected category and display a random quote from the filtered list
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory); // Save the selected filter

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

// Add a new quote from user input and update local storage and category list accordingly
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        localStorage.setItem("quotes", JSON.stringify(quotes));

        populateCategories(); // Update the categories in the dropdown
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// ---------------------
// Server Sync Functions
// ---------------------

// Simulate fetching quotes from a server using JSONPlaceholder
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const serverQuotes = await response.json();

        // Convert the fetched data into our quote format (simulate by taking first 5 posts)
        const formattedQuotes = serverQuotes.slice(0, 5).map(post => ({
            text: post.title,
            category: "General"
        }));

        // Merge the fetched quotes with the local quotes
        mergeServerQuotes(formattedQuotes);
        notifyUser("Quotes have been updated from the server!");
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Merge server quotes with local quotes, avoiding duplicates
function mergeServerQuotes(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    
    // Merge quotes, adding server quotes that are not already present locally
    const mergedQuotes = [...localQuotes];
    serverQuotes.forEach(sq => {
        if (!mergedQuotes.some(lq => lq.text === sq.text)) {
            mergedQuotes.push(sq);
        }
    });

    // Save merged quotes to local storage and update the global quotes variable
    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    quotes = mergedQuotes;
    populateCategories();
}

// Display a notification to the user when data is updated
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style = "position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; border: 1px solid #ccc; z-index: 1000;";
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// ---------------------
// Event Listeners & Initialization
// ---------------------

// Event listener for showing a new random quote based on current filter
document.getElementById("newQuote").addEventListener("click", () => {
    filterQuotes();
});

// Event listener for adding a new quote
document.getElementById("addQuoteButton").addEventListener("click", addQuote);

// Periodically fetch updates from the server every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// On page load, initialize categories and display a quote based on the last selected filter
document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    filterQuotes();
});
