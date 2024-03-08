import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";

const fs = require('fs');
const path = require('path');

async function importCSLFiles(directoryPath) {
    await dbConnect();

    // Check if there are any CSL Styles in the database
    const count = await CSLStyleModel.countDocuments();

    if (count === 0) {
        // Read .csl files from directory
        const cslFiles = fs.readdirSync(directoryPath);

        for (const file of cslFiles) {
            if (path.extname(file) === '.csl') {
                const filePath = path.join(directoryPath, file);
                const cslData = fs.readFileSync(filePath, 'utf8');

                // Insert the .csl data into the MongoDB database
                const csl = new CSLStyleModel({ name: path.basename(file, '.csl'), cslData: cslData });
                await csl.save();
            }
        }
    }
}

export default importCSLFiles;