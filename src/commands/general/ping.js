const Command = require("../../base/Command.js");
module.exports = class Support extends Command {
    constructor(client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            botPermissions: ["sendMessages"]
        });
    }

    async run(message) {
        return message.channel.createMessage("Pong")
    }
}