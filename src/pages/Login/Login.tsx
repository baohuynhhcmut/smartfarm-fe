import { useState } from "react";
import background from "../../assets/backgr1.jpeg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "Peiuthanhlong@gmail.com",
    password: "******************",
    name: "",
    phone_number: "",
    street: "",
    city: "",
    state: "",
    latitude: 0,
    longitude: 0,
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:8081/api/v1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Login failed with status: " + response.status);
      }
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid response from server");
      }
  
      const data = await response.json();
  
      if (!data.token) {
        throw new Error("No authentication token received");
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else if (data.user.role === "USER") {
        navigate("/user");
      } else {
        throw new Error("Unknown user role");
      }
  
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
      console.error("Login error:", err);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone_number: formData.phone_number,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          latitude: formData.latitude,
          longitude: formData.longitude
        })
      });
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid registration response");
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
  
      setIsLogin(true);
      setError("");
      alert("Registration successful! Please log in.");
  
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration");
      console.error("Registration error:", err);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/user/forgetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotPasswordEmail
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Forgot password request failed");
      }

      const data = await response.json();
      
      if (data.status === 200) {
        setForgotPasswordSuccess(true);
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.message || "Failed to process forgot password request");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during password reset");
      console.error("Forgot password error:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-black">
        <h1 className="text-4xl font-bold mb-4">Building eco-system 🌏</h1>
        <p className="text-lg">
          We're here to help you automate your garden, ensuring continuous
          growth while maximizing efficiency and economic benefits.
        </p>
      </div>

      {/* Phần container Login/Signup màu trắng */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mr-10">
        {isLogin ? (
          <>
            <h2 className="text-gray-600 text-sm">WELCOME BACK</h2>
            <h1 className="text-2xl font-bold mb-6">Log In to your Account</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="text"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <i className="fas fa-eye absolute right-3 top-10 text-gray-500"></i>
              </div>
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="form-checkbox text-pink-500 mr-2"
                  />
                  Remember me
                </label>
                <a 
                  href="#" 
                  className="text-sm text-pink-500"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                    setError("");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <button 
                type="submit"
                className="w-full bg-pink-500 text-white py-2 rounded-lg font-bold hover:bg-pink-600 transition duration-300"
              >
                CONTINUE
              </button>
            </form>
            <p className="text-center text-sm text-gray-700 mt-6">
              New User?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-pink-500 font-bold"
              >
                SIGN UP HERE
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-gray-600 text-sm">CREATE ACCOUNT</h2>
            <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="name">
                  Your Name
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="text"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="phone_number">
                  Phone Number
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="text"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <i className="fas fa-eye absolute right-3 top-10 text-gray-500"></i>
              </div>
              <div className="mb-4 relative">
                <label
                  className="block text-gray-700"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <i className="fas fa-eye absolute right-3 top-10 text-gray-500"></i>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="street">
                  Street
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="text"
                  id="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="city">
                  City
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="state">
                  State
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-pink-500 text-white py-2 rounded-lg font-bold hover:bg-pink-600 transition duration-300"
              >
                SIGN UP
              </button>
            </form>
            <p className="text-center text-sm text-gray-700 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-pink-500 font-bold"
              >
                LOG IN HERE
              </button>
            </p>
          </>
        )}
      </div>

      {/* Forgot Password Modal với hiệu ứng blur */}
      {showForgotPassword && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            {forgotPasswordSuccess ? (
              <div className="text-green-500 mb-4">
                Password reset email sent successfully! Please check your email.
              </div>
            ) : (
              <>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError("");
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;