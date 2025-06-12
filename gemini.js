// Load environment variables
require('dotenv').config();

// Add fetch and Headers polyfill for Node.js versions that don't have it built-in
const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
global.fetch = fetch;
global.Headers = Headers;

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Carregue sua chave de API de uma variável de ambiente
// Substitua 'YOUR_API_KEY' pela sua chave diretamente se não usar variáveis de ambiente (NÃO RECOMENDADO PARA PRODUÇÃO)
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

const genAI = new GoogleGenerativeAI(API_KEY);

async function transcribeAudioInline(audioFilePath) {
  try {
    // 1. Leia o arquivo de áudio em um Buffer
    console.log('🔍 Lendo arquivo de áudio...');
    const audioBytes = fs.readFileSync(audioFilePath);

    // 2. Determine o MIME type
    // Uma forma simples, mas você pode querer uma lógica mais robusta
    console.log('🔍 Determinando o MIME type...');
    const ext = path.extname(audioFilePath).toLowerCase();
    let mimeType;
    if (ext === '.mp3') {
      mimeType = 'audio/mpeg';
    } else if (ext === '.wav') {
      mimeType = 'audio/wav';
    } else if (ext === '.flac') {
      mimeType = 'audio/flac';
    } else if (ext === '.ogg') {
      mimeType = 'audio/ogg';
    } else {
      console.error('Formato de áudio não suportado ou MIME type desconhecido.');
      return;
    }

    // 3. Crie o prompt com o áudio inline e a solicitação de transcrição
    console.log('🔍 Criando o prompt...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // ou 'gemini-1.5-pro'

    console.log('🔍 Iniciando a transcrição...');
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: Buffer.from(audioBytes).toString('base64'), // Converta o Buffer para Base64
        },
      },
      { text: "Transcreva o que é dito neste áudio." },
    ]);

    console.log('🔍 Transcrição feita com sucesso');

    const response = await result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error("Ocorreu um erro ao transcrever o áudio inline:", error);
    if (error.response && error.response.candidates && error.response.candidates[0].finishReason === "SAFETY") {
        console.warn("A resposta foi bloqueada por motivos de segurança.");
    }
  }
}

// Exemplo de uso:
// const audioFilePath = path.join(__dirname, 'temp/audio.ogg'); // Certifique-se que você tem um arquivo audio.mp3 na mesma pasta
// Crie um arquivo de áudio para testar, ou use um caminho real.
// Por exemplo, você pode gravar um pequeno clipe de voz.

// console.log("Verificando se o arquivo existe:", fs.existsSync(audioFilePath));
// if (!fs.existsSync(audioFilePath)) {
//     console.error(`Erro: Arquivo de áudio não encontrado em ${audioFilePath}. Crie um para testar.`);
// } else {
//     transcribeAudioInline(audioFilePath);
// }

// Para fins de demonstração, chame a função diretamente (assumindo que o arquivo existe)
// transcribeAudioInline(audioFilePath);

module.exports = {
  transcribeAudioInline
};