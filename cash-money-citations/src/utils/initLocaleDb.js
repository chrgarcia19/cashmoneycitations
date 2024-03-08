import dbConnect from "@/utils/dbConnect";
import CSLLocaleModel from "@/models/CSLLocale";

const fs = require('fs');
const path = require('path');

async function importLocaleFiles(directoryPath) {
    await dbConnect();

    // Check if there are any CSL Styles in the database
    const count = await CSLLocaleModel.countDocuments();

    if (count === 0) {
        // Read .csl files from directory
        // i.e. `./locale`
        const stylePath = path.resolve(directoryPath)

        const localeFiles = fs.readdirSync(stylePath);

        // Eventually change this to check for individual duplicates rather than quantity of DB
        for (const file of localeFiles) {
            if (path.extname(file) === '.xml') {
                const filePath = path.join(stylePath, file);
                const localeData = fs.readFileSync(filePath, 'utf8');

                // Insert the .xml data into the MongoDB database
                const locale = new CSLLocaleModel({ name: path.basename(file, '.xml'), localeData: localeData });
                await locale.save();
            }
        }
    } 
}

export default importLocaleFiles;