const ConfigService = require('../services/configService')
const configService = new ConfigService()
const ArchiveService = require('../services/archiveService')
const archiveService = new ArchiveService()
const cliProgress = require('cli-progress');
const Channel = require('../models/channel')

const rCommand = async (args) =>{
    let monitor = configService.monitor();
    let channels = []
    let keys = Object.keys(monitor.all)
    for(let i = 0; i<keys.length; i++){
        let key = keys[i]
        let channelJson = monitor.all[key];
        channels.push(Channel.fromJson(channelJson))
    };
    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progress.start(channels.length, 0)
    for(let i = 0; i<channels.length; i++){
        let channel = channels[i]
        await archiveService.updateChannel(channel)
        progress.update(i+1)
    };
    progress.stop()
}

module.exports = {
    rCommand
}