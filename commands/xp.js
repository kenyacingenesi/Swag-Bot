const Discord = require('discord.js');

module.exports = {
    name: 'xp',
    aliases: ['level'],
    description: 'displays info about user xps and their current level',
    usage: 'xp',
    execute(client, api, config, message, args, con) {
        let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

        console.log(target);
        console.log(target.username);
        
        con.query(`SELECT * FROM xp WHERE id = '${target.id}'`, (err, rows) => {
            if (err) {
                throw err;
            }

            if (!rows[0]) {
                return message.channel.send(`${target.username} has no XP on record.`);
            }

            let xp = rows[0].xp;
            let level = Math.floor(xp / config.levelXP);
            let needXP = (level + 1) * config.levelXP - xp;

            let info = new Discord.RichEmbed()
                .setTitle('Swag-bot\'s XP System')
                .setAuthor(`${target.username}`)
                .setColor(0x800080)
                .setThumbnail(`${message.author.displayAvatarURL}`)
                .addField('Current XP', xp, true)
                .addField('Current Level', level, true)
                .addField('XP needed for next level', needXP, true)
                .setFooter(`${target.username}`, `${message.author.displayAvatarURL}`);

            if (level >= config.VIP) {
                info.setColor(0xFFD700).setAuthor(`**VIP ${target.username}**`);
            }
            
            message.channel.send(info);
        });
    },
};