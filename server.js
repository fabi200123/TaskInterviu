const resize = require('./resize')
const sizeOf = require('image-size')
const express = require('express')
const NodeCache = require( "node-cache" );
const cache = new NodeCache();
const server = express()
const port = 2000

server.listen(port, () => {
    console.log('Server started on port ' + port);
})

server.get('/images/:imageId', async (req, res) => {
    const imageName = req.params.imageId;
    const imageFormat = req.params.imageId.split(".")[1];
    let originalWidth = 0;
    let originalHeight = 0;

    const cacheKey = req.url;
    let img = cache.get(cacheKey);
    if (img === undefined) {
        //checking if image has format JPEG
        if(imageFormat !== "jpeg"){
            throw new Error("Image format is not JPEG!");
        }

        //getting original size of the image
        sizeOf('images/'+imageName, function (err, dimensions) {
            if (err) {
                throw err;
            }
            originalHeight = dimensions.height;
            originalWidth = dimensions.width;
        })

        //getting the resize values
        const sizeString = req.query.size;
        let width = 0;
        let height = 0;
        if(sizeString){
            width = parseInt(sizeString.split("x")[0]);
            height = parseInt(sizeString.split("x")[1]);

            //checking if image has sizes in the parameters
            if(width < 320 || width > 3840 || height < 240 || height > 2160){
                throw new Error("Latimea si inaltimea pozei nu sunt numere intregi intre 320 x 240 si 3840 x 2160, respectiv.");
            }
        }
        else {
            throw new Error("Resize values are not specified!");
        }

        img = resize('images/'+req.params.imageId, width, height, originalWidth, originalHeight);
        cache.set(cacheKey, img, 5000);
    }

    img.pipe(res);
    res.status(200);
})