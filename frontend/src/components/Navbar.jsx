// ============================================
// Navbar.jsx — Top navigation bar
// ============================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ darkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-lg transition-colors duration-200">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setSearchQuery("")}>
        <span className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-500 tracking-tight hover:text-red-500 dark:hover:text-red-400 transition-colors">
          🎬 YouTube Clone
        </span>
      </Link>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-full max-w-md mx-4 border border-gray-300 dark:border-gray-700 focus-within:border-gray-400 dark:focus-within:border-gray-500 transition-colors"
      >
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-900 dark:text-gray-200 w-full placeholder-gray-500"
        />
        <button type="submit" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-2 transition-colors">
          🔍
        </button>
      </form>

      {/* Right side buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Upload button */}
        <Link
          to="/upload"
          className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium px-4 py-2 rounded-full transition-colors border border-gray-200 dark:border-gray-700"
        >
          <span>➕</span>
          <span className="hidden md:inline">Upload</span>
        </Link>

        {/* Sign In button */}
        <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
          Sign In
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
