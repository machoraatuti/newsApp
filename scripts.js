const apiKey = process.env.NEWS_API_KEY;
const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
// Define a global variable for articles

// Global variables to track articles, page, and page size
let articles = [];
let currentPage = 1;
const pageSize = 6;  // Number of articles per page


async function fetchNews() {
    try {
        const response = await fetch(`${url}&pageSize=${pageSize}&page=${currentPage}`);
        const data = await response.json();
      console.log(data);
      // TODO: Add a function call to display the news
      // Set the global articles variable and display news
        articles = data.articles;
      displayNews(articles);
      updatePagination(data.totalResults);
    } catch (error) {
      console.error('There was an error!', error);
    }
  }
  
  fetchNews();
  function displayNews(articles) {
    const newsDiv = document.querySelector('#news');
    newsDiv.innerHTML = ''; // Clear any existing content

    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading');
    loadingDiv.textContent = 'Loading articles...';
    newsDiv.appendChild(loadingDiv);

    if (articles.length === 0) {
        newsDiv.innerHTML = 'No articles found.';
        return;
    }
    for (const article of articles) {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'col-md-4');
        //create the card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        //create and append a headline to the card as card title
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = article.title;
        cardBody.appendChild(title);
    
      // TODO: Use document.createElement and appendChild to create and append more elements
      //// Create and append a paragraph for the description as the card text
      if (article.description){
        const description = document.createElement('p');
        description.classList.add('card-text');
        description.textContent = article.description;
        cardBody.appendChild(description);
      }
      // Create and append a link for the article URL
      if(article.url){
        const link = document.createElement('a');
        link.href = article.url;
        link.classList.add('btn', 'btn-primary');
        link.textContent = 'Read More';
        link.target = '_blank';
        cardBody.appendChild(link);
      }
      card.appendChild(cardBody);
      newsDiv.appendChild(card);
    }
    // Remove the loading message after articles are loaded
    newsDiv.removeChild(loadingDiv);
}
// Update the pagination controls
function updatePagination(totalResults) {
    const totalPages = Math.ceil(totalResults / pageSize);
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageNumber = document.getElementById('pageNumber');

    // Update page number text
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable prev button on the first page
    prevButton.disabled = currentPage === 1;

    // Disable next button on the last page
    nextButton.disabled = currentPage === totalPages;
}

// Handle page navigation
document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews();
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    currentPage++;
    fetchNews();
});

// Initial fetch
fetchNews();

document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filterArticles(searchTerm);
});
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = e.target.value.toLowerCase();
        filterArticles(searchTerm);
    }
});
// Event listener for category filter
document.getElementById('categoryFilter').addEventListener('change', () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filterArticles(searchTerm);
});

/// Filter articles based on search term and category
function filterArticles(searchTerm) {
    const category = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value : 'all';

    // Filter articles based on the search term
    const filteredArticles = articles.filter(article => {
        const matchesSearchTerm = article.title.toLowerCase().includes(searchTerm) || 
            (article.description && article.description.toLowerCase().includes(searchTerm));

        // If category is selected, apply category filtering based on title/description
        if (category !== 'all') {
            const matchesCategory = article.title.toLowerCase().includes(category.toLowerCase()) ||
                (article.description && article.description.toLowerCase().includes(category.toLowerCase()));
            return matchesSearchTerm && matchesCategory;
        }
        
        return matchesSearchTerm; // Only search term filter if 'all' is selected
    });

    displayNews(filteredArticles);
}

