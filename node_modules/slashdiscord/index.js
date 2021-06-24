module.exports = class SlashDiscord {
    constructor(client) {
        if (!client || typeof client !== 'object') throw new SyntaxError("A client is required to initiate SlashDiscord.");
        if (!client.guilds || typeof client !== 'object') throw new TypeError("The client provided is not a valid client.");
        if (!client.api || typeof client.api !== 'function') throw new TypeError("The client provided is not a valid client. The API part is missing, which is the most curcial part for SlashDiscord.");
        this.client = client;
    }

    async createCommand(obj) {
        if (!obj) throw new SyntaxError("You need to input an object to create a command.");
        if (typeof obj !== 'object') throw new TypeError("The value input is not an object.");
        if (!obj.name) throw new TypeError("The object input is not a valid object. Please look at the readme to see an example.");
        if (obj.options && (!obj.name || !obj.type || !obj.required)) throw new TypeError("The object input is not a valid object. Please look at the readme to see an example.");
        try {
            return new Promise(resolve => {this.client.api.applications[this.client.user.id].commands.post({data: obj}).then(res => {return resolve(res)})});
        } catch (error) {
            console.error(error);
            return new Promise(resolve => {return resolve(error)});
        }
    }

    deleteCommand(cmd) {
        if (!cmd) throw new SyntaxError("You need to input a command name or command id to delete it.");
        if (typeof cmd !== 'string') throw new TypeError("The command input needs to be a string.");
        client.api.applications[client.user.id].commands.get().then(res => {
            if (!res.find(CMD => CMD.id === cmd || CMD.name === cmd)) throw new Error("Command can't be found.")
            client.api.applications[client.user.id].commands[cmdID].delete().catch(err => console.error(error));
        });
    }

    async quickCreateCommand(name, description) {
        if (!name) throw new SyntaxError("A name is required to quickly create a command.");
        if (!description) throw new SyntaxError("A description is required to quickly create a command.");
        if (typeof name !== 'string') throw new TypeError("The name needs to be a string.");
        if (typeof description !== 'string') throw new TypeError("The description needs to be a string.");
        try {
            return new Promise(resolve => {this.client.api.applications[this.client.user.id].commands.post({data: {name: name, description: description}}).then(res => {return resolve(res)})});
        } catch (error) {
            console.error(error);
            return new Promise(resolve => {return resolve(error)});
        }
    }

    sendMessage(d, {msg = "", embeds = [], tts = false, allowedMentions = []} = {}) {
        if (typeof msg !== 'string') throw new TypeError("The message must be a string.");
        if (typeof embeds !== 'array') throw new TypeError("The embeds must be inside an array.");
        if (typeof tts !== 'boolean') throw new TypeError("The Text-To-Speech must be a boolean.");
        if (typeof allowedMentions !== 'array') throw new TypeError("The allowed mentions must be an array.");
        if (msg.length+embeds.length === 0) throw new SyntaxError(`You can't send an empty message!`);
        client.api.interactions[d.id][d.token].callback.post({
            data: {
                type: 4,
                data: {
                    tts: tts,
                    content: msg,
                    embeds: embeds,
                    allowed_mentions: allowedMentions
                }
            }
        });
    }

    async fetchCommand(cmd) {
        if (!cmd) throw new SyntaxError("The command must be a command or id.");
        if (typeof cmd !== 'string') throw new TypeError("The command input must be a string.");
        return new Promise(resolve => {
            this.client.api.applications[this.client.user.id].commands.get().then(res => {
                if (cmd === '*') return resolve(res);
                else return resolve(res.find(CMD => CMD.id === cmd || CMD.name === cmd));
            });
        });
    }
}