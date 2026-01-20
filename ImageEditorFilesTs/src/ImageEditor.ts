
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
    return {pixels: [[{red:0,green:0,blue: 0}]], height: 0, width: 0};
}

function write(image: Image, outFile: string){
    return;
}

function montionBlur(image: Image, lenght: number){
    return;
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
}

run(process.argv.slice(2));
