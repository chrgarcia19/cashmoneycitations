import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";

const fs = require('fs');
const path = require('path');

async function importCSLFiles(directoryPath) {
    await dbConnect();
    const csl = new CSLStyleModel({ name: path.basename(directoryPath, '.csl'), cslData: directoryPath})
    await csl.save()
    // Check if there are any CSL Styles in the database
    // const count = await CSLStyleModel.countDocuments();

    // if (count === 0) {
    //     // Read .csl files from directory
    //     // i.e. `./csl_styles`
    //     const stylePath = path.resolve(directoryPath)

    //     const cslFiles = fs.readdirSync(stylePath);

    //     for (const file of cslFiles) {
    //         if (path.extname(file) === '.csl') {
    //             const filePath = path.join(stylePath, file);
    //             const cslData = fs.readFileSync(filePath, 'utf8');

    //             // Insert the .csl data into the MongoDB database
    //             const csl = new CSLStyleModel({ name: path.basename(file, '.csl'), cslData: cslData });
    //             await csl.save();
    //         }
    //     }
    // } 
}

export default importCSLFiles;