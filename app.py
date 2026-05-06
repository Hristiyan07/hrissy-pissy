from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import psycopg2
import bcrypt
import os
import re
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "lubabd")
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5002", "http://localhost:5002"])

# ---------- DB Connection ----------
def get_db():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    return conn

# ---------- Page Routes ----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/menu")
def menu():
    return render_template("menu.html")

@app.route("/product")
def product():
    return render_template("product.html")

@app.route("/service")
def service():
    return render_template("service.html")

# ---------- Helpers ----------
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    return re.match(pattern, email) is not None

def is_strong_password(password):
    # At least 8 chars, 1 uppercase, 1 lowercase, 1 digit
    if len(password) < 8:
        return False, "Password must be at least 8 characters."
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number."
    return True, ""

# ---------- SIGNUP ----------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # --- Validation ---
    if not username or not email or not password:
        return jsonify({"error": "All fields are required."}), 400

    if len(username) < 3 or len(username) > 30:
        return jsonify({"error": "Username must be between 3 and 30 characters."}), 400

    if not re.match(r'^[\w.-]+$', username):
        return jsonify({"error": "Username can only contain letters, numbers, underscores, hyphens, and dots."}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email address."}), 400

    valid_pw, pw_msg = is_strong_password(password)
    if not valid_pw:
        return jsonify({"error": pw_msg}), 400

    # --- Insert ---
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, hashed.decode("utf-8"))
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Account created successfully!"}), 201
    except psycopg2.errors.UniqueViolation:
        return jsonify({"error": "Username or email already exists."}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- LOGIN ----------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email address."}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT userID, username, password_hash FROM Users WHERE email = %s", (email,)
        )
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            return jsonify({"error": "Invalid email or password."}), 401

        user_id, username, stored_hash = row
        if bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            session["user_id"] = user_id
            session["username"] = username
            return jsonify({"message": "Logged in!", "username": username}), 200
        else:
            return jsonify({"error": "Invalid email or password."}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- LOGOUT ----------
@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out."}), 200

# ---------- CHECK SESSION ----------
@app.route("/api/me", methods=["GET"])
def me():
    if "user_id" in session:
        return jsonify({"username": session["username"]}), 200
    return jsonify({"error": "Not logged in."}), 401

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    app.run(host="0.0.0.0", port=port)