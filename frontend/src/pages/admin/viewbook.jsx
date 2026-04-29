import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiBook, FiInfo, FiHash, FiTag, FiDollarSign } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import "./viewbook.css";

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    price: "",
    totalCopies: "",
    description: ""
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const url = Server_URL + "books";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setBooks(response.data.books || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`${Server_URL}books/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      showSuccessToast("Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      showErrorToast("Failed to delete book!");
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      price: book.price,
      totalCopies: book.totalCopies,
      description: book.description || ""
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${Server_URL}books/update/${selectedBook._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      showSuccessToast("Book updated successfully!");
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      showErrorToast("Failed to update book!");
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      <div className="admin-bg-glow"></div>
      
      <div className="container p-relative">
        <div className="admin-header-section">
          <div className="header-left">
            <h1 className="admin-title">Library Inventory</h1>
            <p className="admin-subtitle">Manage and update your library's collection.</p>
          </div>
          <button className="btn-premium" onClick={() => window.location.href = '/admin/addbook'}>
            <FiPlus /> Add New Book
          </button>
        </div>

        <div className="admin-controls-v2">
          <div className="search-box-v2">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title, author, or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <motion.div 
            className="book-grid-admin"
            layout
          >
            <AnimatePresence>
              {filteredBooks.map((book) => (
                <motion.div 
                  key={book._id}
                  className="book-card-admin glass"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="book-image-admin">
                    <img src={book.coverImage || "https://images.unsplash.com/photo-1543005128-d39eef402281?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"} alt={book.title} />
                    <div className="book-badge">{book.category}</div>
                  </div>
                  <div className="book-info-admin">
                    <h3>{book.title}</h3>
                    <p className="author-name">by {book.author}</p>
                    
                    <div className="book-stats-mini">
                      <span><FiHash /> {book.isbn}</span>
                      <span><FiDollarSign /> {book.price}</span>
                    </div>

                    <div className="action-buttons-admin">
                      <button className="btn-action edit" onClick={() => handleEdit(book)}>
                        <FiEdit /> Edit
                      </button>
                      <button className="btn-action delete" onClick={() => handleDelete(book._id)}>
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="empty-state">
            <FiBook size={60} />
            <h3>No books found</h3>
            <p>Try adjusting your search query.</p>
          </div>
        )}
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content-v2 glass"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
            >
              <div className="modal-header-v2">
                <h2>Edit Book Details</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <div className="modal-body-v2">
                <div className="form-grid-v2">
                  <div className="input-group-v3">
                    <label><FiInfo /> Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} />
                  </div>
                  <div className="input-group-v3">
                    <label><FiUser /> Author</label>
                    <input name="author" value={formData.author} onChange={handleChange} />
                  </div>
                  <div className="input-group-v3">
                    <label><FiTag /> Category</label>
                    <input name="category" value={formData.category} onChange={handleChange} />
                  </div>
                  <div className="input-group-v3">
                    <label><FiHash /> ISBN</label>
                    <input name="isbn" value={formData.isbn} onChange={handleChange} />
                  </div>
                  <div className="input-group-v3">
                    <label><FiDollarSign /> Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} />
                  </div>
                  <div className="input-group-v3">
                    <label><FiGrid /> Total Copies</label>
                    <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} />
                  </div>
                </div>
                <div className="input-group-v3 mt-20">
                  <label><FiBook /> Description</label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                </div>
              </div>
              <div className="modal-footer-v2">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-premium" onClick={handleUpdate}>Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewBooks;
