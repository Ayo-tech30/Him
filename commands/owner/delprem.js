export default {
    name: '${cmd}',
    description: 'Owner command',
    owner: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { text: '👑 ${cmd} command!' });
    }
};
