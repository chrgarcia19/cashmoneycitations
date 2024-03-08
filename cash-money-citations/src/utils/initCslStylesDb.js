import dbConnect from "@/utils/dbConnect";

const fs = require('fs');
const path = require('path');

async function importCSLFiles(directoryPath) {
    await dbConnect();

    // Read .csl files from directory
    const cslFiles = fs.readdirSync(directoryPath);
    

}