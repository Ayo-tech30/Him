const OWNER_NUMBER = '2349049460676@s.whatsapp.net';

export function isOwner(jid) {
    return jid === OWNER_NUMBER || jid.split('@')[0] === '2349049460676';
}

export async function isAdmin(sock, groupJid, userJid) {
    try {
        const groupMetadata = await sock.groupMetadata(groupJid);
        const participant = groupMetadata.participants.find(p => p.id === userJid);
        return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
    } catch {
        return false;
    }
}

export async function isBotAdmin(sock, groupJid) {
    try {
        const groupMetadata = await sock.groupMetadata(groupJid);
        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const participant = groupMetadata.participants.find(p => p.id === botJid);
        return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
    } catch {
        return false;
    }
}

export async function getGroupAdmins(sock, groupJid) {
    try {
        const groupMetadata = await sock.groupMetadata(groupJid);
        return groupMetadata.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id);
    } catch {
        return [];
    }
}
