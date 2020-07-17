const expandHomeDir = require('expand-home-dir')

const date2str = (x, y) => {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function resolvePath(path) {
    return expandHomeDir(path);
}

module.exports = {
    date2str,
    sleep,
    resolvePath
}