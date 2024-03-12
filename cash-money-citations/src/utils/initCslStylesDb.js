import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";

const fs = require('fs');
const path = require('path');

async function importCSLFiles(fileData) {
    await dbConnect();
    const csl = new CSLStyleModel({ name: fileData.name, cslData: fileData.contents})
    await csl.save()

}

export default importCSLFiles;