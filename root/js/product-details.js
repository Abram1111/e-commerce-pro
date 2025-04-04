// Get URL parameters to extract the product ID from the query string
const urlParams = new URLSearchParams(window.location.search);
const productDetailsId = urlParams.get("id");

// Get DOM elements for product display, comments section, and comment input
const productDetailsContainer = document.getElementById("product-container");
const commentsSection = document.getElementById("comments-section");
const addCommentBtn = document.getElementById("add-comment-btn");
const commentText = document.getElementById("comment-text");
const similarProductsContainer = document.getElementById("similar-products");

// Initialize empty arrays to store product details and similar products
let productDetailsinfo = [];
let similarProducts = [];

// When DOM is fully loaded, fetch product details and load comments
document.addEventListener("DOMContentLoaded", () => {
  fetchProductDetails();
  loadComments();
});

/**
 * Fetches product details from the API based on the product ID
 * Displays the product details and fetches similar products
 */
async function fetchProductDetails() {
  try {
    // Fetch product details from API
    const res = await fetch(`${API_URL}/${productDetailsId}`);
    productDetailsinfo = await res.json();

    // Display the product details
    displayProductDetails(productDetailsinfo);

    // Fetch similar products from the same category
    fetchSimilarProducts(productDetailsinfo.category);

    // Attach event handlers to add-to-cart buttons
    attachAddToCartHandlers();
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

/**
 * Displays product details in the product container
 * @param {Object} product - The product object containing all details
 */
function displayProductDetails(product) {
  // Clear previous content
  productDetailsContainer.innerHTML = "";

  // Add Bootstrap classes for styling the container
  productDetailsContainer.classList.add(
    "container", // Ensures responsiveness
    "mw-75", // Limits max width
    "mx-auto",
    "mt-5",
    "mb-5",
    "border",
    "rounded",
    "p-4"
  );

  // Create a Bootstrap row to structure columns
  const row = document.createElement("div");
  row.classList.add("row", "g-4"); // g-4 adds gap between columns

  // Product Images Section (left column)
  const productImages = document.createElement("div");
  productImages.classList.add("col-lg-4", "col-md-6", "col-sm-12");
  productImages.innerHTML = `
        <img src="${product.thumbnail}" class="img-fluid rounded" alt="${product.title}">
    `;

  // Product Details Section (right column)
  const productDetails = document.createElement("div");
  productDetails.classList.add("col-lg-8", "col-md-6", "col-sm-12");
  productDetails.innerHTML = `
        <button class="btn btn-light mb-3" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Back
        </button>
  
        <h6 class="text-secondary small">${product.category}</h6> 
        <h5 class="text-secondary small">${product.title}</h5> 
  
        <h2 class="fw-bold d-flex align-items-center gap-3">$${product.price} 
            <span class="fs-6 text-danger">${product.discountPercentage}%</span> 
        </h2> 
  
        <p class="text-muted">${product.description}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
    `;

  // Add to Cart Button
  const addToCartBtn = document.createElement("button");
  addToCartBtn.innerText = "Add to Cart";
  addToCartBtn.dataset.id = product.id;
  addToCartBtn.classList.add(
    "btn",
    "grad-color",
    "add-to-cart",
    "w-100",
    "mt-3"
  );

  // Append button to product details
  productDetails.appendChild(addToCartBtn);

  // Append sections to row
  row.appendChild(productImages);
  row.appendChild(productDetails);

  // Append row to the main container
  productDetailsContainer.appendChild(row);
}

/**
 * Loads comments from localStorage and displays them
 */
function loadComments() {
  // Get comments from localStorage or initialize empty array
  const comments =
    JSON.parse(localStorage.getItem(`comments-${productDetailsId}`)) || [];
  commentsSection.innerHTML = "";

  // Create and display each comment with a delete button
  comments.forEach((comment, index) => {
    const commentDiv = document.createElement("div");
    commentDiv.textContent = comment;
    commentDiv.classList.add("comment");

    // Create delete button for each comment
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.border = "none";
    deleteBtn.style.backgroundColor = "transparent";
    deleteBtn.onclick = () => removeComment(index);

    commentDiv.appendChild(deleteBtn);
    commentsSection.appendChild(commentDiv);
  });
}

/**
 * Event listener for adding a new comment
 */
addCommentBtn.addEventListener("click", () => {
  const comment = commentText.value.trim();
  if (!comment) return; // Don't add empty comments

  // Get existing comments or initialize empty array
  let comments =
    JSON.parse(localStorage.getItem(`comments-${productDetailsId}`)) || [];

  // Add new comment and save to localStorage
  comments.push(comment);
  localStorage.setItem(
    `comments-${productDetailsId}`,
    JSON.stringify(comments)
  );

  // Clear input and reload comments
  commentText.value = "";
  loadComments();
});

/**
 * Removes a comment at the specified index
 * @param {number} index - The index of the comment to remove
 */
function removeComment(index) {
  let comments =
    JSON.parse(localStorage.getItem(`comments-${productDetailsId}`)) || [];
  comments.splice(index, 1); // Remove comment at index
  localStorage.setItem(
    `comments-${productDetailsId}`,
    JSON.stringify(comments)
  );
  loadComments(); // Refresh comments display
}

/**
 * Fetches similar products from the same category
 * @param {string} category - The product category to filter by
 */
async function fetchSimilarProducts(category) {
  // Fetch all products from API
  const res = await fetch(PRODUCTS_API_URL);
  const data = await res.json();

  // Filter products by category and exclude current product
  similarProducts = data.products.filter(
    (product) => product.category === category && product.id != productDetailsId
  );

  // Display similar products (limited by PRODUCTS_PER_PAGE)
  displayProducts(
    "similar-products",
    similarProducts.slice(0, PRODUCTS_PER_PAGE)
  );

  // Attach event handlers to add-to-cart buttons
  attachAddToCartHandlers();
}
