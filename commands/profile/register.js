import { db } from '../../firebase.js';
export default {
    name: 'register',
    description: 'Register your profile',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        
        const userRef = db.ref(`users/${userId}`);
        const userData = (await userRef.once('value')).val();
        
        if (userData) {
            return await sock.sendMessage(from, { text: '❌ You are already registered!' });
        }
        
        await userRef.set({
            registered: true,
            balance: 1000,
            bank: 0,
            level: 1,
            exp: 0,
            cards: [],
            achievements: [],
            registeredAt: Date.now()
        });
        
        const text = `╭━━𖣔 𝗥𝗘𝗚𝗜𝗦𝗧𝗘𝗥𝗘𝗗 𖣔━━╮
│  
│  ✅ Successfully registered!
│  💰 Starting balance: 1000
│  📊 Level: 1
│  
╰━━━━━━━━━━━━━━━━╯`;
        
        await sock.sendMessage(from, { text });
    }
};
