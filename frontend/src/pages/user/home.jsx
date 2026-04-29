import React, { useState, useEffect, useCallback } from "react";
import { Server_URL } from "../../utils/config";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiBook, FiArrowRight, FiUsers, FiLayers, FiCalendar, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import Preloader from "../../components/Preloader";
import "./home.css";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCategories: 0,
    totalActiveStudents: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(Server_URL + "home");
      if (!data.error) {
        setStats(data.stats || {
          totalBooks: 0,
          totalCategories: 0,
          totalActiveStudents: 0
        });
        setCategories(data.categories || []);
        setNewArrivals(data.newArrivals || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Preloader />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-v2">
        <div className="hero-bg-glow"></div>
        <div className="container hero-container">
          <motion.div 
            className="hero-text"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-premium">Next-Gen Library System</span>
            <h1>Knowledge is the <br /><span>Greatest Wealth</span></h1>
            <p>Access over 50,000+ academic resources, journals, and textbooks from anywhere in the world.</p>
            <div className="hero-actions">
              <Link to="/books" className="btn-premium">
                Explore Books <FiArrowRight />
              </Link>
              <Link to="/aboutus" className="btn-secondary-custom">
                Our Mission
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-image"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="floating-card c1 glass">
              <FiBook className="card-icon" />
              <span>Digital Archive</span>
            </div>
            <div className="floating-card c2 glass">
              <FiUsers className="card-icon" />
              <span>24/7 Access</span>
            </div>
            <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Library" className="hero-main-img" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-v2">
        <div className="container">
          <motion.div 
            className="stats-grid-v2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="stat-item-v2 glass" variants={itemVariants}>
              <div className="stat-icon-wrapper p1">
                <FiLayers />
              </div>
              <div className="stat-content">
                <h3>{stats?.totalCategories || 0}+</h3>
                <p>Categories</p>
              </div>
            </motion.div>

            <motion.div className="stat-item-v2 glass" variants={itemVariants}>
              <div className="stat-icon-wrapper p2">
                <FiBook />
              </div>
              <div className="stat-content">
                <h3>{stats?.totalBooks || 0}+</h3>
                <p>Total Books</p>
              </div>
            </motion.div>

            <motion.div className="stat-item-v2 glass" variants={itemVariants}>
              <div className="stat-icon-wrapper p3">
                <FiUsers />
              </div>
              <div className="stat-content">
                <h3>{stats?.totalActiveStudents || 0}+</h3>
                <p>Active Users</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="premium-title">Explore <span>Categories</span></h2>
            <Link to="/category" className="link-more">View All <FiArrowRight /></Link>
          </div>
          
          <motion.div 
            className="categories-grid-v2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((cat, index) => (
              <motion.div key={index} className="cat-card-v2" variants={itemVariants}>
                <div className="cat-img-wrapper">
                  <img src={cat.coverImage || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"} alt={cat.category} />
                  <div className="cat-overlay">
                    <Link to={`/books?category=${cat.category}`} className="btn-icon-v2"><FiArrowRight /></Link>
                  </div>
                </div>
                <div className="cat-info-v2">
                  <h3>{cat.category}</h3>
                  <span>{cat.count} Books Available</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-light-glow">
        <div className="container">
          <div className="section-header">
            <h2 className="premium-title">New <span>Arrivals</span></h2>
          </div>
          
          <motion.div 
            className="arrivals-grid-v2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newArrivals.map((book, index) => (
              <motion.div key={index} className="book-card-v2 glass" variants={itemVariants}>
                <div className="book-cover-v2">
                  <img src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"} alt={book.title} />
                  <div className="book-tag">Recent</div>
                </div>
                <div className="book-details-v2">
                  <span className="book-cat-v2">{book.category}</span>
                  <h3>{book.title}</h3>
                  <p>By {book.author}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Library Info */}
      <section className="section-padding">
        <div className="container">
          <div className="info-grid-v2">
            <motion.div 
              className="info-card-v2 glass"
              whileHover={{ y: -10 }}
            >
              <FiClock className="info-icon" />
              <h3>Operating Hours</h3>
              <div className="hours-list">
                <div className="hour-row"><span>Mon - Fri</span> <span>08:00 - 20:00</span></div>
                <div className="hour-row"><span>Saturday</span> <span>10:00 - 17:00</span></div>
                <div className="hour-row"><span>Sunday</span> <span className="closed">Closed</span></div>
              </div>
            </motion.div>

            <motion.div 
              className="info-card-v2 glass"
              whileHover={{ y: -10 }}
            >
              <FiCalendar className="info-icon" />
              <h3>Special Periods</h3>
              <p>During exam seasons, the library is open 24/7 for all students with valid ID cards.</p>
              <button className="btn-link-v2">View Schedule <FiArrowRight /></button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}