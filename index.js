const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const { Groq } = require('groq-sdk');

const app = express();
const groqApiKey = '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';
const client = new Groq({ apiKey: groqApiKey });

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/sms', (req, res) => {
    const incomingQue = req.body.Body ? req.body.Body.toLowerCase() : '';
    console.log("Request: ", req.body);

    generateAnswer(incomingQue)
        .then((answer) => {
            console.log("Question: ", incomingQue);
            console.log("BOT Answer: ", answer);

            const twiml = new MessagingResponse();
            twiml.message(answer);

            res.type('text/xml');
            res.send(twiml.toString());
        })
        .catch((error) => {
            console.error('Error generating answer:', error);
            res.status(500).send('Internal Server Error');
        });
});

async function generateAnswer(question) {
    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: question }],
        model: 'mixtral-8x7b-32768',
    });

    return chatCompletion.choices[0].message.content;
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
