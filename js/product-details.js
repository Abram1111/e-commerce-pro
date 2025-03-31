const urlParams = new URLSearchParams(window.location.search);
const productDetailsId = urlParams.get("id");
const productDetailsContainer = document.getElementById("product-container");
const commentsSection = document.getElementById("comments-section");
const addCommentBtn = document.getElementById("add-comment-btn");
const commentText = document.getElementById("comment-text");
const similarProductsContainer = document.getElementById("similar-products");
let productDetailsinfo = [];
let similarProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchProductDetails();
  loadComments();
});

// Load product details
async function fetchProductDetails() {
  try {
    const res = await fetch(`${API_URL}/${productDetailsId}`);
    productDetailsinfo = await res.json();

    displayProductDetails(productDetailsinfo);
    fetchSimilarProducts(productDetailsinfo.category);
    attachAddToCartHandlers();
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

// Display product details
function displayProductDetails(product) {
  // Clear previous content
  productDetailsContainer.innerHTML = "";

  // Apply Bootstrap container styles
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

  // Product Images Section
  const productImages = document.createElement("div");
  productImages.classList.add("col-lg-4", "col-md-6", "col-sm-12");
  productImages.innerHTML = `
        <img src="${product.thumbnail}" class="img-fluid rounded" alt="${product.title}">
    `;

  // Product Details Section
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

// Load comments from localStorage
function loadComments() {
  const comments =
    JSON.parse(localStorage.getItem(`comments-${productDetailsId}`)) || [];
  commentsSection.innerHTML = "";

  comments.forEach((comment, index) => {
    const commentDiv = document.createElement("div");
    commentDiv.textContent = comment;
    commentDiv.classList.add("comment");

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

// Add comment
addCommentBtn.addEventListener("click", () => {
  const comment = commentText.value.trim();
  if (!comment) return;

  let comments =
    JSON.parse(localStorage.getItem(`comments-${productDetailsId}`)) || [];
  comments.push(comment);
  localStorage.setItem(
    `comments-${productDetailsId}`,
    JSON.stringify(comments)
  );

  commentText.value = "";
  loadComments();
});

// Remove comment
function removeComment(index) {
  let comments =
    JSON.parse(localStorage.getItem(`comments-${productDetailsId}`)) || [];
  comments.splice(index, 1);
  localStorage.setItem(
    `comments-${productDetailsId}`,
    JSON.stringify(comments)
  );
  loadComments();
}

// Fetch similar products

async function fetchSimilarProducts(category) {
  const res = await fetch(PRODUCTS_API_URL);
  const data = await res.json();
  similarProducts = data.products.filter(
    (product) => product.category === category && product.id != productDetailsId
  );

  displayProducts(
    "similar-products",
    similarProducts.slice(0, PRODUCTS_PER_PAGE)
  );
  attachAddToCartHandlers();
}
