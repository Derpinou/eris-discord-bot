module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        let startAt = Date.now()
        //Si le message ne provient pas d'un serveur
        if (message.channel.type === 'dm') return;
        //Si l'autheur du message est un bot
        if (message.author.bot) return;

        let data = {};

        data.config = this.client.config;

        data.prefix = this.client.config.prefix

        this.client.data = data

        data.embed = {
            color: this.client.config.embed.color,
        }

        const prefixMention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if (message.content.match(prefixMention)) {
            return message.channel.createMessage('pong`');
        }


        if (message.content.indexOf(data.prefix) !== 0) return;

        const args = message.content.slice(data.prefix.length).trim().split(/ +/g);

        const command = args.shift().toLowerCase();

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

        if (!cmd) return;

        let neededPermission = [];
        let botMember = message.channel.guild.members.get(this.client.user.id)
        cmd.conf.botPermissions.forEach(perm => {
            if (!botMember.permission.has(perm)) neededPermission.push(perm);
        });
        let arr = [];
        if (neededPermission.length > 0) {
            neededPermission.forEach(p => {
                arr.push(`\`${p}\``)
            })
            return message.channel.createMessage(`I need following command to execute this command :${arr.map(p => p).join(', ')}`);
        }

        if (!cmd.conf.enabled) return message.channel.createMessage(`This command are disabled`);

        if (cmd.conf.owner && !this.client.config.owner.includes(message.author.id)) return undefined

        data.cmd = cmd;

        console.log(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name} in the server ${message.channel.guild.id}`);



        cmd.run(message, args, data)


    }
}