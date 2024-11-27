import express from 'express';
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.all('*', async (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');

        const targetUrl = `${protocol}://${host}${req.originalUrl}`;
        const axiosConfig = {
            method: req.method.toLowerCase(),
            url: targetUrl,
            headers: {
                ...req.headers,
                host: host,
            },
            data: req.body,
        };
        const response = await axios(axiosConfig);

        res.status(response.status).send(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Sunucu hatası: ' + error.message);
        }
    }
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});