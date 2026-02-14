export default {
    name: '${cmd}',
    description: 'Gambling command',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { text: '🎰 ${cmd} command!' });
    }
};
