module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(oldMessage, newMessage) {
        if (!newMessage) return undefined
        this.client.emit("messageCreate")
    }
}