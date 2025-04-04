/**
 *
 * This script handles user authentication, product retrieval, and cart interactions, including:
 * - Loading products from an API
 * - Displaying products in different categories
 * - Managing user authentication and navigation links
 * - Adding products to the cart and updating the cart count
 */

const API_URL = "https://dummyjson.com/products"; // API endpoint for fetching product data
const PRODUCTS_PER_PAGE = 8; // Number of products to display per page

document.addEventListener("DOMContentLoaded", async () => {
  const authLinks = document.getElementById("auth-links");
  const topProductsBtn = document.getElementById("top-products");
  const salesProductsBtn = document.getElementById("Sales-products");
  const user = getUserFromStorage();
  const products = await fetchProductsSafely();

  setupAuthLinks(authLinks, user);
  displayProducts("top-rated-products", products.slice(0, PRODUCTS_PER_PAGE));
  updateCartCount();

  if (topProductsBtn) {
    topProductsBtn.addEventListener("click", () =>
      displayProducts(
        "top-rated-products",
        products.slice(0, PRODUCTS_PER_PAGE)
      )
    );
  }

  if (salesProductsBtn) {
    salesProductsBtn.addEventListener("click", () =>
      displayProducts(
        "biggest-sales-products",
        products.slice(0, PRODUCTS_PER_PAGE)
      )
    );
  }
});

/** Retrieves the logged-in user from localStorage */
function getUserFromStorage() {
  return JSON.parse(localStorage.getItem("user")) || null;
}

/** Fetches product data from the API with error handling */
async function fetchProductsSafely() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

/**
 * Configures the authentication links in the navbar based on user status
 * @param {HTMLElement} container - The container element for auth links
 * @param {Object} user - The logged-in user object
 */
function setupAuthLinks(container, user) {
  if (user) {
    const loggedInTemplate = getLoggedInTemplate(user.firstName);
    container.appendChild(loggedInTemplate[0]);
    container.appendChild(loggedInTemplate[1]);
    container.appendChild(loggedInTemplate[2]);
  } else {
    const loggedOutTemplate = getLoggedOutTemplate();
    container.appendChild(loggedOutTemplate[0]);
    container.appendChild(loggedOutTemplate[1]);
    container.appendChild(loggedOutTemplate[2]);
  }
}

/** Creates the logged-in user navigation template */
function getLoggedInTemplate(firstName) {
  // Cart icon and link
  const cartLink = document.createElement("a");
  const cartIcon = document.createElement("i");
  const cartCount = document.createElement("span");
  const userNameItem = document.createElement("li");
  const logoutItem = document.createElement("li");
  const userNameLink = document.createElement("a");
  const logoutLink = document.createElement("a");

  // Cart elements
  cartLink.className = "nav-link position-relative";
  cartLink.href = "cart.html";
  cartLink.title = "Cart";
  cartIcon.className = "fas fa-shopping-cart";
  cartCount.className =
    "cart-count badge bg-danger position-absolute top-0 start-100 translate-middle rounded-circle";
  cartCount.style.fontSize = "0.6rem";
  cartCount.textContent = "0";
  cartCount.id = "cart-count";
  cartLink.appendChild(cartIcon);
  cartLink.appendChild(cartCount);

  // Username display
  userNameItem.className = "nav-item";
  userNameLink.className = "nav-link";
  userNameLink.textContent = firstName;
  userNameItem.appendChild(userNameLink);

  // Logout button
  logoutItem.className = "nav-item";
  logoutLink.className = "nav-link";
  logoutLink.href = "#";
  logoutLink.id = "logout";
  logoutLink.textContent = "Logout";
  logoutLink.addEventListener("click", logout);
  logoutItem.appendChild(logoutLink);

  return [cartLink, userNameItem, logoutItem];
}

/** Handles user logout and clears stored data */
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  updateCartCount();
  location.reload();
}

/** Displays a list of products within a given container */
function displayProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  products.forEach((product) =>
    container.appendChild(createProductCard(product))
  );
  attachAddToCartHandlers();
}

/** Attaches event listeners to add-to-cart buttons */
function attachAddToCartHandlers() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const user = getUserFromStorage();
      if (!user) {
        alert("You must login to add to cart");
        window.location.href = "login.html";
        return;
      }

      const cart = getCartFromStorage();
      const productId = e.target.dataset.id;
      updateCart(cart, productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    });
  });
}

/** Updates the cart count displayed in the navbar */
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  const cart = getCartFromStorage();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  countSpan.textContent = totalQuantity;
  countSpan.classList.add("d-none");
  if (totalQuantity > 0) {
    countSpan.classList.remove("d-none");
  }
}
