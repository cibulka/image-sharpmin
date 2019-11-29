const path = require('path');

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');

const IMAGE_SIZES = [640, 768, 1024, 1366, 1600, 1920];

(async () => {
    const result = [];

    const files = await imagemin(['public/image/src/*.{jpg,jpeg,png}'], {
        destination: 'public/image/dist',
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });

    files.forEach(file => {
        const dir = path.dirname(file.destinationPath);
        const fileExt = path.extname(file.destinationPath);
        const fileName = path.basename(file.destinationPath, fileExt);

        IMAGE_SIZES.forEach(width => {
            sharp(file.data)
                .resize(width, null, { withoutEnlargement: true })
                .toFile(`${dir}/${fileName}-${width}${fileExt}`, (err, info) => {
                    if (err) {
                        console.warn(err);
                    } else {
                        console.log(`${fileName}${fileExt}: ${info.width}/${info.height}`);
                    }
                })
            ;
        });
    });

    console.log(`DONE!`);
    //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
})();
