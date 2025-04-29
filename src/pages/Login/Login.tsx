import { useState } from "react";
import background from "../../assets/backgr1.jpeg"; // Import ảnh nền

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

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
            <form>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="email"
                  id="email"
                  defaultValue="Peiuthanhlong@gmail.com"
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
                  defaultValue="******************"
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
                <a href="#" className="text-sm text-pink-500">
                  Forgot Password?
                </a>
              </div>
              <button className="w-full bg-pink-500 text-white py-2 rounded-lg font-bold hover:bg-pink-600 transition duration-300">
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
            <form>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="name">
                  Your Name
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
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
                  placeholder="Confirm your password"
                />
                <i className="fas fa-eye absolute right-3 top-10 text-gray-500"></i>
              </div>
              <button className="w-full bg-pink-500 text-white py-2 rounded-lg font-bold hover:bg-pink-600 transition duration-300">
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
    </div>
  );
};

export default Login;
