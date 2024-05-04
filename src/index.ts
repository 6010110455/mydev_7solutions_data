import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Define a route to fetch users
app.get('/users', async (req, res) => {
    try {
        const response = await axios.get('https://dummyjson.com/users');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error: error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
