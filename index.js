const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const { Groq } = require('groq-sdk');

const app = express();
const groqApiKey = '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';
const client = new Groq({ apiKey: groqApiKey });

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('<img src="https://indianmemetemplates.com/wp-content/uploads/Dhanda-first-class-chal-raha-hai-takatak-chal-raha-hai-aur-paiso-ki-to-baarish-ho-rahi-hai-baarish.jpg"></img>');
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
        model: 'llama3-8b-8192',
    });

    return chatCompletion.choices[0].message.content;
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
