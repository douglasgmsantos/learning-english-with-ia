# 🤖 Bot WhatsApp Automatizado

Bot automatizado para WhatsApp desenvolvido com [whatsapp-web.js](https://wwebjs.dev/) que recebe mensagens e envia respostas automáticas.

## 🚀 Funcionalidades

- ✅ Recebe mensagens automaticamente
- ✅ Responde com comandos personalizados
- ✅ Sistema de saudações automáticas
- ✅ Comandos de informação e utilidade
- ✅ Interface visual com QR Code no terminal
- ✅ Logs detalhados de atividades
- 🎤 **NOVO:** Transcrição automática de áudios usando OpenAI Whisper

## 📋 Pré-requisitos

- Node.js versão 18 ou superior
- NPM ou Yarn
- Telefone com WhatsApp instalado
- Conexão com internet

## 🛠️ Instalação

1. **Clone ou baixe o projeto:**
   ```bash
   cd whatsapp-bot
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a transcrição de áudio (opcional):**
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione sua chave da OpenAI: `OPENAI_API_KEY=sk-sua-chave-aqui`
   - Veja instruções detalhadas em `README_AUDIO.md`

4. **Execute o bot:**
   ```bash
   npm start
   ```

## 📱 Como usar

1. **Execute o comando:**
   ```bash
   npm start
   ```

2. **Escaneie o QR Code:**
   - Um QR Code aparecerá no terminal
   - Abra o WhatsApp no seu celular
   - Vá em **Configurações** > **Dispositivos conectados** > **Conectar dispositivo**
   - Escaneie o QR Code que aparece no terminal

3. **Aguarde a conexão:**
   - Quando conectado, verá a mensagem: "🟢 Cliente WhatsApp está pronto e conectado!"

4. **Teste o bot:**
   - Envie uma mensagem para seu próprio número ou peça para alguém enviar
   - Teste os comandos disponíveis

## 🤖 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `!ping` | Testa se o bot está funcionando |
| `!help` ou `!ajuda` | Mostra todos os comandos disponíveis |
| `!info` | Informações sobre o bot |
| `!hora` | Mostra a hora atual |
| `!transcribe` | Informações sobre transcrição de áudio |
| `oi`, `olá`, `hello` | Mensagem de boas-vindas automática |
| 🎤 **Enviar áudio** | **Transcreve automaticamente áudios de voz** |

## 🔧 Personalização

### Adicionar novos comandos

Edite o arquivo `main.js` e adicione novos casos no sistema de respostas automáticas:

```javascript
// Novo comando personalizado
else if (messageBody === '!meucomando') {
    await message.reply('Sua resposta personalizada aqui!');
    console.log('✅ Comando personalizado executado');
}
```

### Habilitar resposta para todas as mensagens

Descomente o bloco no final da função de mensagens em `main.js`:

```javascript
// Resposta padrão para mensagens não reconhecidas
else {
    await message.reply('🤖 Mensagem recebida! Digite *!help* para ver os comandos disponíveis.');
    console.log('✅ Enviada resposta padrão');
}
```

### Personalizar mensagens

Edite as strings de resposta no arquivo `main.js` para personalizar as mensagens do bot.

## 📁 Estrutura do Projeto

```
whatsapp-bot/
├── main.js              # Arquivo principal do bot
├── package.json         # Configurações do projeto
├── package-lock.json    # Lock das dependências
├── README.md           # Este arquivo
└── node_modules/       # Dependências instaladas
```

## ⚠️ Avisos Importantes

1. **Este projeto não é oficial:** whatsapp-web.js é uma biblioteca não oficial
2. **Risco de bloqueio:** O WhatsApp pode bloquear contas que usam bots
3. **Use com responsabilidade:** Não use para spam ou atividades maliciosas
4. **Teste em conta secundária:** Recomendado testar em uma conta que não seja sua principal

## 🛡️ Segurança

- Nunca compartilhe seu QR Code com outras pessoas
- O bot roda localmente na sua máquina
- Não armazena conversas ou dados pessoais
- Mantenha as dependências atualizadas

## 🐛 Solução de Problemas

### Erro de QR Code expirado
- Reinicie o bot com `npm start`
- Um novo QR Code será gerado automaticamente

### Bot não responde
- Verifique se a mensagem está sendo recebida nos logs
- Teste com o comando `!ping`
- Reinicie o bot se necessário

### Erro de dependências
```bash
npm install --force
```

### Problema de versão do Node.js
- Atualize para Node.js 18 ou superior
- Use o [nvm](https://github.com/nvm-sh/nvm) para gerenciar versões

## 📚 Recursos Adicionais

- [Documentação whatsapp-web.js](https://wwebjs.dev/)
- [GitHub do projeto](https://github.com/pedroslopez/whatsapp-web.js)
- [NPM whatsapp-web.js](https://www.npmjs.com/package/whatsapp-web.js)

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido com ❤️ usando whatsapp-web.js** 