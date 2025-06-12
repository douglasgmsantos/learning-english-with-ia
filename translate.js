const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function evaluateAudioTranscription(audioFilePath) {
    try {
        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Read audio file
        const audioBytes = fs.readFileSync(audioFilePath);
        const ext = audioFilePath.split('.').pop().toLowerCase();
        const mimeType = `audio/${ext}`;

        // Generate transcription and evaluation
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: mimeType,
                    data: Buffer.from(audioBytes).toString('base64'),
                },
            },
            { 
                text: "Transcreva o áudio e avalie se o texto está correto. De 0 a 10, como foi o texto em inglês? Forneça uma avaliação detalhada." 
            },
        ]);

        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Erro ao avaliar transcrição:", error);
        throw error;
    }
}

module.exports = {
    evaluateAudioTranscription
};


// // Exemplo de uso:
// const audioFilePath = path.join(__dirname, 'temp/audio.m4a');

// (async () => {
//     const transcription = await evaluateAudioTranscription(audioFilePath);
//     console.log(transcription);
// })();