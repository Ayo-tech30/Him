import { db } from '../../firebase.js';
export default {
    name: 'profile',
    description: 'View user profile',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const targetUser = mentioned?.[0] || msg.key.participant || msg.key.remoteJid;
        const userId = targetUser.split('@')[0];
        
        const userRef = db.ref(`users/${userId}`);
        const userData = (await userRef.once('value')).val();
        
        if (!userData) {
            return await sock.sendMessage(from, { text: '❌ User not registered! Use .register first' });
        }
        
        const text = `╭━━𖣔 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𖣔━━╮
│  
│  👤 User: @${userId}
│  💰 Balance: ${userData.balance || 0}
│  🏦 Bank: ${userData.bank || 0}
│  📊 Level: ${userData.level || 1}
│  ⭐ XP: ${userData.exp || 0}
│  🎴 Cards: ${userData.cards?.length || 0}
│  
╰━━━━━━━━━━━━━━━━╯`;
        
        await sock.sendMessage(from, { text, mentions: [targetUser] });
    }
};
