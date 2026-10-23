const config = require('../config')
const { cmd, commands } = require('../command')
const fs = require('fs')
const path = require('path')

cmd({
    pattern: "img",
    alias: ["imagine", "text2img", "aiimg", "draw"],
    desc: "Generate AI Image from text prompt",
    category: "ai",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('❌ *Image AI* ට මොකක් හරි prompt එකක් දෙන්න...\n\nඋදා: `.img a cute cat in space`')

        // Loading message
        const loading = await conn.sendMessage(from, { text: '🎨 *Generating AI Image...*' }, { quoted: mek })

        // API call
        const apiUrl = `https://arslan-apis-v2.vercel.app/ai/text2img?prompt=${encodeURIComponent(q)}`
        const res = await fetch(apiUrl)
        const data = await res.json()

        if (!data.status || !data.result) {
            await conn.sendMessage(from, { delete: loading.key })
            return reply('❌ Image generate වුණේ නැහැ. නැවත try කරන්න.')
        }

        const imageUrl = data.result

        // Image එක යවනවා
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `*┏━━━━━━━━━━━━━━━━┓*
*┃  🎨 ᴀɪ ɪᴍᴀɢᴇ 🎨  ┃*
*┗━━━━━━━━━━━━━━━━┛*

*Prompt:* ${q}

*⚡ Powered by NEXA System*`
        }, { quoted: mek })

        // Loading message එක delete කරනවා
        await conn.sendMessage(from, { delete: loading.key })

    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message}`)
    }
})
