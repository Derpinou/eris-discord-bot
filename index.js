const {Master} = require('eris-sharder'),
    config = require("./config")
const sharder = new Master(config.token, "/src/base/Client.js", {
    stats: true,
    debug: true,
    shards: config.shardCount,
    clusters: config.clusterCount,
    guildsPerShard: config.guildsPerShard,
    name: config.name,
    webhooks: {
        shard: {
            id: config.webhook.shard.id,
            token: config.webhook.shard.token
        },
        cluster: {
            id: config.webhook.cluster.id,
            token: config.webhook.cluster.token
        }
    },
    clientOptions: {
        messageLimit: 150,
        defaultImageFormat: "png"
    }
});
/*
sharder.on("stats", stats => {
    console.log(stats);
});
 */
