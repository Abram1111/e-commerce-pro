// Constants
const API_BASE_URL = "https://dummyjson.com/products";
const CART_STORAGE_KEY = "cart";
const USER_STORAGE_KEY = "user";

// DOM Elements
const cartContainer = document.getElementById("cart-items");
const subTotalElem = document.getElementById("sub-total");
const totalPriceElem = document.getElementById("total-price");
const shippingSelect = document.getElementById("shipping");
const checkoutBtn = document.getElementById("checkout-btn");
const addressInput = document.getElementById("address");
const cartPageContainer = document.getElementById("cart");

// Global Data
let cart = getCartFromStorage();
let productsData = [];

// Load on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const user = getUserFromStorage();
  if (!user) {
    renderLoginPrompt();
    return;
  }
  loadCartProducts();
  setupEventListeners();
});

/** Helper: Get cart from local storage */
function getCartFromStorage() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

/** Helper: Save cart to local storage */
function saveCartToStorage() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/** Helper: Get user from local storage */
function getUserFromStorage() {
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
}

/** Render login prompt if user is not logged in */
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

/** Load product data for items in the cart */
async function loadCartProducts() {
  if (cart.length === 0) {
    cartContainer.innerHTML = `<p>Your cart is empty. <a href="products.html">Back to shop</a></p>`;
    updateCartSummary();
    return;
  }

  try {
    const productFetches = cart.map((item) =>
      fetch(`${API_BASE_URL}/${item.id}`).then((res) => res.json())
    );
    const fetchedProducts = await Promise.all(productFetches);

    // Merge quantity with product data
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

/** Render cart items */
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

/** Set up event listeners for quantity change and item removal */
function setupItemEventListeners() {
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const newQuantity = Math.max(parseInt(e.target.value) || 1, 1);
      const productId = e.target.dataset.id;

      updateCartItemQuantity(productId, newQuantity);
      updateCartSummary();
      updateCartCount(); // If you have a cart icon count
    });
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      removeItemFromCart(productId);
      loadCartProducts(); // Refresh UI
      updateCartCount();
    });
  });
}

/** Update quantity in cart and productsData */
function updateCartItemQuantity(productId, quantity) {
  const cartItem = cart.find((item) => item.id === productId);
  const productItem = productsData.find((p) => p.id == productId);

  if (cartItem && productItem) {
    cartItem.quantity = quantity;
    productItem.quantity = quantity;
    saveCartToStorage();
  }
}

/** Remove item from cart */
function removeItemFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToStorage();
}

/** Update subtotal and total price display */
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

/** Set up checkout and shipping event listeners */
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

    // cart = [];
    // saveCartToStorage();
    // loadCartProducts();
  });
}
