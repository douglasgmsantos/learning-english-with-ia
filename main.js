require('dotenv').config();
const fetch = require('node-fetch');
const qrcode = require('qrcode-terminal');
const FormData = require('form-data');
const { transcribeAudioInline } = require('./gemini');
const { evaluateAudioTranscription } = require('./translate');

// Polyfill fetch and FormData for OpenAI compatibility
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}
if (!globalThis.FormData) {
    globalThis.FormData = FormData;
}

const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

// Cria uma nova instância do cliente
const client = new Client();

// Quando o cliente estiver pronto, execute este código (apenas uma vez)
client.once('ready', () => {
    console.log('🟢 Cliente WhatsApp está pronto e conectado!');
    console.log('Bot está rodando e aguardando mensagens...');
});

// Quando o cliente receber o QR-Code
client.on('qr', (qr) => {
    console.log('📱 Escaneie o QR Code abaixo com seu WhatsApp:');
    qrcode.generate(qr, {small: true});
    console.log('⏰ O QR Code expira em 30 segundos e será regenerado automaticamente.');
});

// Quando uma nova mensagem for criada (enviada ou recebida)
client.on('message_create', async (message) => {
    try {
        // Ignorar mensagens enviadas pelo próprio bot
        console.log(`📩 Nova mensagem recebida de ${message.from}: "${message.body}"`);
        // if (!message.fromMe) return;
        
        // Verificar se a mensagem é um áudio
        if (message.hasMedia && message.type === 'ptt') {
            console.log('🎤 Áudio recebido, iniciando transcrição...');
            
            try {
                // Baixar o áudio
                const media = await message.downloadMedia();
                
                // Criar pasta temporária se não existir
                console.log('🔍 Criando pasta temporária...');
                const tempDir = path.join(__dirname, 'temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }
                
                console.log('🔍 Pasta temporária criada com sucesso');
                
                // Salvar o áudio temporariamente
                console.log('🔍 Salvando áudio temporariamente...');
                const fileName = `audio_${Date.now()}.ogg`;
                const filePath = path.join(tempDir, fileName);
                
                console.log('🔍 Áudio salvo com sucesso');
                
                // Converter base64 para buffer e salvar
                const buffer = Buffer.from(media.data, 'base64');
                fs.writeFileSync(filePath, buffer);
                
                console.log('🔍 Áudio convertido para buffer com sucesso');
                
                console.log('🔍 Iniciando transcrição...');
                const transcription = await transcribeAudioInline(filePath);
                console.log('🔍 Transcrição feita com sucesso', transcription);

                console.log('🔍 Iniciando avaliação...');
                const evaluationResult = await evaluateAudioTranscription(filePath);
                console.log('🔍 Avaliação feita com sucesso', evaluationResult);
                
                // Construir mensagem de resposta
                let responseMessage = `🎤 *Transcrição do áudio:*\n\n"${transcription}"\n\n📊 *Avaliação da Pronúncia:*\n\n`;
                
                if (typeof evaluationResult === 'object' && evaluationResult.nota !== undefined) {
                    // Usar dados estruturados da avaliação
                    responseMessage += `*Nota:* ${evaluationResult.nota}/10\n\n`;
                    responseMessage += `*Avaliação:* ${evaluationResult.avaliacao}`;
                    
                    // Se a nota for menor que 10, incluir pronúncia correta
                    if (evaluationResult.nota < 10 && evaluationResult.pronuncia_correta && evaluationResult.pronuncia_correta !== "Não disponível") {
                        responseMessage += `\n\n🗣️ *Pronúncia Correta:*\n\n${evaluationResult.pronuncia_correta}`;
                    }
                } else {
                    // Fallback para formato antigo (string simples)
                    responseMessage += evaluationResult;
                }
                
                await message.reply(responseMessage);
                console.log('✅ Áudio transcrito e avaliado com sucesso');
                
                // Limpar arquivo temporário
                fs.unlinkSync(filePath);
                
            } catch (transcriptionError) {
                console.error('❌ Erro ao transcrever áudio:', transcriptionError);
                await message.reply('❌ Desculpe, não foi possível transcrever o áudio. Verifique se a configuração da API está correta.');
            }
            
            return; // Sair após processar o áudio
        }
        
    } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error);
    }
});

// Quando há erro de autenticação
client.on('auth_failure', (msg) => {
    console.error('❌ Falha na autenticação:', msg);
});

// Quando o cliente é desconectado
client.on('disconnected', (reason) => {
    console.log('🔴 Cliente desconectado:', reason);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Erro não tratado:', reason);
});

// Inicializar o cliente
console.log('🚀 Iniciando bot WhatsApp...');
client.initialize();
