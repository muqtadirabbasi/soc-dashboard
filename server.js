const express = require('express');
const path = require('path');
// Ensure this import matches exactly at the top of your server.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure your route initialization logic flows precisely like this:
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY missing on Azure." });
        }

        // Initialize the library
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Use the standard stable text model identifier
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemContext = `You are a SOC Analyst Assistant called the Gemini AI Master. Context: ${context || 'None'}`;
        const fullPrompt = `${systemContext}\n\nAnalyst Question: ${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        
        return res.json({ response: response.text() });
    } catch (error) {
        console.error("Internal Server Crash:", error);
        return res.status(500).json({ error: error.message });
    }
});

        // Initialize Google AI with the secure key
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the robust 1.5-flash model optimized for rapid text operations
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct a contextual prompt for your SOC workflow
        const systemContext = `You are a specialized SOC Analyst Assistant called the Gemini AI Master. 
Context from selected dashboard frame: ${context || 'No specific dashboard frame selected.'}
Respond to the analyst's question professionally, objectively, and accurately.`;

        const fullPrompt = `${systemContext}\n\nAnalyst Question: ${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return res.json({ response: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ error: "Failed to communicate with the Gemini AI Master engine." });
    }
});

// Fallback to route all web traffic to your main dashboard index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`SOC Application server running on port ${PORT}`);
});
