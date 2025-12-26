const fs = require('fs');
const pdfParse = require('pdf-parse');
const fileUtils = require('../utils/fileUtils');

exports.summarize = async (file) => {
    const dataBuffer = fs.readFileSync(file.path);

    try {
        const data = await pdfParse(dataBuffer);
        const text = data.text;

        // Simple "AI" summarization: Extract first 5 sentences.
        // In a real app, this would call OpenAI/Ollama API.
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 20);
        const summary = sentences.slice(0, 5).join('. ') + '.';

        return {
            summary: summary,
            pageCount: data.numpages,
            info: data.info
        };
    } catch (error) {
        console.error('AI Summarization failed:', error);
        throw new Error('Failed to analyze PDF.');
    }
};

exports.chat = async (file, question) => {
    // Placeholder for Chat with PDF
    // 1. Extract text
    // 2. Send text + question to LLM
    // 3. Return answer

    return {
        answer: "This is a simulated AI response. To enable real chat, connect an LLM API key.",
        context: "Extracted text from PDF..."
    };
};
