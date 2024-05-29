// Import Fuse.js
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';

// Fuzzy Search Configuration (Fuse.js)
const options = {
    keys: ['word', 'def'],
    threshold: 0.3
};

let fuseSpanish, fuseKichwa;
let kichwaToSpanish, spanishToKichwa;

// Load JSON data 
fetch('spanish_to_kichwa.json')
    .then(response => response.json())
    .then(data => { spanishToKichwa = data; updateTables(); });

fetch('kichwa_to_spanish.json')
    .then(response => response.json())
    .then(data => { kichwaToSpanish = data; updateTables(); });

// Get elements from the DOM
const searchInput = document.getElementById("search");
const kichwaList = document.getElementById("kichwa-spanish-list");
const spanishList = document.getElementById("spanish-kichwa-list");
const clearButton = document.getElementById('clear-search');


// Function to populate lists and filter
function updateTables(filter = "") {
    if (!spanishToKichwa || !kichwaToSpanish) return;

    // Prepare data for Fuse.js (no need to map to entries anymore)
    const spanishEntries = Object.keys(spanishToKichwa).map(word => ({ word: word, def: spanishToKichwa[word] }));
    const kichwaEntries = Object.keys(kichwaToSpanish).map(word => ({ word: word, def: kichwaToSpanish[word] }));

    // Create or update Fuse.js instances
    fuseSpanish = new Fuse(spanishEntries, options);
    fuseKichwa = new Fuse(kichwaEntries, options);

    // Filter results
    const resultsSpanish = filter ? fuseSpanish.search(filter) : spanishEntries.map(entry => ({ item: entry }));
    const resultsKichwa = filter ? fuseKichwa.search(filter) : kichwaEntries.map(entry => ({ item: entry }));

    console.log(resultsSpanish, resultsKichwa)
    // Clear and populate lists
    kichwaList.innerHTML = "";
    spanishList.innerHTML = "";

    resultsSpanish.forEach(({ item }) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.word}</strong> - ${item.def}`;
        kichwaList.appendChild(li);
    });

    resultsKichwa.forEach(({ item }) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.word}</strong> - ${item.def}`;
        spanishList.appendChild(li);
    });
}

clearButton.addEventListener('click', () => {
    searchInput.value = '';
    updateTables(); // Refresh the lists
    clearButton.classList.add('hidden'); // Hide the button after clearing
});

// Search event listener
searchInput.addEventListener("input", () => {
    updateTables(searchInput.value);
    clearButton.classList.toggle('hidden', !searchInput.value);
});