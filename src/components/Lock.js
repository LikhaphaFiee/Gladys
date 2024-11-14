import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import wingsLogo from '../components/wings.png'; // Path for logo


function Lock() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To show error messages
  const navigate = useNavigate();

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Login successful!...Welcome back ' + username);
        navigate('/Home');
      } else {
        setError(result.message || 'Invalid credentials! Please try again.');
      }
    } catch (err) {
      setError('Error during login. Please try again.');
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Sign up successful! You can now log in.');
        toggleAuth();
      } else {
        setError(result.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Error during signup. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Navigation bar */}
      <nav style={styles.navbar}>
        <h1 id="main-header" style={styles.navHeading}>Wings Cafe - Login </h1>
      </nav>

      <div className="container" id="auth-container" style={styles.formContainer}>
        {/* Logo */}
        <img src={wingsLogo} alt="Wings Logo" style={styles.logo} />
        
        <h2 id="auth-header" style={styles.formHeader}>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <br />
          
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        <div className="switch" onClick={toggleAuth} style={styles.switch}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Wings Cafe. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// Internal CSS styles object
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto',
    
  },
  navbar: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark transparent navbar
    padding: '15px',
    textAlign: 'center',
    zIndex: 1, 
  },
  navHeading: {
    color: 'lightblue',
    fontSize: '24px',
    margin: 0,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    width: '350px',
    margin: 'auto',
  },
  logo: {
    width: '120px',
    marginBottom: '20px',
  },
  formHeader: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#ff6600', 
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px', 
    marginTop: '10px',
    width: '100%',
  },
  switch: {
    marginTop: '20px',
    color: '#007bff',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark footer background
    color: 'white',
    textAlign: 'center',
    padding: '10px 0',
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default Lock;
