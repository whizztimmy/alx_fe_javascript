let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];
  
  // Server API URL (using JSONPlaceholder as an example for mock data)
  const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // This is a mock API
  
  // Function to fetch quotes from the mock server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const serverQuotes = data.map(item => ({
        text: item.body, // For simplicity, using 'body' as the quote text
        category: item.title // Using 'title' as category
      }));
      return serverQuotes;
    } catch (error) {
      console.error('Error fetching quotes from server:', error);
      return [];
    }
  }
  
  // Function to post a new quote to the server
  async function postQuoteToServer(quote) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: quote.category,
          body: quote.text
        })
      });
      const newQuote = await response.json();
      return newQuote;
    } catch (error) {
      console.error('Error posting quote to server:', error);
    }
  }
  
  // Sync quotes between local storage and the server
  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
  
    // Merge server quotes with local quotes
    const allQuotes = [...quotes, ...serverQuotes];
  
    // Here, we'll assume that the server always has the most up-to-date data.
    // You can add logic to handle conflicts if necessary.
  
    // Update local storage with the merged quotes
    localStorage.setItem('quotes', JSON.stringify(allQuotes));
    quotes = allQuotes; // Update the quotes array in memory
  
    // Show a notification that quotes are synced
    displayUpdateNotification("Quotes synced with server!");
  }
  
  // Periodically check for new quotes from the server
  function startSyncing() {
    setInterval(async () => {
      await syncQuotes();
    }, 60000); // Check every 60 seconds
  }
  
  // Function to add a new quote
  async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    showRandomQuote();
    saveQuotes();
  
    // Post the new quote to the server
    const postedQuote = await postQuoteToServer(newQuote);
    if (postedQuote) {
      // Show a notification that the new quote was added and synced
      displayUpdateNotification('New quote added and synced with server!');
    }
  }
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Load quotes from local storage
  function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
    }
  }
  
  // Function to display a notification about data updates or conflicts
  function displayUpdateNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.backgroundColor = 'lightgreen';
    notification.style.padding = '10px';
    notification.style.marginTop = '10px';
    notification.style.borderRadius = '5px';
    document.body.appendChild(notification);
    
    // Remove the notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // Initialize syncing process on page load
  window.onload = function () {
    loadQuotes();
    startSyncing(); // Start periodic syncing
    showRandomQuote();
  };
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
  }
  
  // Function to export quotes as a JSON file
  function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      showRandomQuote();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }  