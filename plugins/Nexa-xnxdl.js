const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "xnxx",
    alias: ["xdl", "xnxxdl", "xx"],
    desc: "Search & Download XNXX videos",
    category: "download",
    react: "🔞",
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
                '🔞 *XNXX SEARCH & DOWNLOAD*\n\n' +
                '❌ කරුණාකර search keyword එකක් හෝ video URL එකක් ලබා දෙන්න.\n\n' +
                '*උදාහරණ (Search):*\n' +
                '`.xnxx milf`\n' +
                '`.xnxx japanese`\n\n' +
                '*උදාහරණ (Download):*\n' +
                '`.xnxx https://www.xnxx.com/video-xxxxx/title`'
            );
        }

        const query = q.trim();

        // Loading message
        loading = await conn.sendMessage(from, {
            text: '🔞 *XNXX Downloader*\n\n' +
                  '⏳ කරුණාකර මොහොතක් රැඳී සිටින්න...\n' +
                  '🔍 Searching / Downloading...'
        }, { quoted: mek });

        // ========== CASE 1: Direct Video URL ==========
        if (query.includes('xnxx.com/video-') || query.includes('xnxx.com/video/')) {
            const apiUrl = `https://arslan-apis-v2.vercel.app/download/xnxxdl?url=${encodeURIComponent(query)}`;

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API failed. Status: ${response.status}`);

            const data = await response.json();

            if (!data?.status || !data?.result?.video?.length) {
                throw new Error(data?.result || 'Video download info ලබා ගන්න බැරි වුණා.');
            }

            const result = data.result;
            const videoUrl = result.video[0].url;          // lowest quality (smaller size)
            const size = result.video[0].size || 'Unknown';

            await conn.sendMessage(from, {
                video: { url: videoUrl },
                caption:
                    '╭━━〔 🔞 XNXX DOWNLOAD 〕━━╮\n' +
                    '┃\n' +
                    `┃ 📌 *Title:* ${result.title || 'N/A'}\n` +
                    `┃ 📦 *Size:* ${size}\n` +
                    '┃\n' +
                    '╰━━━━━━━━━━━━━━━━━━╯\n\n' +
                    '⚡ *Powered by NEXA System*'
            }, { quoted: mek });

        // ========== CASE 2: Search by Keyword ==========
        } else {
            const apiUrl = `https://arslan-apis-v2.vercel.app/download/xnxx?text=${encodeURIComponent(query)}`;

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API failed. Status: ${response.status}`);

            const data = await response.json();

            if (!data?.status || !Array.isArray(data.result) || data.result.length === 0) {
                throw new Error('Search results හමු වුණේ නැහැ. වෙනත් keyword එකක් try කරන්න.');
            }

            // Top 10 results only
            const results = data.result.slice(0, 10);

            let text = `🔞 *XNXX SEARCH RESULTS*\n\n` +
                       `🔍 *Query:* ${query}\n` +
                       `📌 *Results:* ${results.length}\n\n`;

            results.forEach((item, i) => {
                text += `*${i + 1}.* ${item.title}\n` +
                        `🔗 ${item.url}\n\n`;
            });

            text += `📥 *Download කරන්න:*\n` +
                    `URL එක copy කරලා \`.xnxx <url>\` කියලා යවන්න.`;

            await conn.sendMessage(from, { text }, { quoted: mek });
        }

    } catch (error) {
        console.error('[XNXX ERROR]', error);

        await reply(
            '❌ *XNXX Error*\n\n' +
            '⚠️ යම්කිසි දෝෂයක් ඇති වුණා.\n\n' +
            '🔄 කරුණාකර නැවත උත්සාහ කරන්න.\n\n' +
            '🛠️ *Error:* ' + (error.message || 'Unknown error')
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
