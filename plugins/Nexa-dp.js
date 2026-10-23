const config = require('../config')
const { cmd } = require('../command')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

cmd({
    pattern: "setpp",
    alias: ["setprofile", "pp", "setdp"],
    desc: "Set bot profile picture (Owner only)",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, {
    from,
    isOwner,
    reply
}) => {
    try {
        // Owner check
        if (!isOwner) {
            return reply(
                '❌ *OWNER ONLY*\n\n' +
                '⚠️ මේ command එක භාවිතා කරන්න පුළුවන් *Owner* ට විතරයි.'
            );
        }

        // Check replied image
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage
            || m.quoted?.message
            || null;

        if (!quoted?.imageMessage) {
            return reply(
                '🖼️ *SET PROFILE PICTURE*\n\n' +
                '❌ කරුණාකර *image* එකකට reply කරලා command එක යවන්න.\n\n' +
                '*උදාහරණ:*\n' +
                'Image එකකට reply කරලා `.setpp`'
            );
        }

        // Download image
        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Update bot profile picture
        await conn.updateProfilePicture(conn.user.id, buffer);

        await reply(
            '✅ *Profile Picture Updated!*\n\n' +
            '🖼️ Bot ගේ profile picture එක සාර්ථකව update කළා.'
        );

    } catch (error) {
        console.error('[SETPP ERROR]', error);
        await reply(
            '❌ *SETPP Error*\n\n' +
            '⚠️ Profile picture update කරන්න බැරි වුණා.\n\n' +
            '🛠️ *Error:* ' + (error.message || 'Unknown error')
        );
    }
});
cmd({
    pattern: "getpp",
    alias: ["getdp", "ppget"],
    desc: "Get profile picture of a user by reply or number",
    category: "utility",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, {
    from,
    sender,
    q,
    reply
}) => {
    try {
        let targetJid = null;

        // 1. Reply කරලා තියෙන user
        if (mek.message?.extendedTextMessage?.contextInfo?.participant) {
            targetJid = mek.message.extendedTextMessage.contextInfo.participant;
        } else if (m.quoted?.sender) {
            targetJid = m.quoted.sender;
        }
        // 2. Number එකක් දුන්නොත්
        else if (q && q.trim()) {
            let number = q.trim().replace(/[^0-9]/g, ''); // digits only

            if (number.length < 8) {
                return reply(
                    '🖼️ *GET PROFILE PICTURE*\n\n' +
                    '❌ Number එක හරිද බලන්න.\n\n' +
                    '*උදාහරණ:*\n' +
                    '`.getpp 94771234567`\n' +
                    '`.getpp 9477xxxxxxx`'
                );
            }

            // Country code නැත්නම් default 94 (Sri Lanka) — ඔයාට ඕනෙ නම් වෙනස් කරගන්න
            if (!number.startsWith('94') && number.length <= 10) {
                number = '94' + number.replace(/^0+/, '');
            }

            targetJid = number + '@s.whatsapp.net';
        }
        // 3. කිසිම දෙයක් නැත්නම් තමන්ගේ
        else {
            targetJid = sender;
        }

        if (!targetJid) {
            return reply(
                '🖼️ *GET PROFILE PICTURE*\n\n' +
                '❌ User එකක් හොයාගන්න බැරි වුණා.\n\n' +
                '*Usage:*\n' +
                '• Message එකකට reply කරලා `.getpp`\n' +
                '• `.getpp 94771234567`\n' +
                '• `.getpp` (තමන්ගේ DP)'
            );
        }

        const userPicUrl = await conn.profilePictureUrl(targetJid, 'image').catch(() => null);

        if (!userPicUrl) {
            return reply(
                '⚠️ *No Profile Picture*\n\n' +
                'ඒ user ට profile picture එකක් නැහැ හෝ privacy settings නිසා බලන්න බෑ.\n\n' +
                `👤 *JID:* ${targetJid}`
            );
        }

        await conn.sendMessage(from, {
            image: { url: userPicUrl },
            caption:
                '╭━━〔 🖼️ PROFILE PICTURE 〕━━╮\n' +
                '┃\n' +
                '┃ ✅ *Profile Picture Found*\n' +
                `┃ 👤 ${targetJid.split('@')[0]}\n` +
                '┃\n' +
                '╰━━━━━━━━━━━━━━━━━━╯\n\n' +
                '⚡ *Powered by NEXA System*'
        }, { quoted: mek });

    } catch (error) {
        console.error('[GETPP ERROR]', error);
        await reply(
            '❌ *GETPP Error*\n\n' +
            '⚠️ Profile picture ගෙන එන්න බැරි වුණා.\n\n' +
            '🛠️ *Error:* ' + (error.message || 'Unknown error')
        );
    }
});
