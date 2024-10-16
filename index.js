// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

// Middleware
app.use(cors());
app.use(express.json());

app.post('/submit', async (req, res) => {
    const { ip, questionId, answer } = req.body;

    try {
        const response = await axios.post('https://script.google.com/macros/s/AKfycbwHgbCmC2n1MEcWJymE-YY03_jX4nY5qLaxBptXDLveJfdhkiRf3CSqEnkRbCONNmjN/exec', {
            ip,
            questionId,
            answer,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error submitting data:', error.message);
        res.status(500).json({ message: 'Ошибка отправки данных. Проверьте своё интернет-соединение' });
    }
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
