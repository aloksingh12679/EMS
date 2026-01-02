import React from "react";
import "../assets/styles/LandingPageStyles/Footer.css";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="logo-icon">⊟⊟</span>
            <span>EMS Enterprise</span>
          </div>
          <p>
            The leading employee management platform for modern enterprises.
            Scalable, secure, and simple to use.
          </p>
          <div className="social-links">
            <a href="#" title="LinkedIn">
             <i class="fa-brands fa-linkedin"></i>
            </a>
            <a href="#" title="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" title="Facebook">
              <i class="fa-brands fa-facebook"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Platform</h4>
          <ul>
            <li>
              <a href="/">Ems Enterprises</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#">Integrations</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">API Documentation</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Partners</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">System Status</a>
            </li>
            <li>
              <a href="#">Security</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2023 EMS Enterprise Inc. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}
