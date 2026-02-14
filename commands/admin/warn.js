export default {
    name: '${cmd}',
    description: 'Admin command',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { text: '✅ ${cmd} command executed!' });
    }
};
