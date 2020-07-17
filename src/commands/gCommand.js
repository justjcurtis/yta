const youtubeService = require('../services/youtubeService')
const localStorage = require('../services/localStorage')

const gCommand = async (videoUrl, args) => {
    if (!youtubeService.validateVideoUrl(videoUrl)) {
        console.log('Invalid video url provided')
        return;
    }
    if (args.output) {
        localStorage.ensureDirExists(args.output);
    }

    await youtubeService.downloadVideo(videoUrl, args.output);

}
module.exports = {
    gCommand
}