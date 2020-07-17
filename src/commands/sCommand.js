const ConfigService = require('../services/configService')
const configService = new ConfigService()
const localStorage = require('../services/localStorage')

const sCommand = (args) =>{
    let config = configService.config();
    let none = true;
    if(args.key){
        none = false
        let keyReg = /^\S{28}-\S{10}$/
        if(keyReg.test(args.key)){
            if(args.key == config.all.key){
                console.log(`${args.key} is already set`)
            }else{
                if(config.all.key != undefined){
                    console.log(`Overwriting previous key (${config.all.key}) with new key (${args.key})`)
                }
                config.set('key', args.key)
            }
        }else{
            console.log('Invalid api key provided')
        }
    }
    if(args.output){
        none = false
        if(localStorage.isDirectory(args.output)){
            localStorage.ensureDirExists(args.output)
            config.all.output = args.output
            console.log(`Output directory set to ${args.output}`)
        }else{
            console.log('Invalid output path provided')
        }
    }
    if(args.config){
        none = false
        if(localStorage.isFile(args.config)){
            localStorage.ensureFileExists('{}', args.config)
            config.all.config = args.config
            console.log(`Config file set to ${args.config}`)
        }else{
            console.log('Invalid config path provided')
        }
    }

    if(none){
        console.log(config.all)
    }
    config.set(config.all)
}
module.exports = {
    sCommand
}
