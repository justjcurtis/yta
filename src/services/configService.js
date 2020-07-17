const configstore = require('configstore')

const generalName = 'ytarc';
const generalDefaults = {
    format: 'mp4',
    res: '720p',
    output: '~/yta/'
}

const monitorName = 'yta'
const monitorDefaults = {};

const ledgerName = 'ledger'
const ledgerDefaults = {};

class ConfigService {
    constructor() {}

    config() {
        return this._getConfig(generalName, generalDefaults)
    }
    monitor() {
        return this._getConfig(monitorName, monitorDefaults)
    }
    ledger() {
        return this._getConfig(ledgerName, ledgerDefaults)
    }

    _getConfig(name, defaults) {
        return new configstore(name, defaults)
    }
}

module.exports = ConfigService;