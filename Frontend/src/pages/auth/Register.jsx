import React, { useState } from "react";
import registerImg from "../../assets/images/register.webp";
import "../../assets/styles/LandingPageStyles/Register.css";

export default function CreateAccount() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "Admin",
    secretKey: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-page">

      <div className="register-left">
        <img src={registerImg} alt="Register Illustration" />

      </div>

      <div className="register-right">
        <div className="register-card">
          <h2>Create Account</h2>

          <label>Full Name</label>
          <input name="name" placeholder="Enter your full name" onChange={handleChange} />

          <label>Email Address</label>
          <input name="email" placeholder="Enter your email" onChange={handleChange} />

          <label>Mobile Number</label>
          <input name="mobile" placeholder="Enter your mobile number" onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" placeholder="********" onChange={handleChange} />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="Re-enter your password" onChange={handleChange} />

          <label>Register As</label>
          <input name="role" value="Admin" disabled />

          <label>Secret Key for Admin</label>
          <input name="secretKey" placeholder="Enter Admin secret key" onChange={handleChange} />

          <button className="register-btn">Register</button>

          <p className="login-link">
            Already have an account? <span>Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
}
