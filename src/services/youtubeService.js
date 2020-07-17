const ytdl = require('ytdl-core');
const { get_channel_id_and_name } = require('vid_data')
const { getRequest } = require('./requestService')
const ConfigService = require('./configService')
const configService = new ConfigService();
const localStorage = require('../services/localStorage')
const cliProgress = require('cli-progress');
const path = require('path');

const getVideos = async (channelId, n=10) =>{
    if(n < 1){
        n = 1
    }
    if(n > 50){
        n = 50
    }
    let config = configService.config();
    let playlistId = (await(await getRequest(`https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${config.all.key}&part=contentDetails`)).json()).items[0].contentDetails.relatedPlaylists.uploads;
    let videos = await(await getRequest(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${config.all.key}&part=snippet&maxResults=${n}`)).json()
    
    let results = [];
    for(let i = 0; i<videos.items.length; i++){
        let result = {}
        
        result.published = videos.items[i].snippet.publishedAt;
        result.title = videos.items[i].snippet.title;
        result.description = videos.items[i].snippet.description
        result.id = videos.items[i].snippet.resourceId.videoId;

        results.push(result);
    }

    return results;
}

const getChannel = async (url) =>{
    return await get_channel_id_and_name(url);
}

const getVideoInfo = async (url) => {
    return await ytdl.getBasicInfo(url)
}

const getVideoInfoFromId = async (id) =>{
    return await getVideoInfo(`https://www.youtube.com/watch?v=${id}`)
}

const validateVideoUrl = (url) =>{
    return ytdl.validateURL(url)
} 

const getStream = (url, format, start) =>{
    return ytdl(url, {
        format,
        range: {start:start}
    })
}

const downloadVideo = (url, outputDir, silent = false) =>{
    return new Promise(async (resolve, reject)=>{
        let info = await getVideoInfo(url)
        
        outputDir = path.join(outputDir, info.videoDetails.author.name)
        localStorage.ensureDirExists(outputDir)
        let outputPath = path.join(outputDir, `${info.videoDetails.title}.mp4`)

        let format;
        for (let i = 0; i < info.formats.length; i++) {
            if (info.formats[i].itag == 22) {
                format = info.formats[i]
            }
        }

        let first = true
        let start = 0;
        if (localStorage.exists(outputPath)) {
            start = localStorage.fileByteLength(outputPath);
        }

        const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        try {
            let stream = getStream(url, format, start)
            stream.on('error', (error) =>{
                if(`${error}`.includes('Status code: 416')){
                    console.log(`Already downloaded "${info.videoDetails.title}"`)
                }else{
                    console.log(error)
                }
                resolve();
            })
            if(!silent){
                stream.on('progress', (chunkLength, downloaded, total) => {
                    if (first) {
                        progress.start(100, Math.round((start / total + start) * 1000) / 10)
                        first = false
                    } else {
                        progress.update(Math.round((start + downloaded) / (total + start) * 1000) / 10)
                    }
                })
            }
            stream.on('end', () => {
                progress.stop();
                resolve();
            })
            stream.pipe(localStorage.createWriteStream(outputPath, start != 0))
        } catch (error) {
            console.log(error)   
            resolve();
        }

    });
}


module.exports = {
    getVideos,
    getChannel,
    getVideoInfo,
    getVideoInfoFromId,
    validateVideoUrl,
    downloadVideo
}