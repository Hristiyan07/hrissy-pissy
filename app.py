from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import pyodbc
import bcrypt

app = Flask(__name__)
app.secret_key = "lubabd"
CORS(app, supports_credentials=True, origins=["null", "http://localhost:5000", "http://127.0.0.1:5000"])

def get_db():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=DESKTOP-8HTO2EI;"
        "DATABASE=HrissyPissyDB;"
        "UID=web_user;"
        "PWD=123456789;"
    )
    return conn

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

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required."}), 400

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)",
            username, email, hashed.decode("utf-8")
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Account created successfully!"}), 201
    except pyodbc.IntegrityError:
        return jsonify({"error": "Username or email already exists."}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT userID, username, password_hash FROM Users WHERE email = ?", email
        )
        row = cursor.fetchone()
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

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out."}), 200

@app.route("/api/me", methods=["GET"])
def me():
    if "user_id" in session:
        return jsonify({"username": session["username"]}), 200
    return jsonify({"error": "Not logged in."}), 401

if __name__ == "__main__":
    app.run(debug=True, port=5002)