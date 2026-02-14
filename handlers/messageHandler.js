import { db } from '../firebase.js';
import { commands } from '../commands/index.js';
import { isAdmin, isBotAdmin, isOwner } from '../utils/permissions.js';

const PREFIX = '.';
const OWNER_NUMBER = '2349049460676';

export async function handleMessage(sock, msg) {
    try {
        const messageType = Object.keys(msg.message)[0];
        let body = '';

        if (messageType === 'conversation') {
            body = msg.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            body = msg.message.extendedTextMessage.text;
        } else if (messageType === 'imageMessage') {
            body = msg.message.imageMessage.caption || '';
        } else if (messageType === 'videoMessage') {
            body = msg.message.videoMessage.caption || '';
        }

        if (!body.startsWith(PREFIX)) return;

        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Get bot mode
        const botRef = db.ref('botSettings/mode');
        const mode = (await botRef.once('value')).val() || 'public';

        // Check if bot is in private mode and user is not owner
        if (mode === 'private' && !isOwner(sender) && commandName !== 'mode') {
            return;
        }

        // Check if command exists
        const command = commands[commandName];
        if (!command) return;

        // Check permissions
        if (command.owner && !isOwner(sender)) {
            return await sock.sendMessage(from, { 
                text: '❌ This command is only for the bot owner!' 
            });
        }

        if (command.admin && isGroup) {
            const adminStatus = await isAdmin(sock, from, sender);
            if (!adminStatus) {
                return await sock.sendMessage(from, { 
                    text: '❌ This command is only for group admins!' 
                });
            }
        }

        if (command.botAdmin && isGroup) {
            const botAdminStatus = await isBotAdmin(sock, from);
            if (!botAdminStatus) {
                return await sock.sendMessage(from, { 
                    text: '❌ I need to be an admin to use this command!' 
                });
            }
        }

        if (command.group && !isGroup) {
            return await sock.sendMessage(from, { 
                text: '❌ This command can only be used in groups!' 
            });
        }

        // Execute command
        await command.execute(sock, msg, args);

    } catch (error) {
        console.log('Error in message handler:', error);
    }
}
