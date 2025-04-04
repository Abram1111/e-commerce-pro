# E-Commerce Pro

## Overview
E-Commerce Pro is a fully functional e-commerce web application that provides users with a seamless shopping experience. The project includes user authentication, product listing, cart management, and a commenting system. Built with JavaScript, Bootstrap, and a backend API, this project is designed to be scalable and user-friendly.

## Features
- **User Authentication**: Login and register functionality with local storage.
- **Product Listing**: Fetch products from an API and display them in various categories.
- **Product Details**: View individual product details, including price, stock, and ratings.
- **Shopping Cart**: Add products to the cart and track the total count.
- **Comments System**: Users can add and remove comments for products.
- **Similar Products**: Display related products based on category.
- **Responsive Design**: Fully optimized for all screen sizes using Bootstrap.

## Technologies Used
- HTML, CSS, Bootstrap
- JavaScript (Vanilla JS)
- LocalStorage (for authentication and cart management)
- Fetch API (for retrieving products)

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Abram1111/e-commerce-pro.git
   ```
2. Navigate to the project directory:
   ```sh
   cd e-commerce-pro
   ```
3. Open `index.html` in your browser or use a live server extension in VS Code.

## File Structure
```
/e-commerce-pro
│── index.html               # Homepage
│── login.html               # Login page
│── register.html            # Registration page
│── cart.html                # Shopping cart page
│── product-details.html     # Product details page
│── styles.css               # Custom styles
│── script.js                # Main JavaScript file
│── cart.js                  # Cart management logic
│── auth.js                  # User authentication handling
│── products.js              # Fetch and display products
│── README.md                # Project documentation
```

## Usage
### User Authentication
- Users can register and log in using localStorage.
- Authenticated users can add items to their cart.
- Users can log out to clear session data.

### Browsing Products
- Products are fetched from `https://dummyjson.com/products`.
- Users can filter and browse products by categories.
- Clicking a product opens its details page.

### Shopping Cart
- Users can add or remove products from their cart.
- The cart persists using localStorage.
- The total item count is updated dynamically.

### Comments Section
- Users can add comments to a product.
- Comments are stored in localStorage.
- Users can delete their comments.


## Contact
For any inquiries, contact [Abram Gad](https://github.com/Abram1111).
