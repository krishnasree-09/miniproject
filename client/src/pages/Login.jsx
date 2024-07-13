/* eslint-disable no-unused-vars */
// src/pages/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
        serviceRequestor: false,
        serviceProvider: false,
    });

    const toggleCheckbox = (name) => {
        setData((prevData) => ({
            ...prevData,
            serviceProvider: name === 'serviceProvider' ? true : false,
            serviceRequestor: name === 'serviceRequestor' ? true : false,
        }));
    };

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password, serviceRequestor, serviceProvider } = data;
        try {
            const response = await axios.post('http://localhost:8000/login', {
                email,
                password,
                serviceRequestor,
                serviceProvider,
            });

            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                const { token, user } = response.data;

                if (!token) {
                    toast.error('Login failed. Token not received.');
                    return;
                }

                // Set user data or token as needed
                localStorage.setItem('authToken', token);
                localStorage.setItem('name', user.name);
                localStorage.setItem('phone', user.number);
                localStorage.setItem('serviceProviderId', user.id);

                // Redirect based on role
                if (user.role === 'serviceProvider') {
                    navigate('/service-provider-dashboard');
                } else if (user.role === 'serviceRequestor') {
                    navigate('/user-dashboard');
                } else {
                    toast.error('Unknown role');
                }

                // Clear form data
                setData({
                    email: '',
                    password: '',
                    serviceRequestor: false,
                    serviceProvider: false,
                });
                toast.success('Login Successful, WELCOME!!');
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('An error occurred during login');
        }
        location.reload();
    };

    return (
        <div className="vh-100 vw-100 container-fluid d-flex align-items-center justify-content-center bg-secondary">
            <div className="card p-5 bg-dark text-white w-50">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={loginUser}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Role</label>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="serviceRequestor"
                                name="serviceRequestor"
                                checked={data.serviceRequestor}
                                onChange={() => toggleCheckbox('serviceRequestor')}
                            />
                            <label className="form-check-label" htmlFor="serviceRequestor">USER LOGIN</label>
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="serviceProvider"
                                name="serviceProvider"
                                checked={data.serviceProvider}
                                onChange={() => toggleCheckbox('serviceProvider')}
                            />
                            <label className="form-check-label" htmlFor="serviceProvider">SERVICE PROVIDER LOGIN</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}
