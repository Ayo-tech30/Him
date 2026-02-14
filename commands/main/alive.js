export default {
    name: 'alive',
    description: 'Check if bot is alive',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const text = `╭━━𖣔 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 𖣔━━╮
│  
│  ✅ 𝗦𝘁𝗮𝘁𝘂𝘀: 𝗢𝗻𝗹𝗶𝗻𝗲
│  ⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours}h ${minutes}m
│  🤖 𝗡𝗮𝗺𝗲: 𝗩𝗶𝗼𝗹𝗲𝘁
│  👑 𝗢𝘄𝗻𝗲𝗿: 𝗞𝘆𝗻𝘅
│  
╰━━━━━━━━━━━━━━━━╯`;
        
        await sock.sendMessage(from, { text });
    }
};
