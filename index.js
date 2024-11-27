import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.all('*', async (req, res) => {
    console.log(`Received request for: ${req.originalUrl}`);
    try {
        const host = 'https://nexge.glomil.com/api';
        const targetUrl = `${host}${req.originalUrl}`;

        const axiosConfig = {
            method: req.method.toLowerCase(),
            url: targetUrl,
            headers: { 'Content-Type': 'application/json' },
            data: req.body,
        };

        const response = await axios(axiosConfig);
        res.status(response.status).send(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            console.log(error.message)
            res.status(500).send('Server error: ' + error.message);
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});