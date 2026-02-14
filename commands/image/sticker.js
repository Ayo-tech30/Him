export default {
    name: 'sticker',
    description: 'Create sticker',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { text: '🖼️ Sticker command!' });
    }
};
