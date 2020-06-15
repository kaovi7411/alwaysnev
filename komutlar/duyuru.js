const Discord = require('discord.js');

exports.run = (client, message, args) => {

   if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`:warning: Bunu yapabilmek için gerekli yetkiye sahip değilsiniz!`)
  let mesaj = args.slice(0).join(' ');
  message.delete()
if (mesaj.length < 1) return message.reply('Birşeyler yaz.');

    const yaz = new Discord.RichEmbed()
      .setColor('#000000')
      .addField(`DUYURU`, `${mesaj}`)
      .setAuthor(message.author.username)
      .setThumbnail(client.user.avatarURL)
     .setFooter('Always RolePlay', client.user.avatarURL)
    return message.channel.sendEmbed(yaz);
  
};
 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [''],
  permLevel: 4
};

exports.help = {
  name: 'duyuru',
  description: '',
  usage: ''
};