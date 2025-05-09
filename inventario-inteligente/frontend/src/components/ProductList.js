import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList({ refreshProducts }) {
  const [productos, setProductos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    cantidad: '',
    precio: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:5000/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener productos:', error));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      axios.delete(`http://127.0.0.1:5000/productos/${id}`)
        .then(() => {
          fetchProducts();
        })
        .catch(error => console.error('Error al eliminar producto:', error));
    }
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setEditForm({
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio: producto.precio
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = (id) => {
    const datos = {
      nombre: editForm.nombre,
      cantidad: parseInt(editForm.cantidad, 10),
      precio: parseFloat(editForm.precio)
    };

    axios.put(`http://127.0.0.1:5000/productos/${id}`, datos)
      .then(() => {
        setEditingId(null);
        fetchProducts();
      })
      .catch(error => console.error('Error al actualizar producto:', error));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>
                {editingId === producto.id ? (
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={editForm.nombre}
                    onChange={handleEditChange}
                  />
                ) : (
                  producto.nombre
                )}
              </td>
              <td>
                {editingId === producto.id ? (
                  <input
                    type="number"
                    name="cantidad"
                    className="form-control"
                    value={editForm.cantidad}
                    onChange={handleEditChange}
                  />
                ) : (
                  producto.cantidad
                )}
              </td>
              <td>
                {editingId === producto.id ? (
                  <input
                    type="number"
                    step="0.01"
                    name="precio"
                    className="form-control"
                    value={editForm.precio}
                    onChange={handleEditChange}
                  />
                ) : (
                  `$${producto.precio}`
                )}
              </td>
              <td>
                {editingId === producto.id ? (
                  <>
                    <button 
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleEditSubmit(producto.id)}
                    >
                      Guardar
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(producto)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(producto.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;