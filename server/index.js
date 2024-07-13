const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const issueRoutes = require('./routes/issueRoutes');
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const app = express();
const port = 8000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch((err) => console.log('Database not connected', err));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' // Replace with your frontend origin
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.use('/api', issueRoutes); // Issue routes
app.use('/', authRoutes); // Auth routes

app.get('/api/reverse-geocode', async (req, res) => {
    const { lat, lng } = req.query;
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
