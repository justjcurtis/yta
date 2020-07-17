const ConfigService = require('../services/configService')
const configService = new ConfigService()
const ArchiveService = require('../services/archiveService')
const archiveService = new ArchiveService();

const rmCommand = (args) =>{
    let monitor = configService.monitor();
    if(args.id){
        let keys = Object.keys(monitor.all)
        for(let i = 0; i<keys.length; i++){
            let channel = monitor.all[keys[i]]
            if(channel.id == args.id){
                monitor.delete(channel.name);
                archiveService.destroyRecord(channel)
                console.log(`Removed channel entry for ${channel.name}`)
                return;
            }
        }
        console.log(`No channel found with id ${args.id}`)
        return;
    }
    if(args.url){
        let keys = Object.keys(monitor.all)
        for(let i = 0; i<keys.length; i++){
            let channel = monitor.all[keys[i]]
            if(channel.url == args.url){
                monitor.delete(channel.name);
                archiveService.destroyRecord(channel)
                console.log(`Removed channel entry for ${channel.name}`)
                return;
            }
        }
        console.log(`No channel found with url ${args.url}`)
        return;
    }
    if(args.nameId){
        if(monitor.all[args.nameId]){
            let channel = monitor.all[args.nameId]
            archiveService.destroyRecord(channel)
            monitor.delete(args.nameId);
            console.log(`Removed channel entry for ${args.nameId}`)
        }else{
            console.log(`No channel found with name ${args.nameId}`)
        }
        return;
    }
}
module.exports = {
    rmCommand
}