export default {
    name: 'tagall',
    description: 'Tag all group members',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const message = args.join(' ') || 'Important announcement!';
        
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants.map(p => p.id);
        
        let text = `╭━━𖣔 𝙂𝙍𝙊𝙐𝙋 𝙏𝘼𝙂 𖣔━━╮
│                       
│  📢 𝘼𝙉𝙉𝙊𝙐𝙉𝘾𝙀𝙈𝙀𝙉𝙏
│  
│  💬 𝙈𝙚𝙨𝙨𝙖𝙜𝙚:
│  ${message}
│
╰━━━━━━━━━━━━━━━━━━━╯

👥 𝙏𝘼𝙂𝙂𝙀𝘿 𝙈𝙀𝙈𝘽𝙀𝙍𝙎
━━━━━━━━━━━━━━━\n`;

        participants.forEach((user, index) => {
            text += `᯽ @${user.split('@')[0]}\n`;
        });
        
        text += `━━━━━━━━━━━━━━━\n\n💜 𝙏𝙤𝙩𝙖𝙡: ${participants.length} 𝙈𝙚𝙢𝙗𝙚𝙧𝙨 𝙏𝙖𝙜𝙜𝙚𝙙`;
        
        await sock.sendMessage(from, { text, mentions: participants });
    }
};
