import { readFileSync, writeFileSync } from "fs";

type Color = {
    red: number,
    green: number,
    blue: number
}

type Image = {
    pixels: Color[][],
    height: number,
    width: number,
} 

function usage(){
    console.log("USAGE: npm run start -- <in-file> <out-file> <grayscale|invert|emboss|motionblur> {motion-blur-length}");
}

function read(inFile: string): Image {
    const content = readFileSync(inFile, "utf8");
    let pixels: Color[][] = [];

    const tokens = content
        .replace(/#.*\n/g, "")
        .trim()
        .split(/\s+/);

    if (!tokens || tokens[0] != 'P3'){
        throw new Error("Not a PPM file")
    }

    const width = parseInt(tokens[1]!);
    const height = parseInt(tokens[2]!);
    const max = parseInt(tokens[3]!);
    for (let x = 0; x < width; x++) {
        pixels.push([]); 
    }

    let i = 4
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const r = Math.round((parseInt(tokens[i++]!) / max) * 255);
            const g = Math.round((parseInt(tokens[i++]!) / max) * 255);
            const b = Math.round((parseInt(tokens[i++]!) / max) * 255);
            pixels[x]?.push({ red: r, green: g, blue: b });
        }
    }

    let image: Image = {pixels:pixels, height: height, width: width};

    return image;
}

function write(image: Image, outFile: string){
    const width = image.width;
    const height = image.height;
    let imageText: string = `P3\n${width} ${height}\n255\n`
    
    for (let y = 0; y < height; y++) {
       for (let x = 0; x < width; x++) {
           const pixel = image.pixels![x]![y]!;
           imageText += `${x === 0 ? '' : ' '}${pixel.red} ${pixel.green} ${pixel.blue}`;
       }
       imageText += '\n';
    }
    writeFileSync(outFile, imageText, 'utf-8');
}

function montionBlur(image: Image, lenght: number){
    if (lenght < 1) {
        return;
    }

    let curColor: Color;
    let tmpColor: Color;
    let pixels: Color[][] = image['pixels'];

    for (let x = 0; x < image['width']; x++) {
        for (let y = 0; y < image['height']; y++) {
            curColor = pixels![x]![y]!;
            
            const maxX = Math.min(image['width'] - 1, x + lenght - 1);
            for (let i = x + 1; i <= maxX; i++) {
                tmpColor = pixels![i]![y]!;
                curColor.red += tmpColor.red;
                curColor.green += tmpColor.green;
                curColor.blue += tmpColor.blue;
            }

            const delta = (maxX - x + 1);
            curColor.red /= delta;
            curColor.green /= delta;
            curColor.blue /= delta;
        }
    }
}

function invert(image: Image){
    let curColor: Color;
    for (let x = 0; x < image['width']; x++) {
        for (let y = 0; y < image['height']; y++) {
            curColor = image.pixels![x]![y]!;
            curColor.red = 255 - curColor.red;
            curColor.green = 255 - curColor.green;
            curColor.blue = 255 - curColor.blue;
        }
    }
}

function grayscale(image: Image){
    let curColor: Color;
    let grayLevel: number;
    for (let x = 0; x < image['width']; x++) {
        for (let y = 0; y < image['height']; y++) {
            curColor = image.pixels![x]![y]!;
                            
            grayLevel = (curColor.red + curColor.green + curColor.blue) / 3;
            grayLevel = Math.max(0, Math.min(grayLevel, 255));
            
            curColor.red = grayLevel;
            curColor.green = grayLevel;
            curColor.blue = grayLevel;
        }
    }
} 

function emboss(image: Image){
    let curColor: Color;
    let upLeftColor: Color;
    let diff: number;
    let grayLevel: number;
    for (let x = image['width'] - 1; x >= 0; x--) {
        for (let y = image['height'] - 1; y >= 0; y--) {
            diff = 0;
            curColor = image.pixels![x]![y]!;
            
            if (x > 0 && y > 0) {
                upLeftColor = image.pixels![x - 1]![y - 1]!;
                if (Math.abs(curColor.red - upLeftColor.red) > Math.abs(diff)) {
                    diff = curColor.red - upLeftColor.red;
                }
                if (Math.abs(curColor.green - upLeftColor.green) > Math.abs(diff)) {
                    diff = curColor.green - upLeftColor.green;
                }
                if (Math.abs(curColor.blue - upLeftColor.blue) > Math.abs(diff)) {
                    diff = curColor.blue - upLeftColor.blue;
                }
            }
            
            grayLevel = (128 + diff);
            grayLevel = Math.max(0, Math.min(grayLevel, 255));
            
            curColor.red = grayLevel;
            curColor.green = grayLevel;
            curColor.blue = grayLevel;
        }
    }
} 

function run(args: string[]) {
    const [inFile, outFile, filter, motionBlurLength] = args;

    if (!inFile || !outFile || !filter){
        usage()
        return;
    }
    let image: Image = read(inFile);

    if (filter == "grayscale" || filter == "greyscale") {
        grayscale(image);
    }
    else if (filter == "invert") {
        invert(image);
    }
    else if (filter == "emboss") {
        emboss(image);
    }
    else if (filter == "motionblur") {
        if (!motionBlurLength) {
            usage();
            return;
        }
        
        const length = parseInt(motionBlurLength);
        
        if (length < 0) {
            usage();
            return;
        }
        
        montionBlur(image, length);
    }
    else {
        usage();
    }

    write(image, outFile);
}

run(process.argv.slice(2));
