const youtubeService = require('../services/youtubeService');

class Channel {
    constructor(url){
        this.url = url
    }
    static fromJson = (json) =>{
        let ch = new Channel(json.url)
        ch.name = json.name,
        ch.id = json.id,
        ch.min = json.min,
        ch.max = json.max,
        ch.from = json.from,
        ch.nameKeywords = json.nameKeywords,
        ch.descriptionKeywords = json.descriptionKeywords,
        ch.tagsKeywords = json.tagsKeywords
        return ch
    }
    toJson = () =>{
        return {
            url:this.url,
            name:this.name,
            id:this.id,
            min:this.min,
            max:this.max,
            from:this.from,
            nameKeywords:this.nameKeywords,
            descriptionKeywords:this.descriptionKeywords,
            tagsKeywords:this.tagsKeywords
        }
    }
    init = async ({min, max, from, nameKeywords, descriptionKeywords, tagsKeywords}) =>{
        let channelInfo = await youtubeService.getChannel(this.url);
        this.name = this.name == undefined ? channelInfo.channel_name : this.name;
        this.id = this.id == undefined ? channelInfo.channel_id : this.id;
        this.min = this.min == undefined ? min : this.min;
        this.max = this.max == undefined ? max : this.max;
        this.from = this.from == undefined ? from : this.from;
        this.nameKeywords = this.nameKeywords == undefined ? nameKeywords : this.nameKeywords;
        this.descriptionKeywords = this.descriptionKeywords == undefined ? descriptionKeywords : this.descriptionKeywords;
        this.tagsKeywords = this.tagsKeywords == undefined ? tagsKeywords : this.tagsKeywords;
        if(min==''){
            delete this.min
        }
        if(max==''){
            delete this.max
        }
        if(from==''){
            delete this.from
        }
        if(nameKeywords==''){
            delete this.nameKeywords
        }
        if(descriptionKeywords==''){
            delete this.descriptionKeywords
        }
        if(tagsKeywords==''){
            delete this.tagsKeywords
        }
    }
    videos = async(n) =>{
        return await youtubeService.getVideos(this.id, n);
    }
}

module.exports = Channel