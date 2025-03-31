const PRODUCTS_API_URL = "https://dummyjson.com/products?limit=150";
const ITEMS_PER_PAGE = 8;

let allProductsData = [];
let filteredProducts = [];

const searchBar = document.getElementById("search-bar");
const suggestionsList = document.getElementById("search-suggestions");
const productContainer = document.getElementById("all-products");
const paginationContainer = document.getElementById("all-products-pagination");
const categoryList = document.getElementById("category-list");

// Load Products and Categories on DOM Load
if (productContainer) {
  loadProductsAndCategories();
}

async function loadProductsAndCategories() {
  try {
    const response = await fetch(PRODUCTS_API_URL);
    const data = await response.json();

    allProductsData = data.products;
    filteredProducts = [...allProductsData];

    const uniqueCategories = [
      ...new Set(allProductsData.map((p) => p.category)),
    ];

    renderCategories(uniqueCategories);
    renderPaginatedProducts(1);
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

function renderCategories(categories) {
  categoryList.innerHTML = "";

  categoryList.appendChild(
    createCategoryListItem("All", () => {
      filteredProducts = [...allProductsData];
      renderPaginatedProducts(1);
    })
  );

  categories.forEach((category) => {
    categoryList.appendChild(
      createCategoryListItem(category, () => {
        filteredProducts = allProductsData.filter(
          (p) => p.category === category
        );
        renderPaginatedProducts(1);
      })
    );
  });
}

function createCategoryListItem(text, onClickHandler) {
  const li = document.createElement("li");
  li.className = "list-group-item category-item";
  li.textContent = text;
  li.addEventListener("click", onClickHandler);
  return li;
}

function renderPaginatedProducts(pageNumber) {
  const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);
  displayProducts("all-products", productsToDisplay);
  renderPagination(pageNumber);
}

function renderPagination(activePage) {
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item${i === activePage ? " active" : ""}`;

    const pageLink = document.createElement("a");
    pageLink.className = "page-link grad-color Pagination";
    pageLink.href = "#";
    pageLink.textContent = i;
    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      renderPaginatedProducts(i);
    });

    pageItem.appendChild(pageLink);
    paginationContainer.appendChild(pageItem);
  }
}
if (searchBar) {
  searchBar.addEventListener("input", handleSearchInput);
}

function handleSearchInput() {
  const query = searchBar.value.trim().toLowerCase();
  suggestionsList.innerHTML = "";

  if (query === "") {
    filteredProducts = [...allProductsData];
    renderPaginatedProducts(1);
    return;
  }

  const matchedProducts = allProductsData.filter((product) =>
    product.title.toLowerCase().includes(query)
  );

  matchedProducts.slice(0, 5).forEach((product) => {
    const suggestionItem = createSuggestionItem(product);
    suggestionsList.appendChild(suggestionItem);
  });

  filteredProducts = matchedProducts;
  renderPaginatedProducts(1);
}

function createSuggestionItem(product) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = product.title;
  li.style.cursor = "pointer";
  li.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });
  return li;
}

function filterCategory(element) {
  const selectedCategory = element.textContent;
  filteredProducts = allProductsData.filter(
    (p) => p.category === selectedCategory
  );
  renderPaginatedProducts(1);
}
