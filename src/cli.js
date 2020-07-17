#!/usr/bin/env node

const cli = require('commander')
const { date2str } = require('./helpers/shared')
const ConfigService = require('./services/configService')
const configService = new ConfigService();
let config = configService.config()

const {
    bCommand
} = require('./commands/bCommand')
const {
    cCommand
} = require('./commands/cCommand')
const {
    gCommand
} = require('./commands/gCommand')
const {
    lsCommand
} = require('./commands/lsCommand')
const {
    rCommand
} = require('./commands/rCommand')
const {
    rmCommand
} = require('./commands/rmCommand')
const {
    sCommand
} = require('./commands/sCommand')

cli
    .version('0.0.1')
    .description('yta is a configerable youtube archiver')
cli
    .command('Get <videoUrl>')
    .alias('g')
    .description('Download video with args')
    // .option('-r, --resolution <resolution>', 'Set download resolution if available (defaults to 720p)')
    // .option('-f, --format <format>', 'Set output format of download (defaults to mp4) available formats: (mp4, mp3)')
    .option('-o, --output <output>', 'Set output directory for this download (defaults to ~/yta/ChannelName/)')
    .action(function (videoUrl, args) {
        if(args.output == undefined){
            args.output = config.all.output
        }
        gCommand(videoUrl, args)
    })
cli
    .command('Create/Configer <channelUrl>')
    .alias('c')
    .description('Create or Configer parameters associated with channel to watch for downloads on')
    .option('-min, --min <min>', 'Set a minimum video duration (in minutes) to download (inclusive)')
    .option('-max, --max <max>', 'Set a maximum video duration (in minutes) to download (inclusive)')
    .option('-f, --from <from>', 'Set a earliest date time (inclusive) to download from (defaults to today)')
    .option('-n, --name <nameKeywords>', 'Set csv keywords for video name to contain (any)')
    .option('-d, --description <descriptionKeywords>', 'Set csv keywords for video description to contain (any)')
    .option('-t, --tags <tagsKeywords>', 'Set csv keywords for video tags to contain (any)')
    // .option('-r, --resolution <resolution>', 'Set resolution to downloaded videos at if available (defaults to 720p)')
    // .option('-f, --format <format>', 'Set output format of downloads (defaults to mp4) available formats: (mp4, mp3)')
    .action(function (channelUrl, args) {
        if(args.from != undefined){
            args.from = date2str(new Date(args.from), 'yyyy-MM-dd')
        }
        cCommand(channelUrl, args)
    })
cli
    .command('Remove')
    .alias('rm')
    .description('Remove channels from the monitoring list, lower priority identifiers will be ignored if multiple are provided')
    .option('-n, --nameId <nameId>', 'Remove channel based on name (priority 0)')
    .option('-u, --url <url>', 'Remove channel based on url (priority 1)')
    .option('-i, --id <id>', 'Remove channel based on id (priority 2)')
    .action(function (args) {
        rmCommand(args)
    })
cli
    .command('List')
    .alias('ls')
    .description('List current channel monitor config')
    .action(function (args) {
        lsCommand(args)
    })
cli
    .command('Set')
    .alias('s')
    .description('Set general yta settings, pass no arguments to see current config')
    .option('-k, --key <key>', 'Set Youtube data api key')
    .option('-o, --output <output>', 'Set output directory to put downloaded files in (defaults to ~/yta/ChannelName)')
    .option('-c, --config <config>', 'Set config file location (defaults to ~/.yta)')
    // .option('-r, --resolution <resolution>', 'Set default resolution downloaded videos at if available (defaults to 720p)')
    // .option('-f, --format <format>', 'Set default output format of downloads (defaults to mp4) available formats: (mp4, mp3)')
    .action(function (args) {
        sCommand(args)
    })
cli
    .command('Run')
    .alias('r')
    .description('Run yta for 1 update cycle and then exit after all downloads complete.')
    .option('-p, --progressBarHidden', 'Hides progress bar')
    .action(function (args) {
        rCommand(args)
    })
cli
    .command('Background')
    .alias('b')
    .description('Run yta to update and download until stopped')
    .option('-i, --interval <interval>', 'Set interval in hours for checking youtube for updates (minimum 1 hour, default 24 hours)')
    .action(function (args) {
        bCommand(args)
    })

cli.parse(process.argv)