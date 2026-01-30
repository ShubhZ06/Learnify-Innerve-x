const axios = require('axios');

async function searchGoogleBooks(query) {
    console.log(`Searching Google Books for: ${query}`);
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`;
        const response = await axios.get(url);

        const items = response.data.items || [];
        console.log(`Found ${items.length} books.`);

        if (items.length > 0) {
            const book = items[0].volumeInfo;
            console.log("First Book:", {
                title: book.title,
                authors: book.authors,
                description: book.description ? book.description.substring(0, 100) + '...' : 'No description',
                image: book.imageLinks ? book.imageLinks.thumbnail : 'No image',
                link: book.previewLink || book.infoLink
            });
        }
        return items;

    } catch (error) {
        console.error('Google Books Search failed:', error.message);
        return [];
    }
}

searchGoogleBooks("Quantum Physics");
searchGoogleBooks("Latest Tech News");
