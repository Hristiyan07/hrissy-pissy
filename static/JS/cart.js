// cart.js
const cartContainer = document.querySelector('.cart-rows');
const sumSubtotal = document.getElementById('sum-subtotal');
const sumShipping = document.getElementById('sum-shipping');
const sumTax = document.getElementById('sum-tax');
const sumTotal = document.getElementById('sum-total');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Helper: формат за цена
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// Рендер на количката
function renderCart() {
  cartContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    const row = document.createElement('div');
    row.classList.add('cart-row');
    row.dataset.price = item.price;
    row.innerHTML = `
      <div class="cart-item">
        <div class="cart-name">${item.name}</div>
        <div class="cart-sub">${formatPrice(item.price)} <span class="muted">each</span></div>
        <div class="qty" aria-label="Quantity selector">
          <button type="button" data-dec aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-inc aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-right">
        <div class="line-total">${formatPrice(lineTotal)}</div>
        <button class="trash" type="button" data-remove aria-label="Remove item">🗑</button>
      </div>
    `;

    // Quantity buttons
    row.querySelector('[data-inc]').addEventListener('click', () => {
      item.quantity++;
      saveAndRender();
    });
    row.querySelector('[data-dec]').addEventListener('click', () => {
      if (item.quantity > 1) item.quantity--;
      else cart.splice(index, 1);
      saveAndRender();
    });

    // Remove button
    row.querySelector('[data-remove]').addEventListener('click', () => {
      cart.splice(index, 1);
      saveAndRender();
    });

    cartContainer.appendChild(row);
  });

  const shipping = subtotal ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  sumSubtotal.textContent = formatPrice(subtotal);
  sumShipping.textContent = formatPrice(shipping);
  sumTax.textContent = formatPrice(tax);
  sumTotal.textContent = formatPrice(total);
}

// Save cart to localStorage and re-render
function saveAndRender() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Initialize
renderCart();

document.addEventListener("DOMContentLoaded", () => {

  const cartContainer = document.querySelector(".cart-rows");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-row";

      row.innerHTML = `
        <div>${item.name}</div>
        <div>${item.quantity}</div>
      `;

      cartContainer.appendChild(row);
    });
  }

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const id = name.toLowerCase().replace(/\s+/g, "-");

      const existing = cart.find(i => i.id === id);

      if (existing) existing.quantity++;
      else cart.push({ id, name, price, quantity: 1 });

      saveCart();
    });
  });

  renderCart();
});