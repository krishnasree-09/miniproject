/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ServiceProviderDashboard.css'; 

export default function ServiceProviderDashboard() {
    const [issues, setIssues] = useState([]);
    const [addresses, setAddresses] = useState({});
    const [serviceProviderId, setServiceProviderId] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    useEffect(() => {
        const id = localStorage.getItem('serviceProviderId');
        const lat = localStorage.getItem('lat');
        const lng = localStorage.getItem('lng');
        setServiceProviderId(id);
        setLat(lat);
        setLng(lng);
        fetchIssues(id, lat, lng);
    }, []);

    const fetchIssues = async (providerId, lat, lng) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/fetch-issues/${providerId}/${lat}/${lng}?isProviderRequest=true`);
            const issuesData = response.data.issues;
            setIssues(issuesData);

            const addressesData = await Promise.all(issuesData.map(issue => fetchAddress(issue.location.lat, issue.location.lng)));
            const addressesMap = issuesData.reduce((acc, issue, index) => {
                acc[issue._id] = addressesData[index];
                return acc;
            }, {});
            setAddresses(addressesMap);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching issues');
        }
    };

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await axios.get(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
            if (response.data && response.data.address) {
                return [
                    response.data.address.road,
                    response.data.address.suburb,
                    response.data.address.city,
                    response.data.address.state,
                    response.data.address.country,
                    response.data.address.postcode
                ].filter(Boolean).join(', ');
            } else {
                return 'Address not found';
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            return 'Address not found';
        }
    };

    const handleAccept = async (issueId) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/accept-issue/${issueId}?serviceProviderId=${serviceProviderId}`);
            if (response.data.success) {
                toast.success('Issue accepted');
                fetchIssues(serviceProviderId, lat, lng);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while accepting the issue');
        }
    };

    const handleReject = async (issueId) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/reject-issue/${issueId}/${serviceProviderId}`);
            if (response.data.success) {
                toast.success('Issue rejected');
                fetchIssues(serviceProviderId, lat, lng);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error rejecting issue:', error);
            toast.error('An error occurred while rejecting the issue');
        }
    };

    return (
        <div className="vh-100 vw-100 container-fluid d-flex flex-column align-items-center justify-content-center bg-secondary">
            <h2 className="text-center mb-4 text-white">Service Provider Dashboard</h2>
            <div className="w-100">
                <table className="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th>Issue</th>
                            <th>Location</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map((issue) => (
                            <tr key={issue._id}>
                                <td>{issue.issue}</td>
                                <td>{addresses[issue._id]}</td>
                                <td>{issue.name}</td>
                                <td>{issue.phone}</td>
                                <td>
                                    {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                                </td>
                                <td>
                                    {issue.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn btn-success me-2"
                                                onClick={() => handleAccept(issue._id)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleReject(issue._id)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {issue.status === 'accepted' && issue.acceptedBy === serviceProviderId && (
                                        <span className="badge bg-success">Accepted</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
