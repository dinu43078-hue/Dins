const config = require('../config')
const { cmd } = require('../command')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
const { Sticker, StickerTypes } = require('wa-sticker-formatter')

cmd({
    pattern: "sticker",
    alias: ["s", "stiker", "stick"],
    desc: "Convert image or video to sticker",
    category: "convert",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, {
    from,
    reply
}) => {
    try {
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage
            || m.quoted?.message
            || null;

        // Direct message හෝ quoted message
        const imageMsg = mek.message?.imageMessage || quoted?.imageMessage;
        const videoMsg = mek.message?.videoMessage || quoted?.videoMessage;

        if (!imageMsg && !videoMsg) {
            return reply(
                '🎨 *STICKER MAKER*\n\n' +
                '❌ කරුණාකර *image* හෝ *video* එකකට reply කරන්න.\n\n' +
                '*Usage:*\n' +
                '• Image/Video එකකට reply → `.sticker`\n' +
                '• හෝ image/video එකක් යවලා caption එකේ `.s`'
            );
        }

        let buffer;

        if (imageMsg) {
            const mediaMsg = { message: { imageMessage: imageMsg } };
            buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
        } else if (videoMsg) {
            if (videoMsg.seconds > 10) {
                return reply(
                    '❌ *Video Too Long*\n\n' +
                    '⚠️ Video එක *10 seconds* ට අඩු විය යුතුයි.'
                );
            }
            const mediaMsg = { message: { videoMessage: videoMsg } };
            buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
        }

        const sticker = new Sticker(buffer, {
            pack: 'NEXA System',
            author: 'NEXA Stickers',
            type: StickerTypes.FULL,
            quality: 50
        });

        const stickerBuffer = await sticker.toBuffer();

        await conn.sendMessage(from, {
            sticker: stickerBuffer
        }, { quoted: mek });

    } catch (error) {
        console.error('[STICKER ERROR]', error);
        await reply(
            '❌ *Sticker Error*\n\n' +
            '⚠️ Sticker එක හදන්න බැරි වුණා.\n\n' +
            '🛠️ *Error:* ' + (error.message || 'Unknown error')
        );
    }
});
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
    pattern: "toimg",
    alias: ["toimage", "sticker2img"],
    desc: "Convert sticker to image",
    category: "convert",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, {
    from,
    reply
}) => {
    try {
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage
            || m.quoted?.message
            || null;

        const stickerMsg = quoted?.stickerMessage;

        if (!stickerMsg) {
            return reply(
                '🖼️ *STICKER TO IMAGE*\n\n' +
                '❌ කරුණාකර *sticker* එකකට reply කරලා command එක යවන්න.\n\n' +
                '*Usage:* Reply to sticker → `.toimg`'
            );
        }

        const buffer = await downloadMediaMessage(
            { message: { stickerMessage: stickerMsg } },
            'buffer',
            {}
        );

        await conn.sendMessage(from, {
            image: buffer,
            caption:
                '╭━━〔 🖼️ TO IMAGE 〕━━╮\n' +
                '┃\n' +
                '┃ ✅ *Converted Successfully*\n' +
                '┃\n' +
                '╰━━━━━━━━━━━━━━━━━━╯\n\n' +
                '⚡ *Powered by NEXA System*'
        }, { quoted: mek });

    } catch (error) {
        console.error('[TOIMG ERROR]', error);
        await reply(
            '❌ *ToImage Error*\n\n' +
            '⚠️ Sticker එක image එකට convert කරන්න බැරි වුණා.\n\n' +
            '🛠️ *Error:* ' + (error.message || 'Unknown error')
        );
    }
});


cmd({
    pattern: "dp",
    alias: ["getpp", "getdp", "pp", "profilepic"],
    desc: "Download WhatsApp profile picture by number",
    category: "utility",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {
    let loading;

    try {
        if (!q || !q.trim()) {
            return reply(
                '🖼️ *WHATSAPP DP DOWNLOADER*\n\n' +
                '❌ කරුණාකර WhatsApp number එකක් ලබා දෙන්න.\n\n' +
                '*උදාහරණ:*\n' +
                '`.dp 94771234567`\n' +
                '`.dp 0771234567`\n' +
                '`.dp 9477xxxxxxx`'
            );
        }

        // Number clean කරනවා (digits only)
        let number = q.trim().replace(/[^0-9]/g, '');

        if (number.length < 8 || number.length > 15) {
            return reply(
                '❌ *Invalid Number*\n\n' +
                '⚠️ Number එක හරිද බලන්න.\n\n' +
                '*උදාහරණ:* `.dp 94771234567`'
            );
        }

        // 0 එකෙන් පටන් ගත්තොත් 94 add කරනවා (Sri Lanka)
        if (number.startsWith('0')) {
            number = '94' + number.slice(1);
        }

        // Country code නැත්නම් default 94
        if (number.length <= 10) {
            number = '94' + number;
        }

        const targetJid = number + '@s.whatsapp.net';

        loading = await conn.sendMessage(from, {
            text: '🖼️ *DP Downloader*\n\n' +
                  `⏳ ${number} ගේ profile picture ගෙන එමින් පවතී...\n` +
                  'කරුණාකර මොහොතක් රැඳී සිටින්න.'
        }, { quoted: mek });

        // Check number WhatsApp එකේ තියෙනවද
        const [result] = await conn.onWhatsApp(targetJid).catch(() => []);
        if (!result?.exists) {
            throw new Error('මේ number එක WhatsApp එකේ register වෙලා නැහැ.');
        }

        // Profile picture URL ගන්නවා
        const ppUrl = await conn.profilePictureUrl(targetJid, 'image').catch(() => null);

        if (!ppUrl) {
            throw new Error('Profile picture එකක් නැහැ හෝ privacy settings නිසා බලන්න බෑ.');
        }

        // DP එක එවනවා
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption:
                '╭━━〔 🖼️ PROFILE PICTURE 〕━━╮\n' +
                '┃\n' +
                `┃ 📱 *Number:* +${number}\n` +
                '┃ ✅ *Downloaded Successfully*\n' +
                '┃\n' +
                '╰━━━━━━━━━━━━━━━━━━╯\n\n' +
                '⚡ *Powered by NEXA System*'
        }, { quoted: mek });

    } catch (error) {
        console.error('[DP DOWNLOAD ERROR]', error);
        await reply(
            '❌ *DP Download Error*\n\n' +
            '⚠️ ' + (error.message || 'Unknown error') + '\n\n' +
            '🔄 කරුණාකර නැවත උත්සාහ කරන්න.'
        );
    } finally {
        if (loading?.key) {
            try {
                await conn.sendMessage(from, { delete: loading.key });
            } catch (e) {
                console.log('[LOADING DELETE ERROR]', e.message);
            }
        }
    }
});
