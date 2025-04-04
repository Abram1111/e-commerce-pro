/**
 * Shopping Cart Functionality
 *
 * This script manages the shopping cart system, including:
 * - Retrieving cart and user data from localStorage
 * - Loading products from an API
 * - Updating quantities and removing items
 * - Calculating subtotal, shipping cost, and total price
 * - Handling checkout process
 */

const CART_STORAGE_KEY = "cart"; // Local storage key for cart items
const USER_STORAGE_KEY = "user"; // Local storage key for user data

// DOM elements
const cartContainer = document.getElementById("cart-items");
const subTotalElem = document.getElementById("sub-total");
const totalPriceElem = document.getElementById("total-price");
const shippingSelect = document.getElementById("shipping");
const checkoutBtn = document.getElementById("checkout-btn");
const addressInput = document.getElementById("address");
const cartPageContainer = document.getElementById("cart");

// Retrieve cart data from localStorage
let cart = getCartFromStorage();
let productsData = [];

document.addEventListener("DOMContentLoaded", () => {
  const user = getUserFromStorage();
  if (!user) {
    renderLoginPrompt(); // Prompt user to log in if not authenticated
    return;
  }
  loadCartProducts(); // Load cart items from API
  setupEventListeners();
});

/** Retrieves cart data from localStorage */
function getCartFromStorage() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

/** Saves the updated cart to localStorage */
function saveCartToStorage() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/** Retrieves user data from localStorage */
function getUserFromStorage() {
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
}

/** Renders a login prompt if the user is not logged in */
function renderLoginPrompt() {
  cartPageContainer.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="min-height: 50vh;">
      <div class="card text-center p-4 shadow" style="max-width: 400px;">
        <h5 class="card-title mb-3">You're not logged in</h5>
        <p class="card-text">Please log in to view and manage your cart items.</p>
        <a href="login.html" class="btn btn-primary">Login Now</a>
      </div>
    </div>
  `;
}

/** Fetches and loads products in the cart */
async function loadCartProducts() {
  if (cart.length === 0) {
    cartContainer.innerHTML = `<p>Your cart is empty. <a href="products.html">Back to shop</a></p>`;
    updateCartSummary();
    return;
  }

  try {
    const productFetches = cart.map((item) =>
      fetch(`${API_URL}/${item.id}`).then((res) => res.json())
    );
    const fetchedProducts = await Promise.all(productFetches);

    // Merge fetched data with cart quantities
    productsData = fetchedProducts.map((product, index) => ({
      ...product,
      quantity: cart[index].quantity,
    }));

    renderCartItems();
    updateCartSummary();
  } catch (error) {
    console.error("Error loading cart products:", error);
    cartContainer.innerHTML =
      "<p>Error loading cart items. Please try again later.</p>";
  }
}

/** Renders the cart items dynamically */
function renderCartItems() {
  cartContainer.innerHTML = "";

  productsData.forEach((product) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "d-flex align-items-center mb-3 border-bottom pb-3";

    itemDiv.innerHTML = `
      <img src="${product.thumbnail}" class="me-3" style="width: 100px; height: auto;">
      <div class="d-flex flex-wrap align-items-center justify-content-between flex-grow-1">
        <h6 class="mb-0 me-3">${product.title}</h6>
        <input type="number" value="${product.quantity}" min="1" 
               class="form-control form-control-sm quantity-input me-3" 
               style="width: 60px;" data-id="${product.id}">
        <p class="mb-0 me-3">$${product.price}</p>
        <button class="btn btn-outline-danger btn-sm remove-btn" data-id="${product.id}">&times;</button>
      </div>
    `;

    cartContainer.appendChild(itemDiv);
  });

  setupItemEventListeners();
}

/** Sets up event listeners for quantity changes and item removal */
function setupItemEventListeners() {
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const newQuantity = Math.max(parseInt(e.target.value) || 1, 1);
      const productId = e.target.dataset.id;

      updateCartItemQuantity(productId, newQuantity);
      updateCartSummary();
      updateCartCount();
    });
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      removeItemFromCart(productId);
      loadCartProducts();
      updateCartCount();
    });
  });
}

/** Updates cart item quantity */
function updateCartItemQuantity(productId, quantity) {
  const cartItem = cart.find((item) => item.id === productId);
  const productItem = productsData.find((p) => p.id == productId);

  if (cartItem && productItem) {
    cartItem.quantity = quantity;
    productItem.quantity = quantity;
    saveCartToStorage();
  }
}

/** Removes an item from the cart */
function removeItemFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToStorage();
}

/** Updates subtotal and total price */
function updateCartSummary() {
  const subTotal = productsData.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const shippingCost = parseFloat(shippingSelect.value);
  const total = subTotal + shippingCost;

  subTotalElem.textContent = subTotal.toFixed(2);
  totalPriceElem.textContent = total.toFixed(2);
}

/** Sets up event listeners for shipping selection and checkout */
function setupEventListeners() {
  shippingSelect.addEventListener("change", updateCartSummary);

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!addressInput.value.trim()) {
      alert("Please fill in your address!");
      return;
    }

    alert("Thank you for your purchase!");
  });
}
