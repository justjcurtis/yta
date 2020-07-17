const fetch = require("node-fetch");
const { sleep } = require('../helpers/shared')

const getRequest = async (url, headers, attempts, delay,attempt=0) => {
    try {
        let response = await fetch(url, {
            method: 'get',
            headers: headers,
        })
        return response;
    } catch (error) {
        if(attempt < attempt){
            await sleep(delay*1000)
            return await getRequest(path, key, attempt + 1)
        }
        else{
            console.log(`Skipping ${url} after ${attempts} attempts...`)
            return undefined
        }
    }
}

module.exports = {
    getRequest
}