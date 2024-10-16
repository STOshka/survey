// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.use(cors());
app.use(express.json());

const questionsFilePath = path.join(__dirname, 'questions.json');

app.get('/api/questions', (req, res) => {
    const data = fs.readFileSync(questionsFilePath);
  res.json(JSON.parse(data));
});

app.post('/submit', async (req, res) => {
    const { ip, questionId, answer } = req.body;

    try {
        const response = await axios.post('https://script.google.com/macros/s/AKfycbxtnK_WX4QCML_013_g2YHJgHutjld_fO5bD7ui-y5uR-mqH4x4Bqb8NaamZsR8x4Dh/exec', {
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
