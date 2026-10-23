const config = require('../config')
const { cmd, commands } = require('../command')
const fs = require('fs')
const path = require('path')

cmd({
    pattern: "ai",
    alias: ["metaai", "blackbox", "gpt"],
    desc: "Chat with Meta AI (Blackbox)",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('❌ *blackbox AI* ට මොකක් හරි අහන්න...\n\nඋදා: `.ai Hello`')

        // Loading message
        const loading = await conn.sendMessage(from, { text: '🤖 *blackbox AI* thinking...' }, { quoted: mek })

        // API call
        const apiUrl = `https://arslan-apis-v2.vercel.app/ai/blackbox?q=${encodeURIComponent(q)}`
        const res = await fetch(apiUrl)
        const data = await res.json()

        if (!data.status || !data.result) {
            return reply('❌ blackbox AI response එක ආවේ නැහැ. නැවත try කරන්න.')
        }

        const aiResponse = data.result

        // Local image (alive.jpg)
        const imgPath = path.join(__dirname, 'alive.jpg')

        if (!fs.existsSync(imgPath)) {
            // Image නැත්නම් text විතරක් යවනවා
            await conn.sendMessage(from, {
                text: `*┏━━━━━━━━━━━━━━━━┓*\n*┃   🤖 ᴍᴇᴛᴀ ᴀɪ 🤖   ┃*\n*┗━━━━━━━━━━━━━━━━┛*\n\n${aiResponse}\n\n*⚡ Powered by NEXA*`,
                edit: loading.key
            })
            return
        }

        // Image එකත් එක්ක යවනවා
        await conn.sendMessage(from, {
            image: fs.readFileSync(imgPath),
            caption: `*┏━━━━━━━━━━━━━━━━┓*
*┃   🤖 ᴍᴇᴛᴀ ᴀɪ 🤖   ┃*
*┗━━━━━━━━━━━━━━━━┛*

${aiResponse}

*⚡ Powered by NEXA System*`
        }, { quoted: mek })

        // Loading message එක delete කරනවා
        await conn.sendMessage(from, { delete: loading.key })

    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message}`)
    }
})
