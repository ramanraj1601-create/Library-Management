import React, { useState, useEffect } from "react";
import { Server_URL } from "../../utils/config";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiGrid, FiArrowRight, FiBook, FiLayers, FiSearch } from "react-icons/fi";
import { showErrorToast } from "../../utils/toasthelper";
import "./allcategories.css";

export default function ViewAllCategories() {
  const [books, setBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      const url = Server_URL + "books";
      const response = await axios.get(url);
      const { error, message, books } = response.data;

      if (error) {
        showErrorToast(message);
      } else {
        setBooks(books);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showErrorToast("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categories = ["All", ...new Set(books.map((book) => book.category))];
  
  const categoryStats = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});

  const displayedCategories = categories.filter(cat => 
    cat === "All" || cat.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(cat => cat !== "All");

  return (
    <div className="categories-page-container">
      <div className="page-bg-overlay"></div>
      
      <div className="container p-relative">
        <div className="category-header-v2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="premium-title">Explore Library<span>.</span></h1>
            <p className="premium-subtitle">Discover vast collections across all academic disciplines.</p>
          </motion.div>

          <div className="search-bar-v3">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="category-layout-v2">
          {/* Main Grid */}
          <div className="category-main-grid">
            {loading ? (
              <div className="loader-v3">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            ) : (
              <motion.div 
                className="category-grid-v2"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {displayedCategories.map((category, index) => {
                    const sampleBook = books.find(b => b.category === category);
                    return (
                      <motion.div 
                        key={category}
                        className="category-card-v2 glass"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -10 }}
                      >
                        <div className="cat-image-box">
                          <img 
                            src={sampleBook?.coverImage || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80"} 
                            alt={category} 
                          />
                          <div className="cat-overlay"></div>
                        </div>
                        <div className="cat-content-box">
                          <div className="cat-icon-tag"><FiLayers /></div>
                          <h3>{category}</h3>
                          <p>{categoryStats[category]} Available Books</p>
                          <Link to={`/books?category=${category}`} className="cat-explore-btn">
                            Explore Collection <FiArrowRight />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && displayedCategories.length === 0 && (
              <div className="empty-category">
                <FiSearch size={50} />
                <h3>No categories found</h3>
                <p>Try searching for something else.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
