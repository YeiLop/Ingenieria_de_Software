import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <h2>Gestión de Inventario</h2>
      <ProductForm onProductAdded={() => setRefreshKey(prev => prev + 1)} />
      <ProductList key={refreshKey} />
    </div>
  );
}

export default Home;