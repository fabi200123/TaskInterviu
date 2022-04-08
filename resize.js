const fs = require('fs')
const sharp = require('sharp')


module.exports = function resize(path, width, height, originalWidth, originalHeight) {
    const readStream = fs.createReadStream(path);
    let transform = sharp();

    //resize only if new values differ from original ones
    if((width !== originalWidth) && (height !== originalHeight)){
        transform = transform.resize(width, height);
    }
    
    return readStream.pipe(transform);
}