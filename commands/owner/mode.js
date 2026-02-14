import { db } from '../../firebase.js';
export default {
    name: 'mode',
    description: 'Change bot mode (public/private)',
    owner: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mode = args[0]?.toLowerCase();
        
        if (!mode || !['public', 'private'].includes(mode)) {
            return await sock.sendMessage(from, { text: '❌ Usage: .mode <public/private>' });
        }
        
        await db.ref('botSettings/mode').set(mode);
        
        const text = `╭━━𖣔 𝗠𝗢𝗗𝗘 𝗖𝗛𝗔𝗡𝗚𝗘𝗗 𖣔━━╮
│  
│  ✅ Bot mode set to: ${mode.toUpperCase()}
│  ${mode === 'private' ? '🔒 Only owner can use commands' : '🔓 Everyone can use commands'}
│  
╰━━━━━━━━━━━━━━━━╯`;
        
        await sock.sendMessage(from, { text });
    }
};
