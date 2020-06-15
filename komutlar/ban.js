const Discord = require('discord.js');

exports.run = (client, message, args) => {
  if (!message.guild) {
  let embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setTimestamp()
  .setFooter('Kaovi', client.user.avatarURL)
  .setAuthor(message.author.username, message.author.avatarURL)
  .addTitle('`ban` adlı komutu özel mesajlarda kullanamazsın.')
  return message.author.sendEmbed(embed)
}
  var reason = args[1]
  var user = args[0]
  if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('Banlama yetkiniz yok.')
  if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.reply('Banlama yetkim yok.')
  if (reason.length < 1) return message.reply('Banlama sebebini yazmalısın.')
  if (!args[0]) return message.reply('Kimi banlayacağını yazmalısın.')
  if (!message.guild.member(user).bannable) return message.reply('Yetkilileri banlayamazsın.')
  user = message.guild.members.find(x => x.id === user)
  if (!user) return
  message.guild.ban(user);
  
  const embed2 = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setDescription(`İşlem başarılı!`)
  message.channel.send(embed2)
    

  let embed3 = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle('» Sunucudan Yasaklama')
    .addField('Yasaklanan:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('Yasaklayan:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Yasaklama sebebi:', reason)
    .setFooter('Kaovi Sistem', client.user.avatarURL)
    .setTimestamp()
    message.channel.send(embed3)
    user.send(embed3)
  
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ban'],
  permLevel: 0
};

exports.help = {
  name: 'ban',
  description: 'Bans a user',
  usage: 'ban [kullanıcıid] [sebep]'
};