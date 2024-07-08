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
            const { data: response } = await axios.post('/login', {
                email,
                password,
                serviceRequestor,
                serviceProvider
            });

            if (response.error) {
                toast.error(response.error);
            } else {
                // Set user data or token as needed
                // localStorage.setItem('authToken', response.token);

                // Redirect based on role
                console.log(response)
                console.log(response.user.role == 'serviceRequestor')
                if (response.user.role == 'serviceProvider') {
                    navigate('/service-provider-dashboard');
                } else if (response.user.role == 'serviceRequestor') {
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
            console.log(error);
            toast.error('An error occurred during login');
        }
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
