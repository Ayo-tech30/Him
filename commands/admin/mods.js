export default {
    name: 'mods',
    description: 'List group moderators and guardians',
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const groupMetadata = await sock.groupMetadata(from);
        const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        
        let text = `╭━━𖣔 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗢𝗥𝗦 𖣔━━╮\n│\n`;
        
        admins.forEach((admin, index) => {
            const role = admin.admin === 'superadmin' ? '👑 Owner' : '🛡️ Admin';
            text += `│  ${index + 1}. ${role}\n│     @${admin.id.split('@')[0]}\n│\n`;
        });
        
        text += `╰━━━━━━━━━━━━━━━━╯\n\n💜 Total: ${admins.length} Moderators`;
        
        await sock.sendMessage(from, { text, mentions: admins.map(a => a.id) });
    }
};
