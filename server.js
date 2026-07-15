const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8080; // Securely handles Azure routing ports

// Middleware to process incoming requests
app.use(express.json());

// Points Express directly to your folder to load your dashboard
app.use(express.static(path.join(__dirname, 'public')));

// Secure backend API proxy endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY is missing on Azure configurations." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemContext = `You are a SOC Analyst Assistant called the Gemini AI Master. Context: ${context || 'None'}`;
        const fullPrompt = `${systemContext}\n\nAnalyst Question: ${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        
        return res.json({ response: response.text() });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: error.message });
    }
});

// Fallback to route all web traffic to your main dashboard page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
