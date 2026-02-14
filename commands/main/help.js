export default {
    name: 'help',
    description: 'Get help for commands',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const command = args[0];
        
        if (!command) {
            await sock.sendMessage(from, { 
                text: '╭━━𖣔 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 𖣔━━╮\n│\n│  Use .menu to see all commands\n│  Use .help <command> for details\n│\n╰━━━━━━━━━━━━━━━━╯' 
            });
        } else {
            await sock.sendMessage(from, { 
                text: `📖 Help for .${command}\n\nUse .menu to see all available commands!` 
            });
        }
    }
};
