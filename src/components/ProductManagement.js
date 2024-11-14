import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [message, setMessage] = useState('');
  const [soldProducts, setSoldProducts] = useState([]); // State for sold products
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from backend
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { id, name, description, category, price, quantity } = productForm;

    if (id !== null) {
      // Update product in backend via PUT request
      fetch(`http://localhost:5000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, category, price, quantity: parseInt(quantity) }),
      })
        .then((response) => response.json())
        .then(() => {
          // Update product locally
          const updatedProducts = products.map((product) =>
            product.product_id === id
              ? { ...productForm, price: parseFloat(price), quantity: parseInt(quantity) }
              : product
          );
          setProducts(updatedProducts);
        })
        .catch((err) => console.error('Error updating product:', err));
    } else {
      // Add product to backend via POST request
      fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, category, price, quantity: parseInt(quantity) }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add the new product locally
          setProducts([
            ...products,
            { product_id: data.product_id, name, description, category, price, quantity: parseInt(quantity) },
          ]);
        })
        .catch((err) => console.error('Error adding product:', err));
    }

    // Reset form
    setProductForm({
      id: null,
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
    });
  };

  const editProduct = (id) => {
    const product = products.find((product) => product.product_id === id);
    setProductForm({
      id: product.product_id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const deleteProduct = (id) => {
    console.log(`Attempting to delete product with ID: ${id}`);
    
    fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE',
    })
    .then((response) => {
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        console.log('Data received after deletion:', data);
        if (data.success) {
            const updatedProducts = products.filter((product) => product.product_id !== id);
            setProducts(updatedProducts);
            setMessage('Product deleted successfully.');
        } else {
            console.error('Failed to delete product:', data.message);
            setMessage('Failed to delete product. Please try again.');
        }
    })
    .catch((err) => {
        console.error('Error deleting product:', err);
        setMessage('Error deleting product. Please try again later.');
    });
};

  const updateProductQuantity = (updatedProduct) => {
    fetch(`http://localhost:5000/products/${updatedProduct.product_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedProducts = products.map((product) =>
          product.product_id === updatedProduct.product_id ? updatedProduct : product
        );
        setProducts(updatedProducts);
      })
      .catch((err) => console.error('Error updating product quantity:', err));
  };

  const handleBuy = (index) => {
    const product = products[index];
    const quantityToBuy = prompt('Enter quantity to buy:', '1');
    if (quantityToBuy && !isNaN(quantityToBuy)) {
      const updatedQuantity = product.quantity + parseInt(quantityToBuy);
      const updatedProduct = { ...product, quantity: updatedQuantity };
      updateProductQuantity(updatedProduct);
      setMessage(`You bought ${quantityToBuy} ${product.name}(s)`);
    }
  };

  const handleSell = (index) => {
    const product = products[index];
    if (!product) {
      console.error('Product not found!');
      return; // Early return if product does not exist
    }

    const quantityToSell = prompt('Enter quantity to sell:', '1');
    if (quantityToSell && !isNaN(quantityToSell) && product.quantity >= quantityToSell) {
      const updatedQuantity = product.quantity - parseInt(quantityToSell);
      const updatedProduct = { ...product, quantity: updatedQuantity };

      // Add to sold products
      const soldProductEntry = {
        name: product.name,
        quantity: parseInt(quantityToSell),
        timestamp: new Date().toLocaleString(), // Current date and time
      };
      setSoldProducts([...soldProducts, soldProductEntry]);

      updateProductQuantity(updatedProduct);
      setMessage(`You sold ${quantityToSell} ${product.name}(s)`);
    } else {
      alert('Invalid quantity or insufficient stock!');
    }
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    navigate('/');
  };

  // Calculate total quantity
  const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Product Management - Wings Cafe Inventory System</h1>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        <Link to="/Home" style={styles.link}>
          <i className="fas fa-tachometer-alt" style={styles.icon}></i> Dashboard
        </Link>
        <Link to="/ProductManagement" style={styles.link}>
          <i className="fas fa-box" style={styles.icon}></i> Product Management
        </Link>
        <Link to="/UserManagement" style={styles.link}>
          <i className="fas fa-users" style={styles.icon}></i> User Management
        </Link>
        <button style={styles.logoutButton} onClick={logout}>
          <i className="fas fa-sign-out-alt" style={styles.icon}></i> Logout
        </button>
      </nav>

      {/* Message */}
      {message && <div style={styles.message}>{message}</div>}

      {/* Product Form */}
      <form onSubmit={handleFormSubmit} style={styles.productForm}>
        <input
          type="text"
          name="name"
          value={productForm.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
          style={styles.input}
        />
        <input
          type="text"
          name="description"
          value={productForm.description}
          onChange={handleInputChange}
          placeholder="Product Description"
          required
          style={styles.input}
        />
        <input
          type="text"
          name="category"
          value={productForm.category}
          onChange={handleInputChange}
          placeholder="Category"
          required
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          value={productForm.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
          style={styles.input}
        />
        <input
          type="number"
          name="quantity"
          value={productForm.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          {productForm.id !== null ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {/* Total Quantity Display */}
      <h3 style={styles.totalQuantity}>Total Quantity: {totalQuantity}</h3>

      {/* Product Table */}
      <h2 style={styles.tableHeader}>Current Products</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter((product) => product.quantity > 0) // Only show products with quantity > 0
            .map((product, index) => (
              <tr key={product.product_id} style={styles.tableRow}>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>{product.description}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>{product.price}</td>
                <td style={styles.td}>{product.quantity}</td>
                <td style={styles.actions}>
                  <button style={styles.editButton} onClick={() => editProduct(product.product_id)}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button style={styles.deleteButton} onClick={() => deleteProduct(product.product_id)}>
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                  <button style={styles.button} onClick={() => handleBuy(index)}>Buy</button>
                  <button style={styles.button} onClick={() => handleSell(index)}>Sell</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Products Sold Table */}
      <h2 style={styles.tableHeader}>Products Sold</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name of Product</th>
            <th style={styles.th}>Quantity Sold</th>
            <th style={styles.th}>Time and Date Sold</th>
          </tr>
        </thead>
        <tbody>
          {soldProducts.length > 0 ? (
            soldProducts.map((soldProduct, index) => (
              <tr key={index} style={styles.tableRow}>
                <td style={styles.td}>{soldProduct.name}</td>
                <td style={styles.td}>{soldProduct.quantity}</td>
                <td style={styles.td}>{soldProduct.timestamp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={styles.td}>No products sold yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    background: 'coral',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
  },
  header: { 
    backgroundColor: 'black',
    color: 'aqua',
    padding: '20px',
    textAlign: 'center'
  },
  nav: {
    backgroundColor: 'black',
    padding: '10px',
    textAlign: 'center'
  },
  link: {
    color: 'aqua',
    textDecoration: 'none',
    padding: '10px 20px',
    margin: '0 10px'
  },
  productForm: {
    backgroundColor: '#34495E', // Darker background for the form
    padding: '30px',
    marginTop: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#2C3E50', // Darker background for inputs
    color: '#fff', // White text color
    outline: 'none',
  },
  submitButton: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#2980B9',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
    width: '100%',
  },
  totalQuantity: {
    color: 'aqua',
    textAlign: 'center',
    marginTop: '20px',
  },
  table: {
    width: '80%',
    marginTop: '30px',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    color: 'white',
    textAlign: 'left',
    marginTop: '20px',
  },
  th: {
    padding: '10px',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ProductManagement;