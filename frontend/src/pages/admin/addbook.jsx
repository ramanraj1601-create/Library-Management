import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import { FiBook, FiUser, FiImage, FiHash, FiDollarSign, FiPlusCircle, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./addbook.css";

const AddBookForm = () => {
  const [existingCategories, setExistingCategories] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Fetch existing categories for the datalist
    axios.get(Server_URL + "books")
      .then(res => {
        if (!res.data.error) {
          const cats = [...new Set(res.data.books.map(b => b.category))];
          setExistingCategories(cats);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "coverImage") {
          formData.append(key, data[key]);
        }
      });
  
      if (data.coverImage && data.coverImage[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }
  
      const authToken = localStorage.getItem("authToken");
      const url = Server_URL + "books/add";
  
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.error) {
        showErrorToast(response.data.message);
      } else {
        showSuccessToast(response.data.message);
        reset();
      }
      
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to add book!");
    }
  };

  return (
    <div className="admin-page-container">
      <div className="container">
        <motion.div 
          className="form-wrapper glass"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="form-header">
            <Link to="/admin" className="btn-back"><FiArrowLeft /> Back to Dashboard</Link>
            <h2><FiPlusCircle /> Add New Book</h2>
            <p>Fill in the details to expand the library collection.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="premium-form">
            <div className="form-grid">
              <div className="input-group-v2">
                <label><FiBook /> Book Title</label>
                <input
                  type="text"
                  placeholder="e.g. The Great Gatsby"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && <span className="error">{errors.title.message}</span>}
              </div>

              <div className="input-group-v2">
                <label><FiUser /> Author</label>
                <input
                  type="text"
                  placeholder="e.g. F. Scott Fitzgerald"
                  {...register("author", { required: "Author is required" })}
                />
                {errors.author && <span className="error">{errors.author.message}</span>}
              </div>

              <div className="input-group-v2">
                <label><FiHash /> Category</label>
                <input
                  list="category-options"
                  placeholder="Select or type new category"
                  {...register("category", { required: "Category is required" })}
                />
                <datalist id="category-options">
                  {existingCategories.map((cat, i) => (
                    <option key={i} value={cat} />
                  ))}
                </datalist>
                {errors.category && <span className="error">{errors.category.message}</span>}
              </div>

              <div className="input-group-v2">
                <label><FiHash /> ISBN Number</label>
                <input
                  type="text"
                  placeholder="e.g. 978-3-16-148410-0"
                  {...register("isbn", { required: "ISBN is required" })}
                />
                {errors.isbn && <span className="error">{errors.isbn.message}</span>}
              </div>

              <div className="input-group-v2">
                <label><FiPlusCircle /> Total Copies</label>
                <input 
                  type="number" 
                  {...register("totalCopies", { required: true, min: 1 })} 
                />
              </div>

              <div className="input-group-v2">
                <label><FiDollarSign /> Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  {...register("price", { required: true })} 
                />
              </div>

              <div className="input-group-v2 full-width">
                <label><FiImage /> Cover Image</label>
                <div className="file-input-wrapper">
                  <input type="file" {...register("coverImage")} id="cover-upload" />
                  <label htmlFor="cover-upload" className="file-label">
                    <FiImage /> Choose Image File
                  </label>
                </div>
              </div>

              <div className="input-group-v2 full-width">
                <label>Description</label>
                <textarea
                  rows="4"
                  placeholder="Tell us about the book..."
                  {...register("description", { required: "Description is required" })}
                ></textarea>
                {errors.description && <span className="error">{errors.description.message}</span>}
              </div>
            </div>

            <button type="submit" className="btn-premium w-100 mt-20">
              Complete Book Entry
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddBookForm;
