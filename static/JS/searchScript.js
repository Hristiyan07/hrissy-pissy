document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("productSearch");

  if (!searchInput) return; // ако не сме на menu page → спира

  const products = document.querySelectorAll(".product-tile");
  const countDisplay = document.getElementById("productSearchCount");
  const emptyMessage = document.getElementById("noProductsMessage");

  let debounce;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      filterProducts(e.target.value);
    }, 200);
  });

  function filterProducts(query) {
    const value = query.toLowerCase().trim();
    let visibleCount = 0;

    products.forEach(product => {
      const titleEl = product.querySelector("h3");
      const descEl = product.querySelector("p");
      const priceEl = product.querySelector("strong");

      const title = titleEl.textContent.toLowerCase();
      const desc = descEl.textContent.toLowerCase();
      const price = priceEl.textContent.toLowerCase();

      const match =
        title.includes(value) ||
        desc.includes(value) ||
        price.includes(value);

      product.style.display = match ? "" : "none";

      if (match) {
        visibleCount++;
      }
    });

    countDisplay.textContent = value
      ? `${visibleCount} result${visibleCount !== 1 ? "s" : ""}`
      : "";

    emptyMessage.style.display =
      visibleCount === 0 && value ? "block" : "none";
  }

});