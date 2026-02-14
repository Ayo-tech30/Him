import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState, 
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    Browsers
} from '@whiskeysockets/baileys';
import pino from 'pino';
import readline from 'readline';
import { Boom } from '@hapi/boom';
import { db } from './firebase.js';
import { handleMessage } from './handlers/messageHandler.js';

const OWNER_NUMBER = '2349049460676';
const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({ logger });

// Suppress connection errors for Replit
process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    console.log(`
╭━━𖣔 𝗡𝗘𝗫𝗢𝗥𝗔 𖣔━━╮
│  ✦ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚    : 𝗩𝗶𝗼𝗹𝗲𝘁
│  ✦ 𝙊𝙬𝙣𝙚𝙧       : 𝗞𝘆𝗻𝘅
│  ✦ 𝙎𝙩𝙖𝙩𝙪𝙨      : 𝙎𝙩𝙖𝙧𝙩𝙞𝙣𝙜...
│  ✦ 𝘿𝘽           : Firebase 🔥
╰━━━━━━━━━━━━━━━━╯
    `);

    let phoneNumber;
    if (!state.creds.registered) {
        phoneNumber = await question('📱 Enter your WhatsApp number (with country code, no +): ');
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    }

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        browser: Browsers.ubuntu('Chrome'),
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            return { conversation: '' };
        }
    });

    store.bind(sock.ev);

    // Handle pairing code
    if (!sock.authState.creds.registered && phoneNumber) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(`\n🔐 Your Pairing Code: ${code}\n`);
            } catch (err) {
                console.log('Error requesting pairing code:', err);
            }
        }, 3000);
    }

    // Connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('QR Code received, scan it!');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom) 
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;

            if (shouldReconnect) {
                setTimeout(() => startBot(), 3000);
            }
        } else if (connection === 'open') {
            console.log(`
╭━━𖣔 𝗡𝗘𝗫𝗢𝗥𝗔 𖣔━━╮
│  ✦ 𝙎𝙩𝙖𝙩𝙪𝙨      : 𝙊𝙣𝙡𝙞𝙣𝙚 ✓
│  ✦ 𝙋𝙧𝙚𝙛𝙞𝙭      : .
│  ✦ 𝙊𝙬𝙣𝙚𝙧       : ${OWNER_NUMBER}
╰━━━━━━━━━━━━━━━━╯
            `);
        }
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        const msg = messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return;

        // Ignore old messages (prevent responding to old commands after bot restart)
        const messageTimestamp = msg.messageTimestamp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime - messageTimestamp > 60) return; // Ignore messages older than 60 seconds

        await handleMessage(sock, msg);
    });

    // Group updates
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;

        try {
            const groupRef = db.ref(`groups/${id.replace('@g.us', '')}`);
            const groupData = (await groupRef.once('value')).val() || {};

            if (action === 'add' && groupData.welcome) {
                for (const participant of participants) {
                    const text = `╭━━𖣔 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𖣔━━╮
│  
│  👋 Welcome to the group!
│  @${participant.split('@')[0]}
│  
│  📜 Please read the rules
│  🤝 Be respectful to everyone
│  
╰━━━━━━━━━━━━━━━━╯`;

                    await sock.sendMessage(id, { 
                        text, 
                        mentions: [participant] 
                    });
                }
            } else if (action === 'remove' && groupData.goodbye) {
                for (const participant of participants) {
                    const text = `╭━━𖣔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 𖣔━━╮
│  
│  👋 Goodbye!
│  @${participant.split('@')[0]}
│  
│  We'll miss you! 😢
│  
╰━━━━━━━━━━━━━━━━╯`;

                    await sock.sendMessage(id, { 
                        text, 
                        mentions: [participant] 
                    });
                }
            }
        } catch (err) {
            console.log('Error in group update:', err);
        }
    });

    return sock;
}

startBot();
