const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "img",
    alias: ["imagine", "text2img", "aiimg", "draw"],
    desc: "Generate AI Image from text prompt",
    category: "ai",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {
    let loading;

    try {
        // Check prompt
        if (!q || !q.trim()) {
            return reply(
                '🎨 *AI IMAGE GENERATOR*\n\n' +
                '❌ කරුණාකර image එක සඳහා prompt එකක් ලබා දෙන්න.\n\n' +
                '*උදාහරණය:*\n' +
                '`.img a cute cat in space`\n\n' +
                '*තවත් උදාහරණයක්:*\n' +
                '`.img a futuristic black and gold sports car, 4K ultra realistic`'
            );
        }

        // Loading message
        loading = await conn.sendMessage(
            from,
            {
                text: '🎨 *AI Image Generator*\n\n' +
                      '⏳ ඔයාගේ image එක generate කරමින් පවතී...\n' +
                      '✨ කරුණාකර මොහොතක් රැඳී සිටින්න.'
            },
            { quoted: mek }
        );

        // API URL
        const apiUrl =
            'https://arslan-apis-v2.vercel.app/ai/text2img?prompt=' +
            encodeURIComponent(q.trim());

        // API request
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(
                'API request failed. HTTP status: ' + response.status
            );
        }

        const data = await response.json();

        // Validate API response
        if (!data || !data.status || !data.result) {
            throw new Error(
                data && data.message
                    ? data.message
                    : 'API එකෙන් image URL එකක් ලැබුණේ නැහැ.'
            );
        }

        const imageUrl = data.result;

        // Send generated image
        await conn.sendMessage(
            from,
            {
                image: { url: imageUrl },
                caption:
                    '╭━━〔 🎨 AI IMAGE 〕━━╮\n' +
                    '┃\n' +
                    '┃ ✨ *Image Generated Successfully!*\n' +
                    '┃\n' +
                    '╰━━━━━━━━━━━━━━━━━━╯\n\n' +
                    '📝 *Prompt:*\n' +
                    q.trim() +
                    '\n\n' +
                    '⚡ *Powered by NEXA System*'
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('[AI IMAGE ERROR]', error);

        await reply(
            '❌ *AI Image Generator Error*\n\n' +
            '⚠️ Image එක generate කරන්න බැරි වුණා.\n\n' +
            '🔄 කරුණාකර නැවත උත්සාහ කරන්න.\n\n' +
            '🛠️ *Error:* ' +
            (error.message || 'Unknown error')
        );

    } finally {
        // Delete loading message
        if (loading && loading.key) {
            try {
                await conn.sendMessage(
                    from,
                    { delete: loading.key }
                );
            } catch (deleteError) {
                console.log(
                    '[LOADING DELETE ERROR]',
                    deleteError.message
                );
            }
        }
    }
});
