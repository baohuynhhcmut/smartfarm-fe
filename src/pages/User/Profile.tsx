

import  { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('admin1');
  const [password, setPassword] = useState('123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const BASE_URL = 'http://localhost:8081/api/v1';

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      fetchUserData(data.token);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/user/getByToken`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      {!isLoggedIn ? (
        <div className="login-form">
          <h2>Login</h2>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="profile-content">
          <div className="profile-header">
            <h1>User Profile</h1>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>

          {user && (
            <div className="profile-details">
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{user.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{user.role}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone Number:</span>
                  <span className="detail-value">{user.phone_number}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="profile-section">
                <h2>Address</h2>
                <div className="detail-row">
                  <span className="detail-label">Street:</span>
                  <span className="detail-value">{user.address.street}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">City/District:</span>
                  <span className="detail-value">{user.address.city}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">State/Province:</span>
                  <span className="detail-value">{user.address.state}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Country:</span>
                  <span className="detail-value">{user.address.country}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Coordinates:</span>
                  <span className="detail-value">
                    {user.address.latitude}, {user.address.longitude}
                  </span>
                </div>
              </div>

              <div className="profile-section">
                <h2>Gardens</h2>
                {user.gardens && user.gardens.length > 0 ? (
                  <ul className="garden-list">
                    {user.gardens.map((garden) => (
                      <li key={garden._id}>{garden.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No gardens associated with this account.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

// CSS Styles
const styles = `
  .profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .loading, .error {
    text-align: center;
    padding: 20px;
    font-size: 18px;
  }

  .error {
    color: #d32f2f;
  }

  .login-form {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    margin: 50px auto;
  }

  .login-form h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .login-form button {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .login-form button:hover {
    background-color: #45a049;
  }

  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    font-size: 38px;
    font-weight: bold;
  }

  .logout-button {
    padding: 8px 15px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 15px;
  }

  .logout-button:hover {
    background-color: #d32f2f;
  }

  .profile-section {
    background: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .profile-section h2 {
    margin-top: 0;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    font-weight:bold;
  }

  .detail-row {
    display: flex;
    margin-bottom: 10px;
    margin-top:10px;
  }

  .detail-label {
    font-weight: bold;
    width: 150px;
    color: #555;
  }

  .detail-value {
    flex: 1;
  }

  .garden-list {
    list-style-type: none;
    padding: 10px;
    padding-top: 10px;
  }

  .garden-list li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    padding-top: 10px;
  }

  .garden-list li:last-child {
    border-bottom: none;
    padding-top: 20px;
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
