import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiBookOpen, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import "./login.css"; 
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${Server_URL}users/login`, data);
      const { role } = response.data.user;

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("role", role);

      if (role === "admin" || role === "librarian") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      showSuccessToast("Login Successful!");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || "Login Failed!");
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
          style={{ maxWidth: '450px' }}
        >
          <div className="auth-header">
            <div className="auth-logo">
              <FiBookOpen />
            </div>
            <h2>Welcome Back</h2>
            <p>Access your library account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="premium-form">
            <div className="input-group-v3">
              <label><FiMail /> Email Address</label>
              <div className="input-wrapper-v3">
                <FiMail className="input-icon" />
                <input type="email" placeholder="john@example.com" {...register("email", { required: "Email is required" })} />
              </div>
              {errors.email && <span className="error-v3">{errors.email.message}</span>}
            </div>

            <div className="input-group-v3 mt-20">
              <label><FiLock /> Password</label>
              <div className="input-wrapper-v3">
                <FiLock className="input-icon" />
                <input type="password" placeholder="••••••••" {...register("password", { required: "Password is required" })} />
              </div>
              {errors.password && <span className="error-v3">{errors.password.message}</span>}
            </div>

            <div className="auth-options">
              <button type="button" className="forgot-btn-v3" onClick={() => navigate("/forgetpassword")}>
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="btn-premium w-100 mt-20">
              Sign In <FiArrowRight />
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create Account</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
