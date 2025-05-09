import React, { useState } from 'react';
import axios from 'axios';

function ProductForm({ onProductAdded }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stockSummary, setStockSummary] = useState(null);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const datos = {
      nombre,
      cantidad: parseInt(cantidad, 10),
      precio: parseFloat(precio)
    };

    axios.post('http://127.0.0.1:5000/productos', datos)
      .then(() => {
        setNombre('');
        setCantidad('');
        setPrecio('');
        setSuccess(true);
        if (onProductAdded) onProductAdded();
      })
      .catch(error => {
        console.error('Error al agregar producto:', error);
        setError('Error al agregar producto');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCheckStock = async () => {
    setIsLoadingStock(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:5000/stock');
      setStockSummary({
        total: response.data.inventario_total,
        productCount: response.data.total_productos,
        lastUpdated: new Date(response.data.ultima_actualizacion).toLocaleString(),
        topProducts: response.data.productos.slice(0, 3) // Mostrar solo los 3 principales
      });
    } catch (err) {
      console.error('Error al consultar stock:', err);
      setError('Error al consultar niveles de stock');
    } finally {
      setIsLoadingStock(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Cantidad</label>
        <input
          type="number"
          className="form-control"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          required
          min="0"
        />
      </div>
      <div className="form-group">
        <label>Precio</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          required
          min="0"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
      </button>

      <button
        type="button"
        className="btn btn-info mt-2 ms-2"
        onClick={handleCheckStock}
        disabled={isLoadingStock}
      >
        {isLoadingStock ? 'Cargando...' : 'Consultar Resumen de Stock'}
      </button>

      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">Producto agregado correctamente!</div>}

      {stockSummary && (
        <div className="mt-4 p-3 border rounded bg-light">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Resumen de Inventario</h5>
            <small className="text-muted">Actualizado: {stockSummary.lastUpdated}</small>
          </div>

          <div className="row text-center mb-3">
            <div className="col-md-6">
              <div className="card bg-primary text-white p-3">
                <h6>Total en Inventario</h6>
                <h3 className="mb-0">{stockSummary.total.toLocaleString()}</h3>
                <small>unidades</small>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-success text-white p-3">
                <h6>Productos Registrados</h6>
                <h3 className="mb-0">{stockSummary.productCount}</h3>
                <small>diferentes</small>
              </div>
            </div>
          </div>

          <h6 className="mt-3">Productos Destacados</h6>
          <div className="table-responsive">
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Cantidad</th>
                  <th className="text-end">Valor Unitario</th>
                </tr>
              </thead>
              <tbody>
                {stockSummary.topProducts.map(producto => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td className="text-end">{producto.cantidad.toLocaleString()}</td>
                    <td className="text-end">${parseFloat(producto.precio).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </form>
  );
}

export default ProductForm;