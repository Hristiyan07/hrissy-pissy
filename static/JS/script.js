const API = "https://hrissy-pissy-production.up.railway.app"; // CHANGE TO YOUR BACKEND

loginSubmit?.addEventListener("click", async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    userPanel.classList.remove("open");
    showLoggedIn(data.username);
  } else {
    loginError.textContent = data.error;
  }
});

// SIGNUP
const signupSubmit = document.getElementById("signupSubmit");

signupSubmit?.addEventListener("click", async () => {
  const username = signupUsername.value;
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirm = signupConfirmPassword.value;

  if (password !== confirm) {
    signupError.textContent = "Passwords do not match";
    return;
  }

  const res = await fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();

  signupError.textContent = res.ok ? "Account created!" : data.error;
});

// LOGGED IN UI
function showLoggedIn(username) {
  userBtn.textContent = `👤 ${username}`;
  userPanel.innerHTML = `
    <p>Welcome ${username}</p>
    <button id="logoutBtn">Logout</button>
  `;

  document.getElementById("logoutBtn").onclick = async () => {
    await fetch(`${API}/logout`, { method: "POST", credentials: "include" });
    location.reload();
  };
}

// SESSION CHECK
fetch(`${API}/me`, { credentials: "include" })
  .then(r => r.json())
  .then(data => {
    if (data.username) showLoggedIn(data.username);
  });