import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]); // State for users
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState({
    user_id: null,  // Changed from id to user_id
    username: '',
    password: '',
  });

  // Fetch users from the backend
  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((data) => setUsers(data)) // Using setUsers here
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { user_id, username, password } = userForm;

    if (user_id !== null) {
      // Update user in backend via PUT request
      fetch(`http://localhost:5000/users/${user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then(() => {
          // Update user locally
          const updatedUsers = users.map((user) =>
            user.user_id === user_id ? { ...userForm } : user // Use user_id here
          );
          setUsers(updatedUsers); // Update users state
        })
        .catch((err) => console.error('Error updating user:', err));
    } else {
      // Add new user to backend via POST request
      fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, { user_id: data.user_id, username, password }]); // Use user_id here
        })
        .catch((err) => console.error('Error adding user:', err));
    }

    // Reset form
    setUserForm({
      user_id: null,  // Reset to null for new user
      username: '',
      password: '',
    });
  };

  const editUser = (user_id) => {
    const user = users.find((user) => user.user_id === user_id); // Use user_id here
    setUserForm({
      user_id: user.user_id,  // Use user_id here
      username: user.username,
      password: user.password,
    });
  };

  const deleteUser = (user_id) => { // Use user_id instead of id
    if (!user_id) {
      console.error('Invalid user_id:', user_id);
      return; // Prevent further processing if user_id is invalid
    }

    console.log('Deleting user with ID:', user_id);

    fetch(`http://localhost:5000/users/${user_id}`, { // Use user_id here in URL
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(users.filter((user) => user.user_id !== user_id)); // Use user_id in filter
        } else {
          console.error('Failed to delete user:', data.message);
        }
      })
      .catch((err) => console.error('Error deleting user:', err));
  };

  // Navbar styles
  const styles = {
  
    form: { padding: '5px', backgroundColor: '#f0f8ff', marginTop: '30px' },
    input: { padding: '2px', margin: '5px', width: '100%',marginLeft: 'auto',marginRight: 'auto' },
    submitButton: { padding: '5px', backgroundColor: '#2980B9', color: '#fff', border: 'none' },
    table: { width: '100%', marginTop: '30px', borderCollapse: 'collapse' },
    th: { padding: '10px', textAlign: 'center', backgroundColor: '#2980B9', color: 'white' },
    td: { padding: '10px', borderBottom: '1px solid #ddd' },
    actions: { display: 'flex', gap: '10px' },
    editButton: { padding: '6px 12px', backgroundColor: '#f39c12', color: 'white', border: 'none', cursor: 'pointer' },
    deleteButton: { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' },
    header: { backgroundColor: 'black', color: 'aqua', padding: '20px', textAlign: 'center' },

    nav: { backgroundColor: 'black', padding: '10px', textAlign: 'center' },
  link: { 
    color: 'aqua', 
    textDecoration: 'none', 
    padding: '10px 20px', 
    margin: '0 10px' 
  },
  activeLink: {
    backgroundColor: '#2980B9', // Set the active background color
    color: 'white', // Change text color if needed
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
    borderCollapse: 'collapse',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    navigate('/');
  };

  return (
    <div>
      <header style={styles.header}>
       <h1>User Management - Wings Cafe Inventory System</h1>
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

      <form onSubmit={handleFormSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          value={userForm.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          value={userForm.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          {userForm.user_id !== null ? 'Update User' : 'Add User'}  {/* Use user_id here */}
        </button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Password</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>  {/* Use user.user_id as the key */}
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>{user.password}</td>
              <td style={styles.actions}>
                <button style={styles.editButton} onClick={() => editUser(user.user_id)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button style={styles.deleteButton} onClick={() => deleteUser(user.user_id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
