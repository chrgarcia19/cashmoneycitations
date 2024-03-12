import dbConnect from "@/utils/dbConnect";
import CSLLocaleModel from "@/models/CSLLocale";

const fs = require('fs');
const path = require('path');

async function importLocaleFiles(fileData) {
    await dbConnect();

    // Remove "locales" & "xml" from filename
    let fileName = fileData.name;
    fileName = fileName.replace("locales-", "");
    fileName = fileName.replace(".xml", "");

    const locale = new CSLLocaleModel({ name: fileName, localeData: fileData.contents})
    await locale.save()    
}

export default importLocaleFiles;