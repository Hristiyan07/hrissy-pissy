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

// ---- SIGNUP VALIDATION ----
function validateSignupForm(username, email, password, confirmPassword) {
    const errors = {};

    if (!username || username.trim().length < 3 || username.trim().length > 30) {
        errors.username = "Username must be 3–30 characters.";
    } else if (!/^[\w.-]+$/.test(username)) {
        errors.username = "Username can only contain letters, numbers, _, -, .";
    }

    if (!email || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!password || password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
        errors.password = "Password needs at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
        errors.password = "Password needs at least one lowercase letter.";
    } else if (!/\d/.test(password)) {
        errors.password = "Password needs at least one number.";
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
}

// Call on form submit:
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(); // clear previous inline error messages

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const errors = validateSignupForm(username, email, password, confirmPassword);

    if (Object.keys(errors).length > 0) {
        // Show inline errors
        for (const [field, msg] of Object.entries(errors)) {
            const el = document.getElementById(`${field}-error`);
            if (el) el.textContent = msg;
        }
        return;
    }

    // Proceed with API call...
    const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
        document.getElementById("form-error").textContent = data.error;
    } else {
        // redirect or show success
    }
});


// ---- LOGIN VALIDATION ----
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
        document.getElementById("login-email-error").textContent = "Please enter a valid email.";
        return;
    }
    if (!password) {
        document.getElementById("login-password-error").textContent = "Password is required.";
        return;
    }

    const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
        document.getElementById("login-error").textContent = data.error;
    } else {
        window.location.href = "/";
    }
});