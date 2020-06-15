const Discord = require('discord.js')
let prefix = '!'
module.exports = client => {
  
  const aktiviteListesi = [
    `${client.users.size} kullanıcıya hizmet veriyoruz!`,
    'Always RolePlay',
    'Always RolePlay',
    'Always RolePlay',
    'Kaovi Tarafından Yapılmıştır',
  ]

  client.user.setStatus('online')
  
  setInterval(() => {
    const Aktivite = Math.floor(Math.random() * (aktiviteListesi.length - 1))
    client.user.setActivity(aktiviteListesi[Aktivite])
  }, 8000)
}