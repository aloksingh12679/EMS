import React, { useState } from 'react';
import { Bell, HelpCircle, Edit3, MoreVertical, MapPin, Phone, Mail, Lock, Trash2, Sidebar } from 'lucide-react';

import "../../assets/styles/EmployeeProfileCSS/EmployeeProfile.css"

import AdminSidebar from '../../Components/AdminSidebar';
// make it responsive 
// add <Sidebar /> from components then implement responsiveness 
// take exaple of employeeList Page
export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState('personal-info');
  return (
    <>
      <div className="ems-container">
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* TOP HEADER */}
          <header className="top-header">
            <input
              type="text"
              className="search-bar"
              placeholder="Search employees, ID, or department..."
            />
            <div className="header-icons">
              <Bell className="icon-btn" />
              <HelpCircle className="icon-btn" />
            </div>
          </header>

          {/* BREADCRUMB */}
          {/* <div className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-sep">›</span>
            <span>Employees</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Sam Kumari</span>
          </div> */}

          {/* SCROLLABLE CONTENT */}
          <div className="scrollable-content">
            {/* PROFILE CARD */}
            <div className="profile-card">
              <div className="profile-avatar-section">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                  alt="Alexandra Chen"
                  className="profile-img"
                />
                <div className="status-indicator"></div>
              </div>

              <div className="profile-info">
                <h1 className="profile-name">Sam Kumari</h1>
                <div className="profile-meta">
                  <span className="job-title">📋 Product Manager</span>
                  <span className="emp-id">ID: EMP-0012</span>
                  <span className="status-badge">Active</span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="edit-btn">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
                <button className="menu-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* TABS */}
            <div className="tabs-wrapper">
              <div className="tabs">
                {['Personal Info', 'Attendance', 'Salary & Payroll', 'Leaves', 'Performance'].map((tab) => (
                  <button
                    key={tab}
                    className={`tab ${activeTab === tab.toLowerCase().replace(/\s+/g, '-') ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, '-'))}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* FIRST ROW - CONTACT & QUICK STATS */}
            <div className="content-grid">
              {/* LEFT: CONTACT INFORMATION */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Contact Information</h3>
                  {/* <button className="edit-link">Edit</button> */}
                </div>

                <div className="contact-info-grid">
                  {/* <div className="info-field">
                    <label className="info-label">Work Email</label>
                    <div className="info-value">
                      
                      <i class="fa-regular fa-envelope"></i>
                      <span>samkumari@gmail.com</span>
                    </div>
                  </div> */}

                  <div className="info-field">
                    <label className="info-label">Phone Number</label>
                    <div className="info-value">
                      {/* <Phone /> */}
                      <i class="fa-solid fa-phone"></i>
                      <span>+91 (111) 4569872</span>
                    </div>
                  </div>

                  <div className="info-field">
                    <label className="info-label">Personal Email</label>
                    <div className="info-value">
                      {/* <Mail /> */}
                      <i class="fa-regular fa-envelope"></i>
                      <span>alex.c@gmail.com</span>
                    </div>
                  </div>

                  <div className="info-field">
                    <label className="info-label">Work Location</label>
                    <div className="info-value">
                      {/* <MapPin /> */}
                      <i class="fa-solid fa-location-dot"></i>
                      <span>Bangalore</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: QUICK STATS */}
              <div className="card">
                <h3 className="quick-stats-title">Quick Stats</h3>

                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <p className="stat-label">Attendance</p>
                    <p className="stat-value">98.5%</p>
                  </div>
                  <span className="stat-change">+2%</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🏖️</div>
                  <div className="stat-content">
                    <p className="stat-label">Leave Balance</p>
                    <p className="stat-value">12 Days</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <p className="stat-label">Performance</p>
                    <p className="stat-value">4.8/5.0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* EMPLOYMENT DETAILS - FULL WIDTH */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Employment Details</h3>
                {/* <button className="edit-link">Edit</button> */}
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <label className="detail-label">Department</label>
                  <p className="detail-value">Product Management</p>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Reporting Manager</label>
                  <div className="manager-card">
                    <div className="manager-avatar">DM</div>
                    <span className="detail-value">David Miller</span>
                  </div>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Date of Joining</label>
                  <p className="detail-value">Oct 12, 2021</p>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Contract Type</label>
                  <p className="detail-value">Full-Time (Permanent)</p>
                </div>
              </div>
            </div>

            {/* SECOND ROW - PERSONAL INFO & ACCOUNT ACTIONS */}
            <div className="content-grid">
              {/* LEFT: PERSONAL INFORMATION */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Personal Information</h3>
                  {/* <button className="edit-link">Edit</button> */}
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <label className="detail-label">Date of Birth</label>
                    <p className="detail-value"><i class="fa-solid fa-cake-candles"></i> Sep 19, 2002</p>
                  </div>

                  <div className="detail-item">
                    <label className="detail-label">Gender</label>
                    <p className="detail-value"><i class="fa-regular fa-user"></i> Female</p>
                  </div>

                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <label className="detail-label">Current Address</label>
                    <p className="detail-value"><i class="fa-solid fa-location-dot"></i> 4517 Bangalore, Sector 55</p>
                  </div>
                </div>
              </div>

              {/* RIGHT: ACCOUNT ACTIONS & TEAM MEMBERS */}
              <div className="card">
                <h3 className="quick-stats-title">Account Actions</h3>

                <div className="account-actions-section">
                  <div className="action-item">
                    <div className="action-icon">🔐</div>
                    <div>Delete User</div>
                  </div>

                  <div className="action-item danger">
                    <div className="action-icon">⛔</div>
                    <div>Deactivate User</div>
                  </div>
                </div>

                {/* TEAM MEMBERS */}
                {/* <div className="team-section">
                  <div className="team-header">
                    <h3 className="quick-stats-title">Team Members</h3>
                    <button className="view-all-link">View All</button>
                  </div>
                  <div className="team-avatars">
                    <div className="avatar avatar-1">AC</div>
                    <div className="avatar avatar-2">DM</div>
                    <div className="avatar avatar-3">SJ</div>
                    <div className="avatar avatar-4">MK</div>
                    <span className="more-count">+3</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}