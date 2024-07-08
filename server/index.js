const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const cookieParser = require('cookie-parser');

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

app.use('/', require('./routes/authRoutes'));

app.get('/api/reverse-geocode', async (req, res) => {
    const { lat, lng } = req.query;
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
