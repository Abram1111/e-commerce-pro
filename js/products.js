// API URL to fetch all products with a limit of 150 items
const PRODUCTS_API_URL = "https://dummyjson.com/products?limit=150";
// Number of items to display per page
const ITEMS_PER_PAGE = 8;

// Arrays to store all products and filtered products
let allProductsData = [];
let filteredProducts = [];

// DOM elements references
const searchBar = document.getElementById("search-bar");
const suggestionsList = document.getElementById("search-suggestions");
const productContainer = document.getElementById("all-products");
const paginationContainer = document.getElementById("all-products-pagination");
const categoryList = document.getElementById("category-list");

// Load Products and Categories when DOM is fully loaded (if product container exists)
if (productContainer) {
  loadProductsAndCategories();
}

/**
 * Fetches products from API and loads categories
 */
async function loadProductsAndCategories() {
  try {
    // Fetch products from API
    const response = await fetch(PRODUCTS_API_URL);
    const data = await response.json();

    // Store all products and initialize filtered products
    allProductsData = data.products;
    filteredProducts = [...allProductsData];

    // Get unique categories from products
    const uniqueCategories = [
      ...new Set(allProductsData.map((p) => p.category)),
    ];

    // Render categories and first page of products
    renderCategories(uniqueCategories);
    renderPaginatedProducts(1);
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

/**
 * Renders category list in the sidebar
 * @param {Array} categories - Array of category names
 */
function renderCategories(categories) {
  // Clear existing categories
  categoryList.innerHTML = "";

  // Add "All" category option
  categoryList.appendChild(
    createCategoryListItem("All", () => {
      // Reset filter to show all products
      filteredProducts = [...allProductsData];
      renderPaginatedProducts(1);
    })
  );

  // Add each category as a clickable item
  categories.forEach((category) => {
    categoryList.appendChild(
      createCategoryListItem(category, () => {
        // Filter products by selected category
        filteredProducts = allProductsData.filter(
          (p) => p.category === category
        );
        renderPaginatedProducts(1);
      })
    );
  });
}

/**
 * Creates a category list item element
 * @param {string} text - Category name
 * @param {function} onClickHandler - Click handler function
 * @returns {HTMLElement} List item element
 */
function createCategoryListItem(text, onClickHandler) {
  const li = document.createElement("li");
  li.className = "list-group-item category-item";
  li.textContent = text;
  li.addEventListener("click", onClickHandler);
  return li;
}

/**
 * Renders products for a specific page number
 * @param {number} pageNumber - Current page number (1-based)
 */
function renderPaginatedProducts(pageNumber) {
  // Calculate start and end index for current page
  const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Get products for current page and display them
  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);
  displayProducts("all-products", productsToDisplay);

  // Update pagination controls
  renderPagination(pageNumber);
}

/**
 * Renders pagination controls
 * @param {number} activePage - Currently active page number
 */
function renderPagination(activePage) {
  // Calculate total number of pages needed
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  paginationContainer.innerHTML = "";

  // Create a page number button for each page
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    // Highlight active page
    pageItem.className = `page-item${i === activePage ? " active" : ""}`;

    const pageLink = document.createElement("a");
    pageLink.className = "page-link grad-color Pagination";
    pageLink.href = "#";
    pageLink.textContent = i;
    // Handle page navigation
    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      renderPaginatedProducts(i);
    });

    pageItem.appendChild(pageLink);
    paginationContainer.appendChild(pageItem);
  }
}

// Add search input event listener if search bar exists
if (searchBar) {
  searchBar.addEventListener("input", handleSearchInput);
}

/**
 * Handles search input changes and shows suggestions
 */
function handleSearchInput() {
  const query = searchBar.value.trim().toLowerCase();
  suggestionsList.innerHTML = "";

  // If search is empty, reset to all products
  if (query === "") {
    filteredProducts = [...allProductsData];
    renderPaginatedProducts(1);
    return;
  }

  // Filter products that match search query
  const matchedProducts = allProductsData.filter((product) =>
    product.title.toLowerCase().includes(query)
  );

  // Show top 5 suggestions
  matchedProducts.slice(0, 5).forEach((product) => {
    const suggestionItem = createSuggestionItem(product);
    suggestionsList.appendChild(suggestionItem);
  });

  // Update filtered products and render first page
  filteredProducts = matchedProducts;
  renderPaginatedProducts(1);
}

/**
 * Creates a suggestion list item for search results
 * @param {Object} product - Product object
 * @returns {HTMLElement} List item element
 */
function createSuggestionItem(product) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = product.title;
  li.style.cursor = "pointer";
  // Navigate to product details when clicked
  li.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });
  return li;
}

/**
 * Filters products by category (alternative method)
 * @param {HTMLElement} element - The clicked category element
 */
function filterCategory(element) {
  const selectedCategory = element.textContent;
  filteredProducts = allProductsData.filter(
    (p) => p.category === selectedCategory
  );
  renderPaginatedProducts(1);
}
