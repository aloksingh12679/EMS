import React, { useState } from "react";
import "../assets/styles/LandingPageStyles/Navbar.css";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          {/* <i class="fa-solid fa-align-justify"></i> */}
          <a href="/">
            <span>EMS Enterprise</span>
          </a>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#solutions">Solutions</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#resources">Resources</a>
          </li>
        </ul>

        <button className="contact-sales-btn"><a href="#">Contact Sales</a></button>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </nav>
  );
}
