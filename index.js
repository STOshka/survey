// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const questionsFilePath = path.join(__dirname, 'questions.json');

app.get('/api/questions', (req, res) => {
  const data = JSON.parse(fs.readFileSync(questionsFilePath));
  res.json(data);
});

app.post('/api/new_questions', (req, res) => {
  const newQuestion = req.body;
  const questions = readQuestions();
  const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
  newQuestion.id = newId;
  questions.push(newQuestion);
  fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2));
  res.status(201).json(newQuestion);
});

app.use(express.static(path.join(__dirname, 'dist')));
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
