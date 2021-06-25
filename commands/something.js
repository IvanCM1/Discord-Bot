module.exports = {
    name: "test",
    description: "Gives a list of all the commands or information about a specific command",
    usage: "<command name>",
    code: "`help`, ",
    aliases: ["command", "commands", "info"],
    execute(message, args){

        message.channel.send(args)

    }}