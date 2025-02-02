function mergeServerQuotes(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Merge local and server quotes while avoiding duplicates
    const mergedQuotes = [...localQuotes, ...serverQuotes.filter(sq => 
        !localQuotes.some(lq => lq.text === sq.text)
    )];

    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    quotes = mergedQuotes; // Update local variable
    populateCategories();
}
setInterval(fetchQuotesFromServer, 30000); // Fetch every 30 seconds
function resolveConflicts(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    
    let resolvedQuotes = localQuotes.map(localQuote => {
        let serverMatch = serverQuotes.find(sq => sq.text === localQuote.text);
        return serverMatch ? serverMatch : localQuote;
    });

    localStorage.setItem("quotes", JSON.stringify(resolvedQuotes));
    quotes = resolvedQuotes;
}
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style = "position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px;";
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}
