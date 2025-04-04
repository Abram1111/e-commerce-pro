const API_URL = "https://dummyjson.com/products";
const PRODUCTS_PER_PAGE = 8;

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

function getUserFromStorage() {
  return JSON.parse(localStorage.getItem("user")) || null;
}

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

function getLoggedInTemplate(firstName) {
  const cartLink = document.createElement("a");
  const cartIcon = document.createElement("i");
  const cartCount = document.createElement("span");
  const userNameItem = document.createElement("li");
  const logoutItem = document.createElement("li");
  const userNameLink = document.createElement("a");
  const logoutLink = document.createElement("a");
  /*********************************************************/
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
  /*********************************************************/
  userNameItem.className = "nav-item";
  userNameLink.className = "nav-link";
  userNameLink.textContent = firstName;
  userNameItem.appendChild(userNameLink);
  /*********************************************************/
  logoutItem.className = "nav-item";
  logoutLink.className = "nav-link";
  logoutLink.href = "#";
  logoutLink.id = "logout";
  logoutLink.textContent = "Logout";
  logoutLink.addEventListener("click", logout);
  logoutItem.appendChild(logoutLink);
  /*********************************************************/
  return [cartLink, userNameItem, logoutItem];
}

function getLoggedOutTemplate() {
  const cartItem = document.createElement("li");
  const cartLink = document.createElement("a");
  const cartIcon = document.createElement("i");
  const loginItem = document.createElement("li");
  const loginLink = document.createElement("a");
  const registerItem = document.createElement("li");
  const registerLink = document.createElement("a");
  /*********************************************************/
  cartItem.className = "nav-item";
  cartLink.className = "nav-link";
  cartLink.href = "cart.html";
  cartLink.title = "Cart";
  cartIcon.className = "fas fa-shopping-cart";
  cartLink.appendChild(cartIcon);
  cartItem.appendChild(cartLink);
  /*********************************************************/
  loginItem.className = "nav-item";
  loginLink.className = "nav-link";
  loginLink.href = "login.html";
  loginLink.textContent = "Login";
  loginItem.appendChild(loginLink);
  /*********************************************************/
  registerItem.className = "nav-item";
  registerLink.className = "nav-link";
  registerLink.href = "register.html";
  registerLink.textContent = "Sign Up";
  registerItem.appendChild(registerLink);
  /*********************************************************/
  return [cartItem, loginItem, registerItem];
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  updateCartCount();
  location.reload();
}

function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-lg-3 col-md-6 col-sm-12 mb-4";
  col.innerHTML = `
    <div class="card h-100">
      <img src="${product.thumbnail}" class="card-img-top product-img" alt="${product.title}">
      <div class="card-body">
        <div class="d-flex justify-content-between mb-1">
          <span onclick="filterCategory(this)">${product.category}</span>
          <span class="text-danger">-${product.discountPercentage}%</span>
        </div>
        <div class="d-flex justify-content-between mb-1">
          <strong>${product.title}</strong>
          <span>$${product.price}</span>
        </div>
        <div class="d-flex justify-content-end mb-2">
          <small>Available: ${product.stock}</small>
        </div>
        <div class="text-center">
          <a href="product-details.html?id=${product.id}" class="btn btn-info btn-sm details">Details</a>
          <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    </div>`;
  return col;
}

function displayProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  products.forEach((product) =>
    container.appendChild(createProductCard(product))
  );
  attachAddToCartHandlers();
}

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

function getCartFromStorage() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateCart(cart, productId) {
  const existingProduct = cart.find((item) => item.id === productId);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
    console.log(cart);
  }
}

function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  const cart = getCartFromStorage();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (!countSpan) return;
  countSpan.textContent = totalQuantity;
  countSpan.classList.add("d-none");
  if (totalQuantity > 0) {
    countSpan.classList.remove("d-none");
  }
}
