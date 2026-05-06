// menu.js
const addButtons = document.querySelectorAll('.btn-sm');

addButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const card = btn.closest('.product-tile');
    const name = card.querySelector('h3').textContent;
    const price = parseFloat(card.querySelector('.tile-bottom strong').textContent.replace('$',''));
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(p => p.name === name);
    if (existing) existing.quantity++;
    else cart.push({ name, price, quantity: 1 });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
  });
});