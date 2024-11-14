import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Home() {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedProducts, setSearchedProducts] = useState([]); // To store searched products
  const [loggedInUser, setLoggedInUser] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // New state for controlling images

  const navigate = useNavigate();

  // Array of images
  const images = [
    require('../assets/images/image1.jpeg'), // Adjusted to go up one directory
    require('../assets/images/image2.jpeg'),
    require('../assets/images/image3.jpeg'),
    require('../assets/images/image4.jpeg')
  ];

  // Function to change the background image at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  const styles = {
    container: { 
      minHeight: '600px',  // Adjust the height to be smaller
      width: '100%',       // Ensure it takes full width
      maxWidth: '1200px', // Optional: set a maximum width for larger screens
      margin: '0 auto',    // Optional: centers the container in larger screens
      padding: '20px',     // Add padding as necessary
      display: 'flex', 
      flexDirection: 'column',
      backgroundImage: `url(${images[currentImageIndex]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    header: { backgroundColor: 'black', color: 'aqua', padding: '20px', textAlign: 'center' },
    userSection: { position: 'absolute', right: '20px', top: '20px', color: 'aqua', fontSize: '24px' },
    content: { padding: '20px', textAlign: 'center', flexGrow: 1 },
    searchBar: { marginBottom: '20px' },
    searchInput: { padding: '10px', width: '300px' },
    searchButton: { padding: '10px', marginLeft: '5px' },
    marquee: { border: 'solid 5px red', backgroundColor: 'blue', borderRadius: '10px', padding: '10px', color: 'white' },
    footer: { backgroundColor: 'black', color: 'aqua', padding: '10px', textAlign: 'center', marginTop: 'auto' },
    nav: { backgroundColor: 'black', padding: '10px', textAlign: 'center' },
    link: {
      color: 'aqua',
      textDecoration: 'none',
      padding: '10px 20px',
      margin: '0 10px'
    },
    icon: { marginRight: '8px' },
    logoutButton: {
      color: 'aqua',
      padding: '10px 20px',
      margin: '0 10px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer'
    },
    table: {
      width: '80%',
      marginTop: '30px',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderCollapse: 'collapse'
    },
    th: {
      padding: '10px',
      border: '1px solid #ddd',
      backgroundColor: '#343a40',
      color: 'white'
    },
    td: {
      color: 'blue',
      padding: '10px',
      border: '1px solid #ddd',
      fontWeight: 'bold'
    },
    noProductsMessage: { color: 'red', fontSize: '16px', marginTop: '10px' }
  };

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => {
        setProductList(data);
      })
      .catch((error) => console.error('Error fetching products:', error));

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      navigate('/Home');
    } else {
      setLoggedInUser(loggedInUser);
    }
  }, [navigate]);

  const handleSearch = () => {
    const results = productList.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchedProducts(results);
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartData = {
    labels: productList.map((product) => product.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: productList.map((product) => product.quantity),
        backgroundColor: productList.map(() => generateRandomColor()),
      },
    ],
  };

  const chartOptions = {
    scales: {
        y: {
            grid: {
                color: 'blue', // Set the grid line color to white
            },
            ticks: {
                color: 'white', // Set the tick label color to white
            }
        },
        x: {
            grid: {
                color: 'blue', // Set the grid line color to white
            },
            ticks: {
                color: 'white', // Set the tick label color to white
            }
        },
    },
    plugins: {
        legend: {
            labels: {
                color: 'white', // Set legend label color to white (if you have a legend)
            },
        },
    },
};

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Dashboard - Wings Cafe Inventory System</h1>
        <div style={styles.userSection}>
          <i className="fas fa-user-circle"></i>
          <span>{loggedInUser}</span>
        </div>
      </header>

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

      <div style={styles.content}>
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search for a product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton}>Search</button>
        </div>

        <h2 style={{ color: 'blue', margin: '30px 0' }}>Overview of Current Stock Levels</h2>

        {/* Changed width and height for the Bar chart */}
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} width={600} height={200} />

        {/* Table for Available Products */}
        <h2 style={{ marginTop: '30px', color: 'blue' }}>Available Products</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr key={product.product_id}>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>{product.description}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>{product.price}</td>
                <td style={styles.td}>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Display searched product information below the table */}
        <div style={{ marginTop: '20px' }}>
          {searchedProducts.length > 0 && <h3 style={{ color: 'green' }}>Product(s) Found:</h3>}
          {searchedProducts.map((product) => (
            <p key={product.product_id}>
              Product available: <strong>{product.name}</strong>, Price: <strong>{product.price}</strong>, Quantity: <strong>{product.quantity}</strong>
            </p>
          ))}
          {searchTerm && searchedProducts.length === 0 && (
            <p style={{ color: 'red' }}>No products found for "{searchTerm}"</p>
          )}
        </div>

        {/* Total Quantity of All Products */}
        <h3 style={{ marginTop: '20px', color: 'blue' }}>
          Total Quantity of Available Products: {productList.reduce((total, product) => total + product.quantity, 0)}
        </h3>
      </div>

      <footer style={styles.footer}>
        © 2024 Wings Cafe Inventory System
      </footer>
    </div>
  );
}

export default Home;