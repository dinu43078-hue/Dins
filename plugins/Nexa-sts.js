const config = require('../config')
const { cmd } = require('../command')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

cmd({
    pattern: "save",
    alias: ["sv", "sav", "send", "එවන්න", "autostatus"],
    desc: "Save / resend quoted image, video or audio",
    category: "utility",
    react: "💾",
    filename: __filename
},
async (conn, mek, m, {
    from,
    reply
}) => {
    try {
        // Check if replied to a message
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage
            || m.quoted?.message
            || null;

        if (!quoted) {
            return reply(
                '💾 *SAVE MEDIA*\n\n' +
                '❌ කරුණාකර image / video / audio message එකකට *reply* කරලා command එක යවන්න.\n\n' +
                '*උදාහරණ:*\n' +
                'Message එකකට reply කරලා `.save` කියලා යවන්න.'
            );
        }

        const mtype = Object.keys(quoted)[0]; // imageMessage, videoMessage, audioMessage...

        if (!['imageMessage', 'videoMessage', 'audioMessage'].includes(mtype)) {
            return reply(
                '❌ *SAVE ERROR*\n\n' +
                '⚠️ Support වෙන්නේ *image*, *video* සහ *audio* messages විතරයි.'
            );
        }

        // Download media
        const stream = await downloadContentFromMessage(
            quoted[mtype],
            mtype.replace('Message', '') // image / video / audio
        );

        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        let messageContent = {};

        switch (mtype) {
            case 'imageMessage':
                messageContent = {
                    image: buffer,
                    caption: quoted.imageMessage?.caption || '',
                    mimetype: quoted.imageMessage?.mimetype || 'image/jpeg'
                };
                break;

            case 'videoMessage':
                messageContent = {
                    video: buffer,
                    caption: quoted.videoMessage?.caption || '',
                    mimetype: quoted.videoMessage?.mimetype || 'video/mp4'
                };
                break;

            case 'audioMessage':
                messageContent = {
                    audio: buffer,
                    mimetype: quoted.audioMessage?.mimetype || 'audio/mp4',
                    ptt: quoted.audioMessage?.ptt || false
                };
                break;
        }

        await conn.sendMessage(from, messageContent, { quoted: mek });

    } catch (error) {
        console.error('[SAVE ERROR]', error);
        await reply(
            '❌ *SAVE ERROR*\n\n' +
            '⚠️ Media එක save කරන්න බැරි වුණා.\n\n' +
            '🛠️ *Error:* ' + (error.message || 'Unknown error')
        );
    }
});
