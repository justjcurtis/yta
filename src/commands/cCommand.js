const ConfigService = require('../services/configService');
const ArchiveService = require('../services/archiveService')
const Channel = require('../models/channel');

const cCommand = async (channelUrl, args) =>{
    const configService = new ConfigService();
    const archiveService = new ArchiveService();
    let monitor = configService.monitor();

    let opts = {
        min:args.min,
        max:args.max,
        from:args.from,
        nameKeywords:args.nameKeywords,
        description:args.descriptionKeywords,
        tagsKeywords:args.tagsKeywords
    }

    let ch;
    let keys = Object.keys(monitor.all)
    for(let i = 0; i<keys.length; i++){
        let channel = monitor.all[keys[i]]
        if(channel.url == channelUrl){
            ch = Channel.fromJson(channel)
        }
    }

    if(ch == undefined){
        ch = new Channel(channelUrl)
        if(args.from == undefined){
            console.log('un')
            args.from = new Date().toJSON().slice(0, 10)
            opts.from = args.from
        }
        await ch.init(opts);
    }else{
        if(args.min){
            ch.min = args.min                
        }
        if(args.max){
            ch.max = args.max            
        }
        if(args.from){
            ch.from = args.from
        }
        if(args.nameKeywords){
            ch.nameKeywords = args.nameKeywords
        }
        if(args.descriptionKeywords){
            ch.descriptionKeywords = args.descriptionKeywords
        }
        if(args.tagsKeywords){
            ch.tagsKeywords = args.tagsKeywords
        }
    }
    console.log(ch)
    archiveService.destroyRecord(ch);
    monitor.set(ch.name, ch.toJson());
}
module.exports = {
    cCommand
}