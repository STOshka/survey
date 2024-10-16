// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Обслуживаем статические файлы из папки 'dist' (или папки с вашим фронтендом)
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint для отправки данных на Google Apps Script
app.post('/submit', async (req, res) => {
    const { questionId, answer } = req.body;

    try {
        const response = await axios.post('https://script.google.com/macros/s/AKfycbxtnK_WX4QCML_013_g2YHJgHutjld_fO5bD7ui-y5uR-mqH4x4Bqb8NaamZsR8x4Dh/exec', {
            questionId,
            answer,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Отправляем ответ обратно на клиент
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error submitting data:', error.message);
        res.status(500).json({ message: 'Failed to submit the data' });
    }
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
