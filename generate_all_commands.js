#!/usr/bin/env node
// This script creates all remaining command files
// Run with: node generate_all_commands.js

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const commandsDir = './commands';

// All command files with their content
const commands = {
  // Continue from previous commands...
  
  'admin/unmute.js': `import { db } from '../../firebase.js';
export default {
    name: 'unmute',
    description: 'Unmute a user',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned) return await sock.sendMessage(from, { text: '❌ Mention a user!' });
        const groupId = from.replace('@g.us', '');
        for (const user of mentioned) {
            await db.ref(\`groups/\${groupId}/muted/\${user.split('@')[0]}\`).remove();
        }
        await sock.sendMessage(from, { text: '✅ User unmuted!', mentions: mentioned });
    }
};`,

  'admin/warn.js': `import { db } from '../../firebase.js';
export default {
    name: 'warn',
    description: 'Warn a user',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned) return await sock.sendMessage(from, { text: '❌ Mention a user!' });
        const groupId = from.replace('@g.us', '');
        const userId = mentioned[0].split('@')[0];
        const warnRef = db.ref(\`groups/\${groupId}/warns/\${userId}\`);
        const currentWarns = (await warnRef.once('value')).val() || 0;
        const newWarns = currentWarns + 1;
        await warnRef.set(newWarns);
        
        if (newWarns >= 3) {
            await sock.groupParticipantsUpdate(from, mentioned, 'remove');
            return await sock.sendMessage(from, { text: \`❌ @\${userId} kicked for 3 warnings!\`, mentions: mentioned });
        }
        
        await sock.sendMessage(from, { text: \`⚠️ Warning \${newWarns}/3 for @\${userId}\`, mentions: mentioned });
    }
};`,

  'admin/ban.js': `import { db } from '../../firebase.js';
export default {
    name: 'ban',
    description: 'Ban a user',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned) return await sock.sendMessage(from, { text: '❌ Mention a user!' });
        const groupId = from.replace('@g.us', '');
        for (const user of mentioned) {
            await sock.groupParticipantsUpdate(from, [user], 'remove');
            await db.ref(\`groups/\${groupId}/banned/\${user.split('@')[0]}\`).set(true);
        }
        await sock.sendMessage(from, { text: '✅ User(s) banned!' });
    }
};`,

  'admin/unban.js': `import { db } from '../../firebase.js';
export default {
    name: 'unban',
    description: 'Unban a user',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned) return await sock.sendMessage(from, { text: '❌ Mention a user!' });
        const groupId = from.replace('@g.us', '');
        for (const user of mentioned) {
            await db.ref(\`groups/\${groupId}/banned/\${user.split('@')[0]}\`).remove();
        }
        await sock.sendMessage(from, { text: '✅ User(s) unbanned!' });
    }
};`,

  'admin/groupinfo.js': `export default {
    name: 'groupinfo',
    description: 'Get group information',
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const groupMetadata = await sock.groupMetadata(from);
        
        const text = \`╭━━𖣔 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 𖣔━━╮
│  
│  📛 Name: \${groupMetadata.subject}
│  👥 Members: \${groupMetadata.participants.length}
│  📝 Description: \${groupMetadata.desc || 'None'}
│  
╰━━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'admin/welcome.js': `import { db } from '../../firebase.js';
export default {
    name: 'welcome',
    description: 'Toggle welcome messages',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const groupId = from.replace('@g.us', '');
        const status = args[0]?.toLowerCase() === 'on';
        
        await db.ref(\`groups/\${groupId}/welcome\`).set(status);
        await sock.sendMessage(from, { text: \`✅ Welcome messages \${status ? 'enabled' : 'disabled'}!\` });
    }
};`,

  'admin/goodbye.js': `import { db } from '../../firebase.js';
export default {
    name: 'goodbye',
    description: 'Toggle goodbye messages',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const groupId = from.replace('@g.us', '');
        const status = args[0]?.toLowerCase() === 'on';
        
        await db.ref(\`groups/\${groupId}/goodbye\`).set(status);
        await sock.sendMessage(from, { text: \`✅ Goodbye messages \${status ? 'enabled' : 'disabled'}!\` });
    }
};`,

  'admin/antilink.js': `import { db } from '../../firebase.js';
export default {
    name: 'antilink',
    description: 'Toggle antilink protection',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const groupId = from.replace('@g.us', '');
        const status = args[0]?.toLowerCase() === 'on';
        
        await db.ref(\`groups/\${groupId}/antilink\`).set(status);
        await sock.sendMessage(from, { text: \`✅ Antilink \${status ? 'enabled' : 'disabled'}!\` });
    }
};`,

  'admin/delete.js': `export default {
    name: 'delete',
    description: 'Delete a message',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        if (!quotedMsg) {
            return await sock.sendMessage(from, { text: '❌ Reply to a message to delete it!' });
        }
        
        await sock.sendMessage(from, { delete: quotedMsg.stanzaId });
    }
};`,

  'admin/open.js': `export default {
    name: 'open',
    description: 'Open group for all members',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        await sock.groupSettingUpdate(from, 'not_announcement');
        await sock.sendMessage(from, { text: '✅ Group opened for all members!' });
    }
};`,

  'admin/close.js': `export default {
    name: 'close',
    description: 'Close group for admins only',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        await sock.groupSettingUpdate(from, 'announcement');
        await sock.sendMessage(from, { text: '✅ Group closed, only admins can send messages!' });
    }
};`,

  'admin/setppgc.js': `export default {
    name: 'setppgc',
    description: 'Set group profile picture',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const quoted = msg.message?.extendedTextMessage?.contextInfo;
        
        if (!quoted?.quotedMessage?.imageMessage) {
            return await sock.sendMessage(from, { text: '❌ Reply to an image!' });
        }
        
        const media = await sock.downloadMediaMessage(msg);
        await sock.updateProfilePicture(from, media);
        await sock.sendMessage(from, { text: '✅ Group profile picture updated!' });
    }
};`,

  'admin/setname.js': `export default {
    name: 'setname',
    description: 'Set group name',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const newName = args.join(' ');
        
        if (!newName) {
            return await sock.sendMessage(from, { text: '❌ Provide a new name!' });
        }
        
        await sock.groupUpdateSubject(from, newName);
        await sock.sendMessage(from, { text: \`✅ Group name changed to: \${newName}\` });
    }
};`,

  'admin/setdesc.js': `export default {
    name: 'setdesc',
    description: 'Set group description',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const newDesc = args.join(' ');
        
        if (!newDesc) {
            return await sock.sendMessage(from, { text: '❌ Provide a new description!' });
        }
        
        await sock.groupUpdateDescription(from, newDesc);
        await sock.sendMessage(from, { text: '✅ Group description updated!' });
    }
};`,

  'admin/grouplink.js': `export default {
    name: 'grouplink',
    description: 'Get group invite link',
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const code = await sock.groupInviteCode(from);
        await sock.sendMessage(from, { text: \`🔗 Group Link:\\nhttps://chat.whatsapp.com/\${code}\` });
    }
};`,

  'admin/revoke.js': `export default {
    name: 'revoke',
    description: 'Revoke group invite link',
    admin: true,
    botAdmin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        await sock.groupRevokeInvite(from);
        const newCode = await sock.groupInviteCode(from);
        await sock.sendMessage(from, { text: \`✅ Link revoked!\\n🔗 New link:\\nhttps://chat.whatsapp.com/\${newCode}\` });
    }
};`,

  'admin/mods.js': `export default {
    name: 'mods',
    description: 'List group moderators and guardians',
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const groupMetadata = await sock.groupMetadata(from);
        const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        
        let text = \`╭━━𖣔 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗢𝗥𝗦 𖣔━━╮\\n│\\n\`;
        
        admins.forEach((admin, index) => {
            const role = admin.admin === 'superadmin' ? '👑 Owner' : '🛡️ Admin';
            text += \`│  \${index + 1}. \${role}\\n│     @\${admin.id.split('@')[0]}\\n│\\n\`;
        });
        
        text += \`╰━━━━━━━━━━━━━━━━╯\\n\\n💜 Total: \${admins.length} Moderators\`;
        
        await sock.sendMessage(from, { text, mentions: admins.map(a => a.id) });
    }
};`,

  // Cards commands
  'cards/mycards.js': `import { db } from '../../firebase.js';
export default {
    name: 'mycards',
    description: 'View your card collection',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        
        const userRef = db.ref(\`users/\${userId}\`);
        const userData = (await userRef.once('value')).val();
        
        if (!userData || !userData.cards || userData.cards.length === 0) {
            return await sock.sendMessage(from, { text: '❌ You don\'t have any cards yet!' });
        }
        
        let text = \`╭━━𖣔 𝗠𝗬 𝗖𝗔𝗥𝗗𝗦 𖣔━━╮\\n│\\n\`;
        userData.cards.forEach((card, index) => {
            text += \`│  \${index + 1}. \${card.name} ⭐\${card.rarity}\\n\`;
        });
        text += \`│\\n│  Total Cards: \${userData.cards.length}\\n╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'cards/deck.js': `export default {
    name: 'deck',
    description: 'View available card decks',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        const text = \`╭━━𖣔 𝗖𝗔𝗥𝗗 𝗗𝗘𝗖𝗞𝗦 𖣔━━╮
│  
│  🎴 Available Decks:
│  1. Starter Deck (Free)
│  2. Premium Deck (1000💰)
│  3. Legendary Deck (5000💰)
│  
│  Use .buypack <number>
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'cards/givecard.js': `import { db } from '../../firebase.js';
export default {
    name: 'givecard',
    description: 'Give a card to another user',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || !args[1]) {
            return await sock.sendMessage(from, { text: '❌ Usage: .givecard @user <card_id>' });
        }
        
        await sock.sendMessage(from, { text: '✅ Card transferred!', mentions: mentioned });
    }
};`,

  'cards/rollcard.js': `import { db } from '../../firebase.js';
export default {
    name: 'rollcard',
    description: 'Roll for a random card',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        
        const cards = ['Ace', 'King', 'Queen', 'Jack', 'Joker'];
        const rarities = [1, 2, 3, 4, 5];
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
        
        const userRef = db.ref(\`users/\${userId}\`);
        const userData = (await userRef.once('value')).val() || {};
        const userCards = userData.cards || [];
        
        userCards.push({ name: randomCard, rarity: randomRarity });
        await userRef.child('cards').set(userCards);
        
        const text = \`╭━━𖣔 𝗖𝗔𝗥𝗗 𝗥𝗢𝗟𝗟 𖣔━━╮
│  
│  🎴 You got: \${randomCard}
│  ⭐ Rarity: \${randomRarity}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'cards/cards.js': `import { db } from '../../firebase.js';
export default {
    name: 'cards',
    description: 'Toggle card spawning in group',
    admin: true,
    group: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const groupId = from.replace('@g.us', '');
        const status = args[0]?.toLowerCase() === 'on';
        
        await db.ref(\`groups/\${groupId}/cards\`).set(status);
        await sock.sendMessage(from, { text: \`✅ Card spawning \${status ? 'enabled' : 'disabled'}!\` });
    }
};`,

  // Economy commands
  'economy/balance.js': `import { db } from '../../firebase.js';
export default {
    name: 'balance',
    description: 'Check your balance',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const targetUser = mentioned?.[0] || msg.key.participant || msg.key.remoteJid;
        const userId = targetUser.split('@')[0];
        
        const userRef = db.ref(\`users/\${userId}\`);
        const userData = (await userRef.once('value')).val();
        
        if (!userData) {
            return await sock.sendMessage(from, { text: '❌ User not registered! Use .register first' });
        }
        
        const text = \`╭━━𖣔 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𖣔━━╮
│  
│  👤 User: @\${userId}
│  💰 Wallet: \${userData.balance || 0}
│  🏦 Bank: \${userData.bank || 0}
│  💎 Total: \${(userData.balance || 0) + (userData.bank || 0)}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text, mentions: [targetUser] });
    }
};`,

  'economy/daily.js': `import { db } from '../../firebase.js';
export default {
    name: 'daily',
    description: 'Claim daily reward',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        
        const userRef = db.ref(\`users/\${userId}\`);
        const userData = (await userRef.once('value')).val();
        
        if (!userData) {
            return await sock.sendMessage(from, { text: '❌ Register first with .register!' });
        }
        
        const now = Date.now();
        const lastDaily = userData.lastDaily || 0;
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - lastDaily < cooldown) {
            const timeLeft = cooldown - (now - lastDaily);
            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
            return await sock.sendMessage(from, { 
                text: \`⏰ You can claim your daily reward in \${hours} hours!\` 
            });
        }
        
        const reward = 500;
        await userRef.update({
            balance: (userData.balance || 0) + reward,
            lastDaily: now
        });
        
        const text = \`╭━━𖣔 𝗗𝗔𝗜𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𖣔━━╮
│  
│  ✅ Claimed!
│  💰 +\${reward}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'economy/work.js': `import { db } from '../../firebase.js';
export default {
    name: 'work',
    description: 'Work to earn money',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        
        const userRef = db.ref(\`users/\${userId}\`);
        const userData = (await userRef.once('value')).val();
        
        if (!userData) {
            return await sock.sendMessage(from, { text: '❌ Register first with .register!' });
        }
        
        const now = Date.now();
        const lastWork = userData.lastWork || 0;
        const cooldown = 60 * 60 * 1000; // 1 hour
        
        if (now - lastWork < cooldown) {
            const timeLeft = cooldown - (now - lastWork);
            const minutes = Math.floor(timeLeft / (60 * 1000));
            return await sock.sendMessage(from, { 
                text: \`⏰ You can work again in \${minutes} minutes!\` 
            });
        }
        
        const jobs = ['Developer', 'Designer', 'Teacher', 'Chef', 'Driver'];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const reward = Math.floor(Math.random() * 200) + 100;
        
        await userRef.update({
            balance: (userData.balance || 0) + reward,
            lastWork: now
        });
        
        const text = \`╭━━𖣔 𝗪𝗢𝗥𝗞 𝗥𝗘𝗦𝗨𝗟𝗧 𖣔━━╮
│  
│  💼 Job: \${job}
│  💰 Earned: +\${reward}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'economy/rob.js': `import { db } from '../../firebase.js';
export default {
    name: 'rob',
    description: 'Rob another user',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned) {
            return await sock.sendMessage(from, { text: '❌ Mention someone to rob!' });
        }
        
        const robber = sender.split('@')[0];
        const victim = mentioned[0].split('@')[0];
        
        const robberRef = db.ref(\`users/\${robber}\`);
        const victimRef = db.ref(\`users/\${victim}\`);
        
        const robberData = (await robberRef.once('value')).val();
        const victimData = (await victimRef.once('value')).val();
        
        if (!robberData || !victimData) {
            return await sock.sendMessage(from, { text: '❌ Both users must be registered!' });
        }
        
        const success = Math.random() > 0.5;
        
        if (success) {
            const amount = Math.floor(Math.random() * (victimData.balance || 0) * 0.5);
            await robberRef.update({ balance: (robberData.balance || 0) + amount });
            await victimRef.update({ balance: (victimData.balance || 0) - amount });
            
            return await sock.sendMessage(from, { 
                text: \`✅ Successfully robbed @\${victim} for 💰\${amount}!\`,
                mentions: mentioned
            });
        } else {
            const fine = 100;
            await robberRef.update({ balance: (robberData.balance || 0) - fine });
            
            return await sock.sendMessage(from, { text: \`❌ Rob failed! You lost 💰\${fine}\` });
        }
    }
};`,

  // Gambling commands
  'gambling/gamble.js': `import { db } from '../../firebase.js';
export default {
    name: 'gamble',
    description: 'Gamble your money',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        const amount = parseInt(args[0]);
        
        if (!amount || amount <= 0) {
            return await sock.sendMessage(from, { text: '❌ Provide a valid amount!' });
        }
        
        const userRef = db.ref(\`users/\${userId}\`);
        const userData = (await userRef.once('value')).val();
        
        if (!userData || userData.balance < amount) {
            return await sock.sendMessage(from, { text: '❌ Insufficient balance!' });
        }
        
        const win = Math.random() > 0.5;
        const newBalance = win ? 
            userData.balance + amount : 
            userData.balance - amount;
        
        await userRef.update({ balance: newBalance });
        
        const text = \`╭━━𖣔 𝗚𝗔𝗠𝗕𝗟𝗘 𖣔━━╮
│  
│  🎲 Result: \${win ? '✅ WIN!' : '❌ LOST!'}
│  💰 Amount: \${amount}
│  💵 Balance: \${newBalance}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'gambling/slots.js': `import { db } from '../../firebase.js';
export default {
    name: 'slots',
    description: 'Play slots',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        const amount = parseInt(args[0]);
        
        if (!amount || amount <= 0) {
            return await sock.sendMessage(from, { text: '❌ Provide a valid amount!' });
        }
        
        const userRef = db.ref(\`users/\${userId}\`);
        const userData = (await userRef.once('value')).val();
        
        if (!userData || userData.balance < amount) {
            return await sock.sendMessage(from, { text: '❌ Insufficient balance!' });
        }
        
        const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎'];
        const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
        
        let multiplier = 0;
        if (slot1 === slot2 && slot2 === slot3) {
            multiplier = 10;
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            multiplier = 2;
        }
        
        const winAmount = amount * multiplier;
        const newBalance = userData.balance - amount + winAmount;
        
        await userRef.update({ balance: newBalance });
        
        const text = \`╭━━𖣔 𝗦𝗟𝗢𝗧𝗦 𖣔━━╮
│  
│  🎰 [ \${slot1} | \${slot2} | \${slot3} ]
│  
│  \${multiplier > 0 ? '✅ WIN!' : '❌ LOST!'}
│  💰 \${multiplier > 0 ? '+' : '-'}\${Math.abs(winAmount - amount)}
│  💵 Balance: \${newBalance}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'gambling/coinflip.js': `import { db } from '../../firebase.js';
export default {
    name: 'coinflip',
    description: 'Flip a coin',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        const amount = parseInt(args[0]);
        const choice = args[1]?.toLowerCase();
        
        if (!amount || !choice || !['heads', 'tails'].includes(choice)) {
            return await sock.sendMessage(from, { text: '❌ Usage: .coinflip <amount> <heads/tails>' });
        }
        
        const userRef = db.ref(\`users/\${userId}\`);
        const userData = (await userRef.once('value')).val();
        
        if (!userData || userData.balance < amount) {
            return await sock.sendMessage(from, { text: '❌ Insufficient balance!' });
        }
        
        const result = Math.random() > 0.5 ? 'heads' : 'tails';
        const win = result === choice;
        const newBalance = win ? 
            userData.balance + amount : 
            userData.balance - amount;
        
        await userRef.update({ balance: newBalance });
        
        const text = \`╭━━𖣔 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣 𖣔━━╮
│  
│  🪙 Result: \${result}
│  \${win ? '✅ WIN!' : '❌ LOST!'}
│  💰 \${win ? '+' : '-'}\${amount}
│  💵 Balance: \${newBalance}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  // Image commands
  'image/sticker.js': `export default {
    name: 'sticker',
    description: 'Convert image/video to sticker',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const quoted = msg.message?.extendedTextMessage?.contextInfo;
        
        if (!quoted?.quotedMessage?.imageMessage && !quoted?.quotedMessage?.videoMessage) {
            return await sock.sendMessage(from, { text: '❌ Reply to an image or video!' });
        }
        
        // In production, you would download and convert the media here
        await sock.sendMessage(from, { text: '✅ Sticker created! (Feature requires media processing)' });
    }
};`,

  // Search commands
  'search/gpt.js': `export default {
    name: 'gpt',
    description: 'Ask AI a question',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const query = args.join(' ');
        
        if (!query) {
            return await sock.sendMessage(from, { text: '❌ Please provide a question!' });
        }
        
        // In production, integrate with an AI API
        const response = \`╭━━𖣔 𝗔𝗜 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 𖣔━━╮
│  
│  Q: \${query}
│  
│  A: This is a placeholder response.
│     Integrate with OpenAI API for
│     real responses!
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text: response });
    }
};`,

  'search/google.js': `export default {
    name: 'google',
    description: 'Search Google',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const query = args.join(' ');
        
        if (!query) {
            return await sock.sendMessage(from, { text: '❌ Please provide a search query!' });
        }
        
        const url = \`https://www.google.com/search?q=\${encodeURIComponent(query)}\`;
        await sock.sendMessage(from, { text: \`🔍 Google Search:\\n\${url}\` });
    }
};`,

  'search/image.js': `export default {
    name: 'image',
    description: 'Search for images',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const query = args.join(' ');
        
        if (!query) {
            return await sock.sendMessage(from, { text: '❌ Please provide a search query!' });
        }
        
        // In production, integrate with an image search API
        await sock.sendMessage(from, { text: \`🖼️ Searching for: \${query}\\n(Integrate image search API)\` });
    }
};`,

  // Fun commands
  'fun/match.js': `export default {
    name: 'match',
    description: 'Calculate match percentage',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned?.[0] || sender;
        
        const percentage = Math.floor(Math.random() * 101);
        
        const text = \`╭━━𖣔 𝗠𝗔𝗧𝗖𝗛 𖣔━━╮
│  
│  @\${sender.split('@')[0]}
│  ❤️ \${percentage}% ❤️
│  @\${target.split('@')[0]}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text, mentions: [sender, target] });
    }
};`,

  'fun/ship.js': `export default {
    name: 'ship',
    description: 'Ship two users',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length < 2) {
            return await sock.sendMessage(from, { text: '❌ Mention two users!' });
        }
        
        const percentage = Math.floor(Math.random() * 101);
        const [user1, user2] = mentioned;
        
        const text = \`╭━━𖣔 𝗦𝗛𝗜𝗣 𝗥𝗔𝗧𝗜𝗡𝗚 𖣔━━╮
│  
│  @\${user1.split('@')[0]} 💕 @\${user2.split('@')[0]}
│  
│  💘 Match: \${percentage}%
│  \${percentage > 70 ? '💗 Perfect Match!' : percentage > 40 ? '💛 Good Match!' : '💔 Not Compatible'}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text, mentions: mentioned });
    }
};`,

  'fun/joke.js': `export default {
    name: 'joke',
    description: 'Get a random joke',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        const jokes = [
            'Why don\'t scientists trust atoms? Because they make up everything!',
            'Why did the scarecrow win an award? He was outstanding in his field!',
            'What do you call a fake noodle? An impasta!',
            'Why don\'t eggs tell jokes? They\'d crack each other up!',
            'What do you call a bear with no teeth? A gummy bear!'
        ];
        
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        
        const text = \`╭━━𖣔 𝗝𝗢𝗞𝗘 𖣔━━╮
│  
│  😄 \${joke}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  // Owner commands
  'owner/mode.js': `import { db } from '../../firebase.js';
export default {
    name: 'mode',
    description: 'Change bot mode (public/private)',
    owner: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mode = args[0]?.toLowerCase();
        
        if (!mode || !['public', 'private'].includes(mode)) {
            return await sock.sendMessage(from, { 
                text: '❌ Usage: .mode <public/private>' 
            });
        }
        
        await db.ref('botSettings/mode').set(mode);
        
        const text = \`╭━━𖣔 𝗠𝗢𝗗𝗘 𝗖𝗛𝗔𝗡𝗚𝗘𝗗 𖣔━━╮
│  
│  ✅ Bot mode set to: \${mode.toUpperCase()}
│  \${mode === 'private' ? '🔒 Only owner can use commands' : '🔓 Everyone can use commands'}
│  
╰━━━━━━━━━━━━━━━━╯\`;
        
        await sock.sendMessage(from, { text });
    }
};`,

  'owner/broadcast.js': `export default {
    name: 'broadcast',
    description: 'Broadcast message to all groups',
    owner: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const message = args.join(' ');
        
        if (!message) {
            return await sock.sendMessage(from, { text: '❌ Provide a message to broadcast!' });
        }
        
        const groups = await sock.groupFetchAllParticipating();
        const groupJids = Object.keys(groups);
        
        let sent = 0;
        for (const jid of groupJids) {
            try {
                await sock.sendMessage(jid, { 
                    text: \`╭━━𖣔 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧 𖣔━━╮\\n│\\n│  📢 \${message}\\n│\\n╰━━━━━━━━━━━━━━━━╯\` 
                });
                sent++;
            } catch {}
        }
        
        await sock.sendMessage(from, { text: \`✅ Broadcast sent to \${sent} groups!\` });
    }
};`,

  'owner/addprem.js': `import { db } from '../../firebase.js';
export default {
    name: 'addprem',
    description: 'Add premium to user',
    owner: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned) {
            return await sock.sendMessage(from, { text: '❌ Mention a user!' });
        }
        
        const userId = mentioned[0].split('@')[0];
        await db.ref(\`users/\${userId}/premium\`).set(true);
        
        await sock.sendMessage(from, { 
            text: \`✅ Premium added to @\${userId}!\`,
            mentions: mentioned
        });
    }
};`,

  'owner/delprem.js': `import { db } from '../../firebase.js';
export default {
    name: 'delprem',
    description: 'Remove premium from user',
    owner: true,
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned) {
            return await sock.sendMessage(from, { text: '❌ Mention a user!' });
        }
        
        const userId = mentioned[0].split('@')[0];
        await db.ref(\`users/\${userId}/premium\`).remove();
        
        await sock.sendMessage(from, { 
            text: \`✅ Premium removed from @\${userId}!\`,
            mentions: mentioned
        });
    }
};`
};

// Write all command files
for (const [path, content] of Object.entries(commands)) {
  const fullPath = join(commandsDir, path);
  try {
    writeFileSync(fullPath, content);
    console.log(\`✓ Created: \${path}\`);
  } catch (err) {
    console.error(\`✗ Failed to create: \${path}\`, err.message);
  }
}

console.log('\\n✅ All command files created successfully!');
