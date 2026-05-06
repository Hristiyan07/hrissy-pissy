const PRODUCTS = {
  midnight: {
    name: "Midnight Elegance",
    price: 18.99,
    desc: "Dark roast with notes of chocolate and caramel. Bold, smooth, and rich.",
    img: "/static/Pictures/prod-midnight.jpg"
  },
  amber: {
    name: "Amber Sunrise",
    price: 16.99,
    desc: "Medium roast with citrus and floral undertones. Bright and balanced.",
    img: "/static/Pictures/prod-amber.jpg"
  },
  highland: {
    name: "Highland Reserve",
    price: 17.99,
    desc: "Light roast with berry and nutty notes. Crisp, clean finish.",
    img: "/static/Pictures/prod-highland.jpg"
  },
  xpresso: {
    name: "Xpresso Noir",
    price: 10.99,
    desc: "Bold espresso blend with rich crema. Deep and intense.",
    img: "/static/Pictures/prod-xpresso.jpg"
  },
  vanilla: {
    name: "Vanilla Dream",
    price: 18.99,
    desc: "Medium roast infused with natural vanilla. Comforting and sweet.",
    img: "/static/Pictures/prod-vanilla.jpg"
  },
  decaf: {
    name: "Decaf Elegance",
    price: 17.99,
    desc: "Decaffeinated medium roast with chocolate notes. Smooth and mellow.",
    img: "/static/Pictures/prod-decaf.jpg"
  }
};

// Get product id from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "midnight";
const product = PRODUCTS[productId];

// Populate page
if (product) {
  document.title = `Hrissy-Pissy • ${product.name}`;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-desc").textContent = product.desc;
  document.getElementById("product-price").textContent =
    `$${product.price.toFixed(2)}`;
  document.getElementById("product-image").src = product.img;
  document.getElementById("product-image").alt = product.name;
}

// Add to cart (съвместимо с cart.js)
document.getElementById("add-to-cart").addEventListener("click", () => {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      quantity: 1          
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // малък визуален feedback
  const button = document.getElementById("add-to-cart");
  button.textContent = "Added ✓";
  setTimeout(() => {
    button.textContent = "Add to Cart";
  }, 1000);
});