from flask import Flask, request, jsonify, g
from flask_cors import CORS
from auth import require_auth
from databasewrapper import DatabaseWrapper

app = Flask(__name__)
CORS(app)

db = DatabaseWrapper() # Inizializziamo il database

@app.route("/items", methods=["GET"])
@require_auth
def get_items():
    username = g.user.get("preferred_username")
    items = db.get_user_items(username)
    return jsonify({"items": items, "user": username})

@app.route("/items", methods=["POST"])
@require_auth
def add_item():
    username = g.user.get("preferred_username")
    data = request.get_json()
    item = data.get("item", "").strip()
    
    if not item:
        return jsonify({"error": "Item non può essere vuoto"}), 400
        
    db.add_item(username, item)
    # Restituiamo la lista aggiornata
    items = db.get_user_items(username)
    return jsonify({"message": "Aggiunto", "items": items}), 201

# Nuova rotta per eliminare l'elemento
@app.route("/items/<int:item_id>", methods=["DELETE"])
@require_auth
def delete_item(item_id):
    username = g.user.get("preferred_username")
    db.delete_item(item_id, username)
    
    # Restituiamo la lista aggiornata
    items = db.get_user_items(username)
    return jsonify({"message": "Eliminato", "items": items}), 200

if __name__ == "__main__":
    app.run(debug=True)