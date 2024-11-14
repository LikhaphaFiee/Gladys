import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home'; // Import the Home component
import Lock from './components/Lock';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';


function App() {
  return (
    <Router>
      <div className="App">
        
        {/* Navigation Links */}
        <nav>
        <Routes>
          <Route path="/" element={<Lock />} /> {/* Home route */}
          <Route path="/Home" element={<Home />} />
          <Route path="/ProductManagement" element={<ProductManagement />} />
          
          <Route path="/UserManagement" element={<UserManagement />} />
          
          
        </Routes>
          
    
        </nav>

        {/* Define Routes */}
        
      </div>
    </Router>
  );
}

export default App;
