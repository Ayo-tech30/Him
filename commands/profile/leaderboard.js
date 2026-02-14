import { db } from '../../firebase.js';
export default {
    name: 'leaderboard',
    description: 'View leaderboard',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        const usersRef = db.ref('users');
        const snapshot = await usersRef.once('value');
        const users = snapshot.val() || {};
        
        const leaderboard = Object.entries(users)
            .sort(([,a], [,b]) => (b.balance + b.bank) - (a.balance + a.bank))
            .slice(0, 10);
        
        let text = `╭━━𖣔 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗 𖣔━━╮\n│\n`;
        
        leaderboard.forEach(([userId, data], index) => {
            const total = (data.balance || 0) + (data.bank || 0);
            text += `│  ${index + 1}. @${userId}\n│     💰 ${total}\n│\n`;
        });
        
        text += `╰━━━━━━━━━━━━━━━━╯`;
        
        const mentions = leaderboard.map(([userId]) => userId + '@s.whatsapp.net');
        
        await sock.sendMessage(from, { text, mentions });
    }
};
