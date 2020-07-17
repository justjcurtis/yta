const youtubeService = require('./youtubeService')
const ConfigService = require('./configService')
const configService = new ConfigService();

const status = [
    'unprocessed',
    'downloading',
    'downloaded',
    'nomatch'
]

class ArchiveService{
    constructor(){

    }
    destroyRecord(channel){
        let ledger = configService.ledger();
        if(ledger.all[channel.id]){
            ledger.delete(channel.id)
            return true;
        }
        return false;
    }

    async hasUpdates(channel){
        let ledger = configService.ledger();
        if(!ledger.all[channel.id]){
            ledger.set(channel.id, {
                done:[],
                queue:[],
                all:[]
            })
        }
        let channelLedger = ledger.all[channel.id];

        for(let i = 0; i< channelLedger.queue.length; i++){
            let video = channelLedger.queue[i];
            if(video.status == status[1]){
                return true
            }
        }

        let latest = await channel.videos(50);

        for(let i = 0; i< latest.length; i++){
            let video = latest[i]
            if(!channelLedger.all.includes(video.id)){
                return true
            }
        };
        
        return false
    }

    async updateChannel(channel){
        let ledger = configService.ledger();
        let latest = await channel.videos(50);

        if(!ledger.all[channel.id]){
            ledger.set(channel.id, {
                done:[],
                queue:[],
                all:[]
            })
        }
        let channelLedger = ledger.all[channel.id];

        let newVideosFound = false;
        latest.forEach(video => {
            if(!channelLedger.all.includes(video.id)){
                newVideosFound = true;
                video.status = status[0];
                !channelLedger.all.push(video.id)
                !channelLedger.queue.push(video)
            }
        });

        let [newChannelLedger, downloadOccured] = await this.processQueue(channelLedger, channel);
        ledger.set(channel.id, newChannelLedger);
        return {downloadOccured, newVideosFound}
    }

    async processQueue(channelLedger, channel){
        let config = configService.config();
        let outputDir = config.all.output;
        
        let downloadTasks = []
        let from = new Date(channel.from)

        for(let i = 0; i< channelLedger.queue.length; i++){
            let video = channelLedger.queue[i];
            if(video.status == status[1]){
                downloadTasks.push(video)
            }
        }

        for(let i = 0; i< channelLedger.queue.length; i++){
            let video = channelLedger.queue[i];
            if(new Date(video.published) < from){
                video.status = status[3];
                continue
            }
            if(channel.nameKeywords){
                let nameKeywords = channel.nameKeywords.split(',');
                let match = false;
                for(let j = 0; j<nameKeywords.length; j++){
                    let keyword = nameKeywords[j];
                    if(video.title.includes(keyword)){
                        match = true;
                        break;
                    }
                }
                if(!match){
                    video.status = status[3];
                    continue;
                }
            }
            if(channel.descriptionKeywords){
                let descriptionKeywords = channel.descriptionKeywords.split(',');
                let match = false;
                for(let j = 0; j<descriptionKeywords.length; j++){
                    let keyword = descriptionKeywords[j];
                    if(video.description.includes(keyword)){
                        match = true;
                        break;
                    }
                }
                if(!match){
                    video.status = status[3];
                    continue;
                }
            }

            let info = await youtubeService.getVideoInfoFromId(video.id)
            let duration = parseInt(info.videoDetails.lengthSeconds)/60
            let tagsString = info.videoDetails.keywords.join();

            if(channel.tagsKeywords){
                let tagsKeywords = channel.tagsKeywords.split(',');
                let match = false;
                for(let j = 0; j<tagsKeywords.length; j++){
                    let keyword = tagsKeywords[j];
                    if(tagsString.includes(keyword)){
                        match = true;
                        break;
                    }
                }
                if(!match){
                    video.status = status[3];
                    continue;
                }
            }
            if(channel.min){
                if(channel.min > duration){
                    video.status = status[3];
                    continue
                }
            }
            if(channel.max){
                if(channel.max < duration){
                    video.status = status[3];
                    continue
                }
            }
            video.url = info.videoDetails.video_url;
            downloadTasks.push(video)
        }
        let downloadOccured = false;
        for(let i = 0; i< downloadTasks.length; i++){
            let video = downloadTasks[i];
            video.status = status[1]
            await youtubeService.downloadVideo(video.url, outputDir, true)
            downloadOccured = true;
            video.status = [2]
            channelLedger.done.push(video)
        }
        for(let i = 0; i< channelLedger.queue.length; i++){
            let video = channelLedger.queue[i];
            if(video.status == status[3]){
                channelLedger.done.push(video)
            }
        }
        channelLedger.queue = []
        return [channelLedger, downloadOccured];
    }
}

module.exports = ArchiveService