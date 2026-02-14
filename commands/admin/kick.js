export default {
    name: 'kick',
    description: 'Kick user from group',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return await sock.sendMessage(from, { text: '❌ Please mention a user to kick!' });
        }
        
        for (const user of mentioned) {
            await sock.groupParticipantsUpdate(from, [user], 'remove');
        }
        
        await sock.sendMessage(from, { text: `✅ Successfully kicked ${mentioned.length} user(s)!` });
    }
};
