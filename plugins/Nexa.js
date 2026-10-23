const config = require('../config')
const { cmd, commands } = require('../command')
const fs = require('fs')
const path = require('path')

cmd({
    pattern: "alive",
    alias: ["bot", "online", "runtime"],
    desc: "Check if bot is alive.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const uptime = process.uptime()
        const hours = Math.floor(uptime / 3600)
        const minutes = Math.floor((uptime % 3600) / 60)
        const seconds = Math.floor(uptime % 60)
        const runtime = `${hours}h ${minutes}m ${seconds}s`

        // Image path - plugin එක තියෙන folder එකේ alive.jpg දාන්න
        const imgPath = path.join(__dirname, 'alive.jpg')

        if (!fs.existsSync(imgPath)) {
            return reply('❌ *alive.jpg* image එක හොයාගන්න බෑ!\n\nPlugin එක තියෙන folder එකට `alive.jpg` කියලා image එක දාන්න.')
        }

        await conn.sendMessage(from, {
            image: fs.readFileSync(imgPath),
            caption: `*┏━━━━━━━━━━━━━━━━┓*
*┃   ⚡ ɴᴇxᴀ ʙᴏᴛ ⚡   ┃*
*┗━━━━━━━━━━━━━━━━┛*

*✅ Status     :* Online
*⏱️ Runtime    :* ${runtime}
*👑 Owner      :* NEXA
*⚡ Powered    :* NEXA System

*┌──────────────────┐*
*│  Where Worlds Connect  │*
*└──────────────────┘*`
        }, { quoted: mek })

    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
