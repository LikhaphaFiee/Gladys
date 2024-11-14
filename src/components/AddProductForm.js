import React, { useState } from 'react';

function AddProductForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState(''); // State for success/error messages

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:5000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity, price }),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Product added successfully!');
          setName('');
          setQuantity('');
          setPrice('');
        } else {
          setMessage('Failed to add product.');
        }
      })
      .catch(error => {
        console.error('Error adding product:', error);
        setMessage('An error occurred while adding the product.');
      });
  };

  return (
    <div>
      <h2>Add New Product</h2>
      {message && <p>{message}</p>} {/* Display success/error message */}
      <form onSubmit={handleSubmit}>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Product Name" 
          required 
        />
        <input 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          type="number" 
          placeholder="Quantity" 
          required 
        />
        <input 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          type="number" 
          placeholder="Price" 
          required 
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProductForm;
