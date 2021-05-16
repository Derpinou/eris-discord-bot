const Eris = require('eris'),
    {Base} = require('eris-sharder'),
    path = require("path"),
    {readdir} = require('fs');

class Derpinou extends Base {
    constructor(bot) {
        super(bot);
        this.bot.config = require('../../config');
        this.bot.commands = new Eris.Collection();
        this.bot.aliases = new Eris.Collection();
    }
    async launch() {
        this.eventLoader()
        this.commandLoader();
    }
    commandLoader() {
        readdir("./src/commands/", (err, content) => {
            if (err) console.log(err);
            if (content.length < 1) return console.log('Please create folder in "commands" folder.');
            let groups = [];
            content.forEach(element => {
                if (!element.includes('.')) groups.push(element);
            });
            groups.forEach(folder => {
                readdir("./src/commands/" + folder, (e, files) => {
                    let js_files = files.filter(f => f.split(".").pop() === "js");
                    if (js_files.length < 1) return console.log('Please create files in "' + folder + '" folder.');
                    if (e) console.log(e);
                    js_files.forEach(element => {
                        const response = this.cmdLoad('../commands/' + folder, `${element}`);
                        if (response) console.log(response);
                    });
                });
            });
        });
    }
    cmdLoad(commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this.bot);
            console.log(`Loading Command: ${props.help.name}.`, "log");
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this.bot);
            }
            this.bot.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.bot.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }
    //event loader by https://github.com/zechaos031 ( https://github.com/zechaos031/ZacianLogs/blob/8049ce93926f116da2c769ee121e01c0622aae57/src/Base/Client.js#L71 )
    eventLoader() {
        readdir("./src/events", (err, files) => {
            if (!files) return;
            if (err) console.log(err);
            for (const dir of files) {
                readdir(`./src/events/${dir}`, (err, file) => {
                    if (!file) return;
                    if (err) console.log(err);
                    for (const evt of file) {
                        try {
                            if (!evt) return;
                            require("fs").readFile(__dirname + `/../src/events/${dir}/${evt}`, 'utf8' , async(err, data) => {
                                const event = await new (require(`../src/events/${dir}/${evt}`))(this.bot);
                                if (err) {
                                    console.error(err)
                                    return
                                }
                                console.log(`${evt} loaded`);
                                var ar = data.match(/run\((.*?)\)/);
                                if(ar[1] === "") event.run();
                                else this.bot.on(evt.split(".")[0], (...args) => event.run(...args));
                            })
                        } catch (e) {
                            console.log(e)
                            this.bot.emit("error", `${evt} isn't loaded ${e.stack}`)
                        }
                    }
                })
            }
        });
        return this;
    }
}
module.exports = Derpinou;
