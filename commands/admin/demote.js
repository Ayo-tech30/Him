export default {
    name: 'demote',
    description: 'Demote admin to member',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return await sock.sendMessage(from, { text: '❌ Please mention a user to demote!' });
        }
        
        for (const user of mentioned) {
            await sock.groupParticipantsUpdate(from, [user], 'demote');
        }
        
        await sock.sendMessage(from, { 
            text: `✅ Successfully demoted ${mentioned.length} user(s)!`,
            mentions: mentioned
        });
    }
};
