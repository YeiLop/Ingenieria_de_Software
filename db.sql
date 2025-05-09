CREATE DATABASE inventario_db;
USE inventario_db;
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0.00
);
/* Invoke-WebRequest -Uri "http://127.0.0.1:5000/productos" -Method Get */
