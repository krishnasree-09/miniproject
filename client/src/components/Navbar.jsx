/* eslint-disable no-unused-vars */
// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Custom CSS for additional styles

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark w-100">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Breakdown Assistance</Link>
        <div className="navbar-nav ms-auto d-flex flex-row">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/register">Register</Link>
          <Link className="nav-link" to="/login">Login</Link>
          
        </div>
      </div>
    </nav>
  );
}
