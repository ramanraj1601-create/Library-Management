import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import { FiUser, FiMail, FiLock, FiBookOpen, FiCalendar, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./register.css";

export default function Register() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${Server_URL}users/register`, data);
      showSuccessToast("Registration Successful!");
      reset();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || "Registration Failed!");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-bg-glow"></div>
      <div className="container">
        <motion.div 
          className="auth-wrapper glass"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <div className="auth-logo">
              <FiBookOpen />
            </div>
            <h2>Create Account</h2>
            <p>Join the AGC Library community today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="premium-form">
            <div className="form-grid-v2">
              <div className="input-group-v3">
                <label><FiUser /> Full Name</label>
                <div className="input-wrapper-v3">
                  <FiUser className="input-icon" />
                  <input type="text" placeholder="John Doe" {...register("name", { required: "Name is required" })} />
                </div>
                {errors.name && <span className="error-v3">{errors.name.message}</span>}
              </div>

              <div className="input-group-v3">
                <label><FiMail /> Email Address</label>
                <div className="input-wrapper-v3">
                  <FiMail className="input-icon" />
                  <input type="email" placeholder="john@example.com" {...register("email", { required: "Email is required" })} />
                </div>
                {errors.email && <span className="error-v3">{errors.email.message}</span>}
              </div>

              <div className="input-group-v3">
                <label><FiLock /> Password</label>
                <div className="input-wrapper-v3">
                  <FiLock className="input-icon" />
                  <input type="password" placeholder="••••••••" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} />
                </div>
                {errors.password && <span className="error-v3">{errors.password.message}</span>}
              </div>

              <div className="input-group-v3">
                <label><FiShield /> Select Role</label>
                <div className="input-wrapper-v3">
                  <FiShield className="input-icon" />
                  <select {...register("role", { required: "Role is required" })}>
                    <option value="user">Student / User</option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                {errors.role && <span className="error-v3">{errors.role.message}</span>}
              </div>

              <div className="input-group-v3">
                <label><FiBookOpen /> Academic Stream</label>
                <div className="input-wrapper-v3">
                  <FiBookOpen className="input-icon" />
                  <input type="text" placeholder="e.g. Computer Science" {...register("stream", { required: "Stream is required" })} />
                </div>
                {errors.stream && <span className="error-v3">{errors.stream.message}</span>}
              </div>

              <div className="input-group-v3">
                <label><FiCalendar /> Joining Year</label>
                <div className="input-wrapper-v3">
                  <FiCalendar className="input-icon" />
                  <input type="number" placeholder="2024" {...register("year", { required: "Year is required" })} />
                </div>
                {errors.year && <span className="error-v3">{errors.year.message}</span>}
              </div>
            </div>

            <button type="submit" className="btn-premium w-100 mt-30">
              Register Account
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}