/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserDashboard() {
    const [issue, setIssue] = useState('');
    const [location, setLocation] = useState({ lat: null, lng: null, address: '' });
    const [user, setUser] = useState({ name: '', phone: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            const name = localStorage.getItem('name') || '';
            const phone = localStorage.getItem('phone') || '';
            setUser({ name, phone });
        };
        fetchUserData();
    }, []);

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    try {
                        const response = await axios.get(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);

                        if (response.data && response.data.address) {
                            const address = [
                                response.data.address.road,
                                response.data.address.suburb,
                                response.data.address.city,
                                response.data.address.state,
                                response.data.address.country,
                                response.data.address.postcode
                            ].filter(Boolean).join(', ');

                            setLocation({ lat, lng, address });
                        } else {
                            toast.error('Location not found');
                        }
                    } catch (error) {
                        toast.error('Failed to fetch location');
                        console.error('Error fetching location:', error);
                    }
                },
                (error) => {
                    toast.error('Geolocation permission denied.');
                }
            );
        } else {
            toast.error('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!location.lat || !location.lng || !location.address) {
            toast.error('Please provide a valid location.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/submit-issue', {
                issue,
                location,
                name: user.name,
                phone: user.phone,
            });

            if (response.data.success) {
                toast.success('Issue submitted successfully');
                setIssue('');
                setLocation({ lat: null, lng: null, address: '' });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error submitting issue:', error);
            toast.error('An error occurred while submitting the issue');
        }
    };

    return (
        <div className="vh-100 vw-100 container-fluid d-flex align-items-center justify-content-center bg-secondary">
            <div className="card p-5 bg-dark text-white w-50">
                <h2 className="text-center mb-4">Submit an Issue</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="issue">Issue</label>
                        <textarea
                            className="form-control"
                            id="issue"
                            rows="3"
                            placeholder="Describe your issue"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group mb-3">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleLocation}
                        >
                            Get Location
                        </button>
                        {location.lat && location.lng && (
                            <p className="mt-2">    
                                Location: {location.address || `${location.lat}, ${location.lng}`}
                            </p>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                </form>
            </div>
        </div>
    );
}
