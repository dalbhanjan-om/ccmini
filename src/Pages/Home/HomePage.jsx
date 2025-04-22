import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-3xl font-bold text-orange-500 tracking-wide hover:text-orange-600 transition"
          >
            🍽 FoodDelight
          </Link>
          <div className="flex items-center gap-6 text-sm sm:text-base font-medium">
            <Link
              to="/restaurants"
              className="text-gray-700 hover:text-orange-500 transition"
            >
              Browse Restaurants
            </Link>
            <Link
              to="/login"
              className="text-orange-500 border border-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="flex-grow bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="bg-black bg-opacity-70 p-10 rounded-2xl max-w-3xl text-center mx-6 shadow-2xl backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Savor Every Bite.
          </h1>
          <p className="text-lg md:text-xl mb-8 text-orange-100">
            Delicious dishes from your favorite restaurants delivered hot and fresh. Discover the joy of good food!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
