import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Server_URL } from "../../utils/config";
import { FiGrid, FiUsers, FiBook, FiPlusCircle, FiActivity, FiArrowRight, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [user, setUser] = useState([]);
  const [lib, setLib] = useState([]);
  const [books, setBooks] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [totalLib, setTotalLib] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [occupancyPercent, setOccupancyPercent] = useState(0);
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"] }],
  });

  const role = localStorage.getItem("role");

  async function fetchData() {
    try {
      const [usersRes, booksRes, latestRes] = await Promise.all([
        axios.get(Server_URL + "users"),
        axios.get(Server_URL + "books"),
        axios.get(Server_URL + "books/new")
      ]);

      if (!usersRes.data.error) {
        const students = usersRes.data.user.filter((u) => u.role === "user");
        const librarians = usersRes.data.user.filter((u) => u.role === "librarian");
        setUser(students);
        setLib(librarians);
        setTotalUser(students.length);
        setTotalLib(librarians.length);
      }

      if (!booksRes.data.error) {
        const { books } = booksRes.data;
        setBooks(books);
        setTotalBooks(booksRes.data.totalBooks);

        const categoryCount = books.reduce((acc, book) => {
          acc[book.category] = (acc[book.category] || 0) + 1;
          return acc;
        }, {});

        setCategoryData({
          labels: Object.keys(categoryCount),
          datasets: [{ data: Object.values(categoryCount), backgroundColor: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"] }],
        });

        const borrowed = books.reduce((acc, book) => acc + (book.totalCopies - book.availableCopies), 0);
        setBorrowedBooks(borrowed);

        const total = books.reduce((acc, book) => acc + book.totalCopies, 0);
        setOccupancyPercent(total ? Math.round((borrowed / total) * 100) : 0);
      }

      if (!latestRes.data.error) {
        setLatestBooks(latestRes.data.books);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="admin-layout-v2">
      <div className="admin-container-v2">
        {/* Sidebar */}
        <aside className="admin-sidebar-v2 glass">
          <div className="sidebar-header-v2">
            <FiShield className="shield-icon" />
            <div>
              <h3>AdminPanel</h3>
              <span>{role === 'admin' ? 'Administrator' : 'Librarian'}</span>
            </div>
          </div>

          <div className="sidebar-menu-v2">
            <button 
              className={selectedSection === "dashboard" ? "active" : ""} 
              onClick={() => setSelectedSection("dashboard")}
            >
              <FiGrid /> Dashboard
            </button>
            <button 
              className={selectedSection === "users" ? "active" : ""} 
              onClick={() => setSelectedSection("users")}
            >
              <FiUsers /> Students
            </button>
            <button 
              className={selectedSection === "librarians" ? "active" : ""} 
              onClick={() => setSelectedSection("librarians")}
            >
              <FiShield /> Librarians
            </button>
            <button 
              className={selectedSection === "books" ? "active" : ""} 
              onClick={() => setSelectedSection("books")}
            >
              <FiBook /> Inventory
            </button>
          </div>

          <div className="sidebar-actions-v2">
            <Link to="/admin/addbook" className="btn-add-action">
              <FiPlusCircle /> Add New Book
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-content-v2">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {selectedSection === "dashboard" && (
              <>
                <header className="content-header-v2">
                  <h2>Dashboard Overview</h2>
                  <p>Real-time analytics and library statistics.</p>
                </header>

                <div className="admin-stats-grid-v2">
                  <motion.div className="admin-stat-card-v2 glass" variants={itemVariants}>
                    <div className="stat-icon-v2 s1"><FiBook /></div>
                    <div className="stat-info-v2">
                      <p>Total Books</p>
                      <h3>{totalBooks}</h3>
                    </div>
                  </motion.div>
                  <motion.div className="admin-stat-card-v2 glass" variants={itemVariants}>
                    <div className="stat-icon-v2 s2"><FiUsers /></div>
                    <div className="stat-info-v2">
                      <p>Active Students</p>
                      <h3>{totalUser}</h3>
                    </div>
                  </motion.div>
                  <motion.div className="admin-stat-card-v2 glass" variants={itemVariants}>
                    <div className="stat-icon-v2 s3"><FiActivity /></div>
                    <div className="stat-info-v2">
                      <p>Borrowed Books</p>
                      <h3>{borrowedBooks}</h3>
                    </div>
                  </motion.div>
                </div>

                <div className="admin-charts-grid-v2">
                  <motion.div className="admin-chart-card-v2 glass" variants={itemVariants}>
                    <h3>Category Distribution</h3>
                    <div className="chart-wrapper-v2">
                      <Pie data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                  </motion.div>

                  <motion.div className="admin-activity-card-v2 glass" variants={itemVariants}>
                    <h3>Recent Book Additions</h3>
                    <div className="activity-list-v2">
                      {latestBooks.slice(0, 5).map((book, i) => (
                        <div key={i} className="activity-item-v2">
                          <img src={book.coverImage || "https://via.placeholder.com/40"} alt="" />
                          <div className="activity-details-v2">
                            <strong>{book.title}</strong>
                            <span>{book.category} • {new Date(book.createdAt).toLocaleDateString()}</span>
                          </div>
                          <FiArrowRight />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </>
            )}

            {selectedSection !== "dashboard" && (
              <motion.div className="admin-table-wrapper-v2 glass" variants={itemVariants}>
                <div className="table-header-v2">
                  <h2>{selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Management</h2>
                </div>
                <div className="table-responsive">
                  <table className="premium-table">
                    {selectedSection === "users" && (
                      <>
                        <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Stream</th></tr></thead>
                        <tbody>{user.map((u, i) => <tr key={i}><td>{i+1}</td><td>{u.name}</td><td>{u.email}</td><td>{u.stream}</td></tr>)}</tbody>
                      </>
                    )}
                    {selectedSection === "librarians" && (
                      <>
                        <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                        <tbody>{lib.map((l, i) => <tr key={i}><td>{i+1}</td><td>{l.name}</td><td>{l.email}</td><td>{l.role}</td></tr>)}</tbody>
                      </>
                    )}
                    {selectedSection === "books" && (
                      <>
                        <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Category</th><th>Available</th></tr></thead>
                        <tbody>{books.map((b, i) => <tr key={i}><td>{i+1}</td><td>{b.title}</td><td>{b.author}</td><td>{b.category}</td><td>{b.availableCopies}/{b.totalCopies}</td></tr>)}</tbody>
                      </>
                    )}
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
