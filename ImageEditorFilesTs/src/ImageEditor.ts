import { readFileSync } from "fs";

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
    console.log("USAGE: npm run start -- <in-file> -- <out-file> -- <grayscale|invert|emboss|motionblur> -- {motion-blur-length}");
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
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const r = Math.round((parseInt(tokens[i++]!) / max) * 255);
            const g = Math.round((parseInt(tokens[i++]!) / max) * 255);
            const b = Math.round((parseInt(tokens[i++]!) / max) * 255);
            let row = pixels[x];
            row?.push({ red: r, green: g, blue: b });
        } 
    }

    let image: Image = {pixels:pixels, height: height, width: width};

    return image;
}

function write(image: Image, outFile: string){
    return;
}

function montionBlur(image: Image, lenght: number){
    if (length < 1) {
        return;
    }

    let curColor: Color;
    let tmpColor: Color;
    let pixels: Color[][] = image['pixels'];

    for (let x = 0; x < image['width']; x++) {
        for (let y = 0; y < image['height']; y++) {
            curColor = pixels?[x][y];
            
            const maxX = Math.min(image['width'] - 1, x + length - 1);
            for (let i = x + 1; i <= maxX; i++) {
                tmpColor = pixels?[i][y];
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
    return;
}

function grayscale(image: Image){
    return;
} 

function emboss(image: Image){
    return;
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
