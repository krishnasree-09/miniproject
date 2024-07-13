/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        number: '',
        location: '',
        serviceProvider: false,
        serviceRequestor: false,
    });

    const registerUser = async (e) => {
        e.preventDefault();
        const { name, email, password, location, number, serviceProvider, serviceRequestor } = data;
        try {
            const { data: response } = await axios.post('/register', {
                name,
                email,
                password,
                number,
                location,
                serviceProvider,
                serviceRequestor
            });
            if (response.error) {
                toast.error(response.error);
            } else {
                setData({
                    name: '',
                    email: '',
                    password: '',
                    number: '',
                    location: '',
                    serviceProvider: false,
                    serviceRequestor: false,
                });
                toast.success(`Registration Successful, WELCOME!!`);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {        
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                try {
                    const response = await axios.get(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
                    if (response.data && response.data.address) {
                        // Extract address components
                        const address = [
                            response.data.address.road,
                            response.data.address.suburb,
                            response.data.address.city,
                            response.data.address.state,
                            response.data.address.country,
                            response.data.address.postcode
                        ].filter(Boolean).join(', '); // Join components and filter out empty values
                        setData({ ...data, location: address });
                    } else {
                        toast.error('Location not found');
                    }
                } catch (error) {
                    toast.error('Failed to fetch location');
                }
            });
        } else {
            toast.error('Geolocation is not supported by this browser.');
        }
    };


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    return (
        <div className="vh-100 vw-100 container-fluid d-flex align-items-center justify-content-center bg-secondary">
            <div className="card p-4 bg-dark text-white w-50">
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={registerUser}>
                    <div className="form-group mb-3">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </div>
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
                        <label htmlFor="number">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="number"
                            placeholder="Number"
                            value={data.number}
                            onChange={(e) => setData({ ...data, number: e.target.value })}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="location">Location</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                placeholder="Location"
                                value={data.location}
                                onChange={(e) => setData({ ...data, location: e.target.value })}
                            />
                            <button type="button" className="btn btn-primary ml-2" onClick={getLocation}>
                                Get Location
                            </button>
                        </div>
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
                                onChange={handleCheckboxChange}
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
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="serviceProvider">SERVICE PROVIDER LOGIN</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                </form>
            </div>
        </div>
    );
}
