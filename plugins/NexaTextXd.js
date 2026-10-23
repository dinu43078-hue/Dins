const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "xnx",
    alias: ["xdl", "xnxxdl", "xx"],
    desc: "Download XNXX video from URL or search",
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
                '🔞 *XNXX DOWNLOADER*\n\n' +
                '❌ Video URL එකක් හෝ search keyword එකක් දෙන්න.\n\n' +
                '*Download:*\n' +
                '`.xnxx https://www.xnxx.com/video-xxxxx/title`\n\n' +
                '*Search:*\n' +
                '`.xnxx milf`'
            );
        }

        const query = q.trim();

        loading = await conn.sendMessage(from, {
            text: '🔞 *XNXX Downloader*\n\n⏳ Processing...\nකරුණාකර රැඳී සිටින්න.'
        }, { quoted: mek });

        // ===================== DIRECT URL DOWNLOAD =====================
        if (query.includes('xnxx.com/video')) {

            const apiUrl = `https://arslan-apis-v2.vercel.app/download/xnxxdl?url=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();

            if (!data?.status || !data?.result?.video?.length) {
                throw new Error(data?.result || 'Video info ලබාගන්න බැරි වුණා. URL එක හරිද බලන්න.');
            }

            const result = data.result;
            const videoInfo = result.video[0];
            const videoUrl = videoInfo.url;
            const sizeStr = videoInfo.size || 'Unknown';
            const title = result.title || 'XNXX Video';

            // Size parse (e.g. "68.5MiB" → MB)
            let sizeMB = 0;
            const match = sizeStr.match(/([\d.]+)\s*(MiB|MB|GiB|GB)/i);
            if (match) {
                sizeMB = parseFloat(match[1]);
                if (/GiB|GB/i.test(match[2])) sizeMB *= 1024;
            }

            // Caption
            const caption =
                `╭━━〔 🔞 XNXX 〕━━╮\n` +
                `┃\n` +
                `┃ 📌 *${title}*\n` +
                `┃ 📦 Size: ${sizeStr}\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━╯\n\n` +
                `⚡ Powered by NEXA System`;

            // 16MB ට වඩා විශාල නම් video විදිහට එවන්න බෑ → document හෝ link
            if (sizeMB > 15) {
                // Try as document first
                try {
                    await conn.sendMessage(from, {
                        document: { url: videoUrl },
                        mimetype: 'video/mp4',
                        fileName: `${title.substring(0, 50).replace(/[^\w\s-]/g, '')}.mp4`,
                        caption: caption + `\n\n⚠️ Size විශාල නිසා *Document* විදිහට එව්වා.`
                    }, { quoted: mek });
                } catch (docErr) {
                    // Document එකත් fail උනොත් link එක එවනවා
                    await conn.sendMessage(from, {
                        text:
                            caption +
                            `\n\n📥 *Direct Download Link:*\n${videoUrl}\n\n` +
                            `⚠️ Video size විශාල නිසා WhatsApp එකට එවන්න බැරි වුණා.\n` +
                            `උඩ link එකෙන් download කරගන්න.`
                    }, { quoted: mek });
                }
            } else {
                // Normal video send
                await conn.sendMessage(from, {
                    video: { url: videoUrl },
                    caption: caption
                }, { quoted: mek });
            }

        // ===================== SEARCH =====================
        } else {
            const apiUrl = `https://arslan-apis-v2.vercel.app/download/xnxx?text=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();

            if (!data?.status || !Array.isArray(data.result) || data.result.length === 0) {
                throw new Error('Results හමු වුණේ නැහැ. වෙනත් keyword එකක් try කරන්න.');
            }

            const results = data.result.slice(0, 8);

            let text = `🔞 *XNXX SEARCH*\n\n🔍 *${query}*\n\n`;

            results.forEach((item, i) => {
                text += `*${i + 1}.* ${item.title}\n🔗 ${item.url}\n\n`;
            });

            text += `📥 Download කරන්න:\n`.xnxx <url>` කියලා යවන්න.`;

            await conn.sendMessage(from, { text }, { quoted: mek });
        }

    } catch (error) {
        console.error('[XNXX ERROR]', error);
        await reply(
            '❌ *XNXX Error*\n\n' +
            '⚠️ ' + (error.message || 'Unknown error') + '\n\n' +
            '🔄 නැවත try කරන්න.'
        );
    } finally {
        if (loading?.key) {
            try {
                await conn.sendMessage(from, { delete: loading.key });
            } catch {}
        }
    }
});
