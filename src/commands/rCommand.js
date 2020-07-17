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
    if(channels.length == 0){
        return;
    }
    let progress;
    if(args.progressBarHidden == undefined){
        progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progress.start(channels.length, 0)
    }
    for(let i = 0; i<channels.length; i++){
        let channel = channels[i]
        console.log(`Checking for updates for ${channel.name} - ${new Date().toLocaleString()}`)
        let { downloadOccured, newVideosFound } = await archiveService.updateChannel(channel)
        console.log(`${newVideosFound ? 'New videos': 'No new videos'} found for ${channel.name}`)
        console.log(`${downloadOccured ? 'New Videos downloaded':'No new videos downloaded'} for ${channel.name}`)
        console.log('')
        if(args.progressBarHidden == undefined){
            progress.update(i+1)
        }
    };

    if(args.progressBarHidden == undefined){
        progress.stop()
    }
}

module.exports = {
    rCommand
}