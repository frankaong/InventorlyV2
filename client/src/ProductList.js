import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, deleteProduct } from './api';
import './ProductList.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('service');

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ name, type, list_price: parseFloat(price) });
      const res = await fetchProducts();
      setProducts(res.data);
      setName('');
      setPrice('');
    } catch (err) {
      console.error('Create failed:', err);
      alert('Failed to create product. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    const res = await fetchProducts();
    setProducts(res.data);
  };

  return (
    <div className="product-container">
      <h2>📦 Inventory Management</h2>

      <form className="product-form" onSubmit={handleAdd}>
        <label>
          Product Name:
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Price:
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </label>
        <label>
          Type:
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="service">Service</option>
            <option value="consu">Consumable</option>
          </select>
        </label>
        <button type="submit">➕ Add Product</button>
      </form>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>P{p.list_price.toFixed(2)}</td>
                <td>{p.type}</td>
                <td>
                  <button onClick={() => handleDelete(p.id)}>❌ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-state">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
