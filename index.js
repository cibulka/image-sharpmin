const path = require('path');

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');

const IMAGE_SIZES = [640, 768, 1024, 1366, 1600, 1920];

function getPath(folder) {
    const dir = process.argv[2] || __dirname;
    return `${dir}/${folder}`;
};

(async () => {
    const result = [];

    const files = await imagemin([
        getPath('public/image/src/*.${jpg,jpeg,png}'
    ])
        destination: getPath('public/image/dist'),
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });

    let isErr = null;
    files.forEach(file => {
        const dir = path.dirname(file.destinationPath);
        const fileExt = path.extname(file.destinationPath);
        const fileName = path.basename(file.destinationPath, fileExt);

        IMAGE_SIZES.forEach(width => sharp(file.data)
            .resize(width, { withoutEnlargement: true })
            .toFile(`${dir}/${fileName}-${width}${fileExt}`, (err, info) => {
                if (err) {
                    isErr = true;
                    console.warn(err);
                } else {
                    console.log(`${fileName}${fileExt}: ${info.width}/${info.height}`);
                }
            });
        });
    });

    if (err) {
        console.log('\x1b[31m%s\x1b[0m', `Something went wrong.`);
    } else {
        console.log('\x1b[32m%s\x1b[0m', `Resized ${files.length} images.`);
    }

    return isErr;
    //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
})();
