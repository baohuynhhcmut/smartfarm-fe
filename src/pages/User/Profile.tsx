import { useState, useEffect } from 'react';

const Profile = () => {
  // State management
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
    phone_number: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const BASE_URL = 'http://localhost:8081/api/v1';

  // API handlers
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
        phone_number: data.user.phone_number
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Effect hooks
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        body: JSON.stringify({
          email: user.email,
          name: formData.name,
          phone_number: formData.phone_number
        }),
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
          email: user.email,
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || 'Failed to update password');
        setShowPasswordError(true);
        throw new Error(data.message || 'Failed to update password');
      }

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
      setLoading(false);
    }
  };

  // Render loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen py-8">
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
            </div>

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {successMessage}
              </div>
            )}

            {/* Password Error Popup */}
            {showPasswordError && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h3 className="text-lg font-bold text-red-600 mb-4">Password Error</h3>
                  <p className="text-gray-700 mb-4">{passwordError}</p>
                  <div className="flex justify-end">
                    <button
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md"
                      onClick={() => setShowPasswordError(false)}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {user && (
              <div className="space-y-8">
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                    {!editMode ? (
                      <button
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                          onClick={handleUpdateUserInfo}
                        >
                          Save
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
                          type="text"
                          value={user.email}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Name</p>
                        <p className="text-gray-900 font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="text-gray-900 font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Role</p>
                        <p className="text-gray-900 font-medium">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Phone Number</p>
                        <p className="text-gray-900 font-medium">{user.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Member Since</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Address</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Street</p>
                      <p className="text-gray-900 font-medium">{user.address.street}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">City/District</p>
                      <p className="text-gray-900 font-medium">{user.address.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">State/Province</p>
                      <p className="text-gray-900 font-medium">{user.address.state}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Country</p>
                      <p className="text-gray-900 font-medium">{user.address.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Coordinates</p>
                      <p className="text-gray-900 font-medium">
                        {user.address.latitude}, {user.address.longitude}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                    {!editPasswordMode ? (
                      <button
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        onClick={() => setEditPasswordMode(true)}
                      >
                        Change Password
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                          onClick={handleUpdatePassword}
                        >
                          Save
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => {
                            setEditPasswordMode(false);
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {editPasswordMode && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Current Password:</label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password:</label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Gardens Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Gardens</h2>
                  {user.gardens && user.gardens.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {user.gardens.map((garden) => (
                        <li key={garden._id} className="py-3">
                          <p className="text-gray-900 font-medium">{garden.name}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No gardens associated with this account.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;