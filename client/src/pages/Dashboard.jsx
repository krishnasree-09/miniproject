// src/pages/Dashboard.jsx
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export default function Dashboard() {
    // Correctly use useContext to access UserContext
    const { user } = useContext(UserContext);

    return (
        <div>
            <h1>Dashboard</h1>
            {!!user && <h2>Hello User!</h2>}
        </div>
    );
}
