/* eslint-disable no-unused-vars */
// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Custom CSS for additional styles

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Assume the token is stored in localStorage after login
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove the token on logout
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav className="navbar navbar-dark bg-dark w-100">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Breakdown Assistance</Link>
                <div className="navbar-nav ms-auto d-flex flex-row">
                    <Link className="nav-link" to="/">Home</Link>
                    {!isAuthenticated ? (
                        <>
                            <Link className="nav-link" to="/register">Register</Link>
                            <Link className="nav-link" to="/login">Login</Link>
                        </>
                    ) : (
                        <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </div>
        </nav>
    );
}
