export default {
    name: 'promote',
    description: 'Promote user to admin',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return await sock.sendMessage(from, { text: '❌ Please mention a user to promote!' });
        }
        
        for (const user of mentioned) {
            await sock.groupParticipantsUpdate(from, [user], 'promote');
        }
        
        await sock.sendMessage(from, { 
            text: `✅ Successfully promoted ${mentioned.length} user(s)!`,
            mentions: mentioned
        });
    }
};
