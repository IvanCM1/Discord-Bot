const { MessageButton, MessageActionRow } = require('discord-buttons');
const disbut = require('discord-buttons');

module.exports = {
    name: 'menu',
    code: "`menu`, ",
    description: 'Menu',
    usage: "< >",
    aliases: [" "],
      execute(message, args, client) {

    let option = new disbut.MessageMenuOption()
        .setLabel('Your Label')
        .setEmoji('🍔')
        .setValue('menuid')
        .setDescription('Custom Description!')
        
    let select = new disbut.MessageMenu()
        .setID('customid')
        .setPlaceholder('Click me! :D')
        .setMaxValues(1)
        .setMinValues(1)
        .addOption(option)
    
    message.channel.send('Text with menu!', select);




    client.on('clickMenu', async (menu) => {
        if (menu.values[0] === 'menuid') {
          menu.message.channel.send("You want a role!")
          //menu.clicker.user.send('You want role!');
        }
    })





}}


