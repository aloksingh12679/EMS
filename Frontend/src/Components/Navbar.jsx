import React, { useState } from "react";
import "../assets/styles/LandingPageStyles/Navbar.css";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="logo.png" alt="Graphura Logo" className="logo" />
        </div>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <button className="contact-sales-btn">
            <a href="#features">
               Home
            </a>
          </button>
          <button className="contact-sales-btn">
            <a href="#features">
               Admin Login
            </a>
          </button>
          <button className="contact-sales-btn">
            <a href="#solutions">
              Employee Login
            </a>
          </button>
        </div>


        <div className="navbar-btn-div">
          <button className="contact-sales-btn">
            <a href="#">
              Register
            </a>
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
