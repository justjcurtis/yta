const ConfigService = require('../services/configService')
const configService = new ConfigService()
const ArchiveService = require('../services/archiveService')
const archiveService = new ArchiveService()
const cliProgress = require('cli-progress');
const Channel = require('../models/channel')
const { sleep } = require('../helpers/shared')

const bCommand = async (args) =>{
    if(args.interval == undefined){
        args.interval = 1000*60*60*24
    }
    const interval = args.interval < 1 ? 1000*60*60*2 : Math.round(1000*60*60*args.interval)
    while(true){
        let now = new Date().toLocaleString();
        let monitor = configService.monitor();
        let channels = []
        let keys = Object.keys(monitor.all)
        for(let i = 0; i<keys.length; i++){
            let key = keys[i]
            let channelJson = monitor.all[key];
            channels.push(Channel.fromJson(channelJson))
        };
        let update = false;
        for(let i = 0; i<channels.length; i++){
            let channel = channels[i]
            if(!update){
                update = await archiveService.hasUpdates(channel)
            }
        };

        if(update){
            console.log(`${now} - Updating...`)
            let progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            progress.start(channels.length, 0)
            for(let i = 0; i<channels.length; i++){
                let channel = channels[i]
                await archiveService.updateChannel(channel)
                progress.update(i+1)
            };
            progress.stop()
        }else{
            console.log(`${now} - No updates found`)
        }

        await sleep(interval)
    }
}
module.exports = {
    bCommand
}