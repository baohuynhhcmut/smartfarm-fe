import { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('admin1');
  const [password, setPassword] = useState('123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

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
      setFormData({
        name: data.user.name,
        phone_number: data.user.phone_number,
        address: {
          street: data.user.address.street,
          city: data.user.address.city,
          state: data.user.address.state,
          country: data.user.address.country
        }
      });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUserInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/user/updateUserInfo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user info');
      }

      const data = await response.json();
      setUser(data.data);
      setEditMode(false);
      setSuccessMessage('User information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/user/updatePassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      const data = await response.json();
      setEditPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccessMessage('Password updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
          </div>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {user && (
            <div className="profile-details">
              <div className="profile-section">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  {!editMode ? (
                    <button onClick={() => setEditMode(true)} className="edit-button">
                      Edit
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button onClick={handleUpdateUserInfo} className="save-button">
                        Save
                      </button>
                      <button onClick={() => setEditMode(false)} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {editMode ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="text"
                        value={user.email}
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label>Role:</label>
                      <input
                        type="text"
                        value={user.role}
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number:</label>
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className="profile-section">
                <div className="section-header">
                  <h2>Address</h2>
                </div>
                {editMode ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Street:</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>City/District:</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>State/Province:</label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Country:</label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className="profile-section">
                <div className="section-header">
                  <h2>Change Password</h2>
                  {!editPasswordMode ? (
                    <button onClick={() => setEditPasswordMode(true)} className="edit-button">
                      Change Password
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button onClick={handleUpdatePassword} className="save-button">
                        Save
                      </button>
                      <button onClick={() => setEditPasswordMode(false)} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {editPasswordMode && (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Current Password:</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password:</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password:</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                )}
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

  .success-message {
    background-color: #4caf50;
    color: white;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
    text-align: center;
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

  .profile-section {
    background: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .profile-section h2 {
    margin-top: 0;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    font-weight: bold;
  }

  .detail-row {
    display: flex;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .detail-label {
    font-weight: bold;
    width: 150px;
    color: #555;
  }

  .detail-value {
    flex: 1;
  }

  .edit-button, .save-button, .cancel-button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .edit-button {
    background-color: #2196F3;
    color: white;
  }

  .edit-button:hover {
    background-color: #0b7dda;
  }

  .save-button {
    background-color: #4CAF50;
    color: white;
    margin-right: 8px;
  }

  .save-button:hover {
    background-color: #45a049;
  }

  .cancel-button {
    background-color: #f44336;
    color: white;
  }

  .cancel-button:hover {
    background-color: #d32f2f;
  }

  .edit-actions {
    display: flex;
  }

  .edit-form .form-group {
    margin-bottom: 15px;
  }

  .edit-form .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .edit-form .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
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