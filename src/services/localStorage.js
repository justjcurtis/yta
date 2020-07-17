const fs = require('fs')
const path = require('path')
const {
    resolvePath
} = require('../helpers/shared')

const getFilesInFolder = async (dir) => {
    dir = resolvePath(dir);
    return new Promise((resolve, reject) => {
        fs.readdir(dir, function (err, files) {
            //handling error
            if (err) {
                reject('failed to scan dir')
            }
            let paths = [];
            //listing all files using forEach
            files.forEach(function (file) {
                paths.push(npath.join(dir, file));
            });
            resolve(paths)
        });
    });
}

const readFile = (_path) => {
    _path = resolvePath(_path)
    let raw = fs.readFileSync(_path, {
        encoding: 'utf-8'
    });
    return raw
}

const readJson = (_path) => {
    let raw = readFile(_path);
    try {
        return JSON.parse(raw);
    } catch (error) {
        return undefined
    }
}

const readFileAsync = async (_path) => {
    _path = resolvePath(_path)
    return new Promise((resolve, reject) => {
        fs.readFile(_path, {
            encoding: 'utf-8'
        }, (err, data) => {
            resolve(data)
        });
    });
}

const writeFile = (data, _path) => {
    _path = resolvePath(_path)
    fs.writeFileSync(_path, data)
}

const ensureFileExists = (defaultContent, _path) => {
    _path = resolvePath(_path);
    if (!fs.existsSync(_path)) {
        writeFile(defaultContent, _path)
    }
}
const ensureDirExists = (dir) => {
    dir = resolvePath(dir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, true);
    }
}

const exists = (_path) => {
    _path = resolvePath(_path)
    return fs.existsSync(_path)
}

const isDirectory = (_path) => {
    _path = resolvePath(_path)
    return fs.lstatSync(_path).isDirectory()
}

const isFile = (_path) => {
    _path = resolvePath(_path)
    return fs.lstatSync(dir).isFile()
}

const createWriteStream = (_path, append = false) => {
    _path = resolvePath(_path)
    let opts = {
        flags: 'w',
        encoding: null,
        mode: 0666
    }
    if(append){
        opts.flags = 'a'
    }
    return fs.createWriteStream(_path, opts)
}

const fileByteLength = (_path) => {
    _path = resolvePath(_path)
    return fs.statSync(_path).size;
}

module.exports = {
    ensureFileExists,
    ensureDirExists,
    exists,
    isDirectory,
    isFile,
    writeFile,
    readFile,
    readJson,
    createWriteStream,
    fileByteLength
}