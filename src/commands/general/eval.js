const Command = require("../../base/Command.js");
module.exports = class Cmd extends Command {
    constructor(client) {
        super(client, {
            dirname: __dirname,
            filename: __filename,
            owner: true
        });
    }
    async run(message, args, data) {
        const content = message.content.split(' ').slice(1).join(' '),
            result = new Promise((resolve, reject) => resolve(eval(content)));
        return result.then(output => {
            if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
            if (output.includes(this.client.token)) output = output.replace(this.client.config.token, 'T0K3N');
            return message.channel.createMessage({content: `\`\`\`${output}\`\`\``})
        }).catch(err => {
            err = err.toString();
            return message.channel.createMessage({content: `\`\`\`${err}\`\`\``})
        });
    }
}