const path = require('path')
module.exports = class Command {
    constructor(client, {
        dirname = false,
        filename = false,
        enabled = true,
        aliases = [],
        botPermissions = [],
        owner = false,
    }) {
        let name = filename ? filename.split(path.sep)[filename.split(path.sep).length - 1].replace('.js', "").toLowerCase(): 'Unknown',
            category = dirname ? dirname.split(path.sep)[dirname.split(path.sep).length - 1].toLowerCase() : 'Other';
        this.client = client;
        this.conf = {enabled, aliases, botPermissions, owner};
        this.help = {name, category};
        this.config = require('../../config');

    }
}
