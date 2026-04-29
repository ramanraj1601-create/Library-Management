import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiBook, FiUser, FiLogOut, FiMenu, FiX, FiSearch } from "react-icons/fi";
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const role = localStorage.getItem("role");

  return (
    <nav className={`main-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-content">
        <Link className="nav-logo" to="/">
          <div className="logo-icon">
            <FiBook />
          </div>
          <span className="logo-text">AGC<span>Library</span></span>
        </Link>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
          <Link to="/books" className={isActive("/books") ? "active" : ""}>Books</Link>
          <Link to="/category" className={isActive("/category") ? "active" : ""}>Categories</Link>
          {(role === "admin" || role === "librarian") && (
            <Link to="/admin" className={isActive("/admin") ? "active" : ""}>Admin Panel</Link>
          )}
          <Link to="/aboutus" className={isActive("/aboutus") ? "active" : ""}>About</Link>

          <Link to="/contactus" className={isActive("/contactus") ? "active" : ""}>Contact</Link>
          
          <div className="mobile-only auth-mobile">
            {token ? (
              <button onClick={handleLogout} className="btn-logout-mobile">
                <FiLogOut /> Logout
              </button>
            ) : (
              <Link to="/login" className="btn-login-mobile">Login</Link>
            )}
          </div>
        </div>

        <div className="nav-actions">
          <button className="search-trigger">
            <FiSearch />
          </button>
          
          {token ? (
            <div className="profile-dropdown-container">
              <Link to="/user" className="profile-trigger">
                <div className="avatar-small">
                  <FiUser />
                </div>
              </Link>
              <div className="dropdown-panel glass">
                <Link to="/user">My Profile</Link>
                <button onClick={handleLogout} className="logout-item">
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-desktop">
              <Link to="/login" className="nav-login-link">Login</Link>
              <Link to="/register" className="btn-premium signup-btn">Sign Up</Link>
            </div>
          )}

          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}