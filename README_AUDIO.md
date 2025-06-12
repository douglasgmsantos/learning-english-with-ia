# 🎤 Configuração da Transcrição de Áudio

## ⚡ Quick Start

Para ativar a transcrição de áudio no seu bot WhatsApp, siga estas etapas:

### 1. Obter Chave da API OpenAI

1. Acesse: <https://platform.openai.com/api-keys>
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave gerada (começará com `sk-`)

### 2. Configurar Variável de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Configuração da API OpenAI para transcrição de áudio
OPENAI_API_KEY=sk-sua-chave-da-openai-aqui
```

**IMPORTANTE:** Substitua `sk-sua-chave-da-openai-aqui` pela sua chave real da OpenAI.

### 3. Testar a Funcionalidade

1. Execute o bot: `npm start`
2. Envie um áudio de voz para o bot
3. Aguarde a transcrição automática

## 🎯 Como Funciona

- **Detecção Automática:** O bot detecta automaticamente mensagens de áudio (tipo 'ptt')
- **Download:** Baixa o áudio recebido
- **Transcrição:** Usa a API Whisper da OpenAI para converter áudio em texto
- **Resposta:** Envia a transcrição de volta para o usuário
- **Limpeza:** Remove arquivos temporários automaticamente

## 💰 Custos da API

A API Whisper da OpenAI cobra por minuto de áudio transcrito:

- **Preço:** $0.006 por minuto
- **Exemplo:** 1 hora de áudio = ~$0.36

Para uso pessoal e testes, os custos são bem baixos.

## 🔧 Comandos Relacionados

- `!transcribe` - Informações sobre transcrição
- `!help` - Ver todos os comandos (incluindo transcrição)

## 🛠️ Troubleshooting

### Erro: "Invalid API Key"

- Verifique se a chave está correta no arquivo `.env`
- Certifique-se de que a chave começa com `sk-`
- Verifique se tem créditos na sua conta OpenAI

### Erro: "File format not supported"

- O WhatsApp geralmente envia áudios em formato OGG/OPUS
- A API Whisper suporta este formato nativamente

### Transcrição em idioma errado

- O código está configurado para português (`language: 'pt'`)
- Para outros idiomas, edite a linha no `main.js`

## 🔒 Segurança

- **NUNCA** compartilhe sua chave da API
- **NUNCA** commit o arquivo `.env` para repositórios públicos
- O arquivo `.env` deve estar no `.gitignore`

## 📝 Arquivos Temporários

Os áudios são salvos temporariamente na pasta `temp/` e removidos após a transcrição.

## 🎮 Exemplo de Uso

1. Usuário envia áudio: *"Olá, como você está hoje?"*
2. Bot responde:

   ```
   🎤 Transcrição do áudio:
   
   "Olá, como você está hoje?"
   ```
