class ProductoModel:
    def __init__(self, mysql):
        self.mysql = mysql

    def obtener_todos(self):
        conn = self.mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM productos")
        productos = cursor.fetchall()
        cursor.close()
        return productos

    def agregar(self, nombre, cantidad, precio):
        conn = self.mysql.connection
        cursor = conn.cursor()

        sql = "INSERT INTO productos (nombre, cantidad, precio) VALUES (%s, %s, %s)"
        valores = (nombre, cantidad, precio)

        cursor.execute(sql, valores)
        conn.commit()

        cursor.close()

    def actualizar(self, id, nombre, cantidad, precio):
        conn = self.mysql.connection
        cursor = conn.cursor()

        sql = "UPDATE productos SET nombre=%s, cantidad=%s, precio=%s WHERE id=%s"
        valores = (nombre, cantidad, precio, id)

        cursor.execute(sql, valores)
        conn.commit()
        cursor.close()

    def eliminar(self, id):
        conn = self.mysql.connection
        cursor = conn.cursor()

        sql = "DELETE FROM productos WHERE id=%s"
        cursor.execute(sql, (id,))
        conn.commit()
        cursor.close()


def obtener_bajo_stock(self):
        """
        Devuelve los productos cuyo stock es menor que min_stock (o 5 si es NULL).
        """
        conn = self.mysql.connection
        cursor = conn.cursor()  # DictCursor por configuración
        cursor.execute("""
            SELECT id, nombre, cantidad, precio, min_stock
            FROM productos
            WHERE cantidad < COALESCE(min_stock, 5)
        """)
        productos = cursor.fetchall()
        cursor.close()
        return productos
