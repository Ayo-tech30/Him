export default {
    name: 'ping',
    description: 'Check bot response time',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const start = Date.now();
        
        await sock.sendMessage(from, { text: '🏓 Pinging...' });
        
        const ping = Date.now() - start;
        
        const response = `╭━━𖣔 𝗣𝗢𝗡𝗚 𖣔━━╮
│  
│  ⚡ 𝙎𝙥𝙚𝙚𝙙: ${ping}ms
│  ✅ 𝙎𝙩𝙖𝙩𝙪𝙨: 𝙊𝙣𝙡𝙞𝙣𝙚
│  
╰━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { text: response });
    }
};
