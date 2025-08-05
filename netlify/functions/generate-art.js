const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const { prompt } = JSON.parse(event.body);

    // Ambil API key dari Environment Variable di Netlify
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API Key not configured.' }),
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro-vision" // Gunakan model vision untuk gambar
        });

        // Prompt untuk generate gambar
        const textPrompt = `Create an abstract painting based on the following description: "${prompt}". The output should be a single, full-body image.`;

        const result = await model.generateContent(textPrompt);
        const response = await result.response;
        const imageUrl = response.candidates[0].content.parts[0].text; // Asumsi output adalah URL gambar

        return {
            statusCode: 200,
            body: JSON.stringify({ imageUrl: imageUrl }),
        };

    } catch (error) {
        console.error('Gemini API Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate art from API.' }),
        };
    }
};
