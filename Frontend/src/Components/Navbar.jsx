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

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          
            <li><a href="#">Home Page</a></li>
            <li><a href="#">Admin Login</a></li>
            <li><a href="#">Employee Login</a></li>
          
        </ul>


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
