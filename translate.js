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
                text: `Transcreva o áudio e avalie a pronúncia em inglês de 0 a 10. 
                
                Responda SEMPRE no seguinte formato JSON:
                {
                    "transcricao": "transcrição do que foi dito",
                    "nota": número de 0 a 10,
                    "avaliacao": "avaliação detalhada da pronúncia",
                    "pronuncia_correta": "se a nota for menor que 10, forneça a pronúncia correta usando notação fonética IPA ou uma explicação clara de como pronunciar corretamente"
                }
                
                Mesmo que a nota seja 10, sempre inclua todos os campos no JSON.` 
            },
        ]);

        const response = await result.response;
        const responseText = response.text();
        
        try {
            // Tentar extrair JSON da resposta
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const evaluationData = JSON.parse(jsonMatch[0]);
                return evaluationData;
            } else {
                // Fallback se não conseguir extrair JSON
                return {
                    transcricao: "Não foi possível extrair transcrição",
                    nota: 0,
                    avaliacao: responseText,
                    pronuncia_correta: "Não disponível"
                };
            }
        } catch (parseError) {
            console.error("Erro ao fazer parse do JSON:", parseError);
            // Fallback se não conseguir fazer parse do JSON
            return {
                transcricao: "Não foi possível extrair transcrição",
                nota: 0,
                avaliacao: responseText,
                pronuncia_correta: "Não disponível"
            };
        }

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