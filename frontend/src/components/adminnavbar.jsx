import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiArrowRight, FiBook, FiGrid, FiPlusCircle, FiList, FiCheckSquare, FiLogOut, FiMenu, FiX, FiShield, FiUser } from "react-icons/fi";
import "./adminnavbar.css";

export default function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
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
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`admin-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-content">
        <Link className="nav-logo" to="/admin">
          <div className="logo-icon admin">
            <FiShield />
          </div>
          <span className="logo-text">Admin<span>Panel</span></span>
        </Link>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
            <FiGrid /> Dashboard
          </Link>
          <Link to="/admin/viewbook" className={isActive("/admin/viewbook") ? "active" : ""}>
            <FiList /> Manage Books
          </Link>
          <Link to="/admin/addbook" className={isActive("/admin/addbook") ? "active" : ""}>
            <FiPlusCircle /> Add Book
          </Link>
          
          {role === "librarian" && (
            <>
              <Link to="/admin/issuerequest" className={isActive("/admin/issuerequest") ? "active" : ""}>
                <FiCheckSquare /> Issue Requests
              </Link>
              <Link to="/admin/returnrequest" className={isActive("/admin/returnrequest") ? "active" : ""}>
                <FiArrowRight /> Returns
              </Link>
            </>
          )}

          <Link to="/admin/issued" className={isActive("/admin/issued") ? "active" : ""}>
            <FiBook /> Borrowed
          </Link>

          {role === "admin" && (
            <Link to="/admin/addlibrarian" className={isActive("/admin/addlibrarian") ? "active" : ""}>
              <FiUser /> Add Librarian
            </Link>
          )}

          <div className="mobile-only auth-mobile">
            <button onClick={handleLogout} className="btn-logout-mobile">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <div className="nav-actions">
          <div className="admin-profile-dropdown">
            <button className="profile-btn glass">
              <FiUser /> <span>{role}</span>
            </button>
            <div className="dropdown-menu-v3">
              <Link to="/admin"><FiGrid /> Dashboard</Link>
              <button onClick={handleLogout} className="text-danger">
                <FiLogOut /> Logout
              </button>
            </div>
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
