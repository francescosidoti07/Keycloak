import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseWrapper:
    def __init__(self):
        self.db_config = {
            'host': os.getenv('DB_HOST'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'database': os.getenv('DB_NAME'),
            'port': int(os.getenv('DB_PORT')),
            'cursorclass': pymysql.cursors.DictCursor
        }
        self.create_table()

    def connect(self):
        """Stabilisce la connessione al database"""
        return pymysql.connect(**self.db_config)

    def execute_query(self, query, params=()):
        """Metodo generico per eseguire query di modifica"""
        conn = self.connect()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                conn.commit()
        finally:
            conn.close()

    def create_table(self):
        """Crea la tabella per la lista della spesa"""
        self.execute_query('''
            CREATE TABLE IF NOT EXISTS shopping_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                item VARCHAR(255) NOT NULL
            )
        ''')

    def get_user_items(self, username):
        """Recupera tutti gli elementi di un utente specifico"""
        query = "SELECT id, item FROM shopping_items WHERE username = %s"
        conn = self.connect()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, (username,))
                return cursor.fetchall()
        except Exception as e:
            print(f"Errore nel recupero degli elementi: {e}")
            return []
        finally:
            conn.close()

    def add_item(self, username, item):
        """Inserisce un nuovo elemento nella lista dell'utente"""
        query = "INSERT INTO shopping_items (username, item) VALUES (%s, %s)"
        conn = self.connect()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, (username, item))
            conn.commit()
            return True
        except Exception as e:
            print(f"Errore nell'inserimento dell'elemento: {e}")
            return False
        finally:
            conn.close()

    def delete_item(self, item_id, username):
        """Elimina un elemento assicurandosi che appartenga all'utente"""
        query = "DELETE FROM shopping_items WHERE id = %s AND username = %s"
        conn = self.connect()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, (item_id, username))
            conn.commit()
            return True
        except Exception as e:
            print(f"Errore nell'eliminazione dell'elemento: {e}")
            return False
        finally:
            conn.close()