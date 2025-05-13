const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Odoo config
const url = 'https://inventorly.odoo.com';
const db = 'inventorly';
const username = 'frankaisabelle.ong.22@usjr.edu.ph';
const apiKey = '';

// Odoo auth
async function authenticate() {
  const res = await axios.post(url + '/jsonrpc', {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'common',
      method: 'login',
      args: [db, username, apiKey],
    },
    id: Math.floor(Math.random() * 1000),
  });
  return res.data.result;
}

// Get products
async function getProducts() {
  const uid = await authenticate();
  const res = await axios.post(url + '/jsonrpc', {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute',
      args: [
        db,
        uid,
        apiKey,
        'product.product',
        'search_read',
       [['active', '=', true]],
        ['id', 'name', 'list_price', 'type']
      ],
    },
    id: Math.floor(Math.random() * 1000),
  });
  return res.data.result;
}

// Create product
async function createProduct(data) {
  const uid = await authenticate();

  const productData = {
    name: data.name,
    list_price: data.list_price,
    type: data.type,
  };

  if (data.type === 'consu' || data.type === 'product') {
    productData.categ_id = 1;    
    productData.uom_id = 1;     
  }

  const res = await axios.post(url + '/jsonrpc', {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute',
      args: [db, uid, apiKey, 'product.product', 'create', [productData]],
    },
    id: Math.floor(Math.random() * 1000),
  });

  if (res.data.error) {
    console.error('Odoo error:', res.data.error); 
    throw new Error(res.data.error.message);
  }

  console.log('Created product ID:', res.data.result);
  return res.data.result;
}

// Delete product
async function deleteProduct(id) {
  const uid = await authenticate();
  const res = await axios.post(url + '/jsonrpc', {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute',
      args: [db, uid, apiKey, 'product.product', 'unlink', [id]],
    },
    id: Math.floor(Math.random() * 1000),
  });
  return res.data.result;
}

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const id = await createProduct(req.body);
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await deleteProduct(parseInt(req.params.id));
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
