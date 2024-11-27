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
app.all('/:type/*', async (req, res) => {
    const type = req.params.type

    try {
        const hosts = {
            nexge: 'https://nexge.glomil.com/api',
            nexgest: 'https://nexge-st.glomil.com/api',
            wap : 'https://wap-storage-api.asggrup.com',
            jsonplaceholder: 'https://jsonplaceholder.typicode.com'
        }
        const host = hosts[type];
        const targetUrl = `${host}${req.originalUrl.replace('/'+type, '')}`;

        console.log(targetUrl, req.method)
        const axiosConfig = {
            method: req.method.toLowerCase(),
            url: targetUrl,
            headers: { 'Content-Type': 'application/json' },
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