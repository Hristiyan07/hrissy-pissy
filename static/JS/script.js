// cart.js

document.addEventListener("DOMContentLoaded", () => {

  const cartContainer = document.querySelector(".cart-rows");
  const sumSubtotal = document.getElementById("sum-subtotal");
  const sumShipping = document.getElementById("sum-shipping");
  const sumTax = document.getElementById("sum-tax");
  const sumTotal = document.getElementById("sum-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ---------- Helper ----------
  function formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ---------- Render Cart ----------
  function renderCart() {

    if (!cartContainer) return; // ако не сме на cart page

    cartContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          Your cart is empty ☕
        </div>
      `;
    }

    cart.forEach((item) => {

      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;

      const row = document.createElement("div");
      row.classList.add("cart-row");
      row.dataset.id = item.id;

      row.innerHTML = `
        <div class="cart-item">
          <div class="cart-name">${item.name}</div>
          <div class="cart-sub">
            ${formatPrice(item.price)} <span class="muted">each</span>
          </div>
          <div class="qty">
            <button type="button" data-dec>−</button>
            <span>${item.quantity}</span>
            <button type="button" data-inc>+</button>
          </div>
        </div>

        <div class="cart-right">
          <div class="line-total">${formatPrice(lineTotal)}</div>
          <button class="trash" type="button" data-remove>🗑</button>
        </div>
      `;

      cartContainer.appendChild(row);
    });

    const shipping = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (sumSubtotal) sumSubtotal.textContent = formatPrice(subtotal);
    if (sumShipping) sumShipping.textContent = formatPrice(shipping);
    if (sumTax) sumTax.textContent = formatPrice(tax);
    if (sumTotal) sumTotal.textContent = formatPrice(total);
  }

  // ---------- Cart Interaction (Cart Page) ----------
  if (cartContainer) {
    cartContainer.addEventListener("click", (e) => {

      const row = e.target.closest(".cart-row");
      if (!row) return;

      const id = row.dataset.id;
      const item = cart.find(p => p.id === id);
      if (!item) return;

      if (e.target.matches("[data-inc]")) {
        item.quantity++;
      }

      if (e.target.matches("[data-dec]")) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart = cart.filter(p => p.id !== id);
        }
      }

      if (e.target.matches("[data-remove]")) {
        cart = cart.filter(p => p.id !== id);
      }

      saveCart();
      renderCart();
    });
  }

  // ---------- Add To Cart (Shop Page) ----------
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {

      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const id = name.toLowerCase().replace(/\s+/g, "-");

      const existingItem = cart.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          id: id,
          name: name,
          price: price,
          quantity: 1
        });
      }

      saveCart();

      // Малък визуален feedback
      button.textContent = "Added ✓";
      setTimeout(() => {
        button.textContent = "Add to Cart";
      }, 1000);
    });
  });

  // ---------- Active Nav ----------
  const page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll("[data-nav]").forEach(link => {
      if (link.dataset.nav === page) {
        link.classList.add("active");
      }
    });
  }

  // Initial render
  renderCart();

    //login/signup panel

  const userBtn = document.getElementById("userBtn");
  const userPanel = document.getElementById("userPanel");
  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");

  if (userBtn && userPanel) {

    // toggle panel
    userBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userPanel.classList.toggle("open");
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!userPanel.contains(e.target) && e.target !== userBtn) {
        userPanel.classList.remove("open");
      }
    });

    // switch views
    switchToSignup?.addEventListener("click", () => {
      userPanel.classList.add("signup-mode");
    });

    switchToLogin?.addEventListener("click", () => {
      userPanel.classList.remove("signup-mode");
    });
  }
  //api calls for login/signup

const API = "/api";

// --- Login ---
// --- Login ---
const loginSubmit = document.getElementById("loginSubmit");
const loginError  = document.getElementById("loginError");

function clearLoginErrors() {
  document.getElementById("loginEmailError").textContent = "";
  document.getElementById("loginPasswordError").textContent = "";
  loginError.textContent = "";
}

loginSubmit?.addEventListener("click", async () => {
  clearLoginErrors();

  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  let hasError = false;

  if (!email || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
    document.getElementById("loginEmailError").textContent = "Please enter a valid email address.";
    hasError = true;
  }

  if (!password) {
    document.getElementById("loginPasswordError").textContent = "Password is required.";
    hasError = true;
  }

  if (hasError) return;

  const res  = await fetch(`${API}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    loginError.textContent = "";
    userPanel.classList.remove("open");
    userBtn.textContent = `👤 ${data.username}`;
  } else {
    loginError.textContent = data.error;
  }
});

// --- Signup ---
const signupSubmit = document.getElementById("signupSubmit");
const signupError  = document.getElementById("signupError");

function clearSignupErrors() {
  document.getElementById("signupUsernameError").textContent = "";
  document.getElementById("signupEmailError").textContent = "";
  document.getElementById("signupPasswordError").textContent = "";
  document.getElementById("signupConfirmPasswordError").textContent = "";
  signupError.textContent = "";
}

signupSubmit?.addEventListener("click", async () => {
  clearSignupErrors();

  const username        = document.getElementById("signupUsername").value.trim();
  const email           = document.getElementById("signupEmail").value.trim();
  const password        = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;

  let hasError = false;

  if (!username || username.length < 3 || username.length > 30) {
    document.getElementById("signupUsernameError").textContent = "Name must be between 3 and 30 characters.";
    hasError = true;
  } else if (!/^[\w.\- ]+$/.test(username)) {
    document.getElementById("signupUsernameError").textContent = "Name contains invalid characters.";
    hasError = true;
  }

  if (!email || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
    document.getElementById("signupEmailError").textContent = "Please enter a valid email address.";
    hasError = true;
  }

  if (password.length < 8) {
    document.getElementById("signupPasswordError").textContent = "Password must be at least 8 characters.";
    hasError = true;
  } else if (!/[A-Z]/.test(password)) {
    document.getElementById("signupPasswordError").textContent = "Password needs at least one uppercase letter.";
    hasError = true;
  } else if (!/[a-z]/.test(password)) {
    document.getElementById("signupPasswordError").textContent = "Password needs at least one lowercase letter.";
    hasError = true;
  } else if (!/\d/.test(password)) {
    document.getElementById("signupPasswordError").textContent = "Password needs at least one number.";
    hasError = true;
  }

  if (password !== confirmPassword) {
    document.getElementById("signupConfirmPasswordError").textContent = "Passwords do not match.";
    hasError = true;
  }

  if (hasError) return;

  const res  = await fetch(`${API}/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();

  if (res.ok) {
    signupError.style.color = "green";
    signupError.textContent = "Account created! You can now log in.";
    userPanel.classList.remove("signup-mode");
  } else {
    signupError.style.color = "red";
    signupError.textContent = data.error;
  }
});

// --- Check if already logged in on page load ---
fetch(`${API}/me`, { credentials: "include" })
  .then(r => r.json())
  .then(data => {
    if (data.username) {
      userBtn.textContent = `👤 ${data.username}`;
    }
  });

});