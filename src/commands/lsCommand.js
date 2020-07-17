const ConfigService = require('../services/configService')
const configService = new ConfigService()

const lsCommand = () =>{
    let monitor = configService.monitor();
    console.log(monitor.all)
}
module.exports = {
    lsCommand
}