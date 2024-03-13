import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";

await dbConnect();

async function cslStyleExists(cslStyleName) {
    const cslStyle = await CSLStyleModel.findOne({
        name: cslStyleName
    });
    return cslStyle !== null;
}

async function importCSLFiles(fileData) {

    async function validateFileType(fileData) {
        let fileName = fileData.name;
        if (!fileName.endsWith(".csl")) {
            return false;
        } else {
            return true;
        }
    }

    if (await !validateFileType(fileData)) {
        return { status: "error", message: 'Not a CSL Style' };
    } else {
        // Remove ".csl" from filename
        let fileName = fileData.name;
        fileName = fileName.replace(".csl", "")
    
        // Check to see if CSL Style exists
        if (await cslStyleExists(fileName)) {
            return { status: "error", message: 'CSL Style already exists' };
        } else {
            const csl = new CSLStyleModel({ name: fileName, cslData: fileData.contents, independent: fileData.isDependent })
            await csl.save()
            return { status: "success", message: 'CSL Style added' };
        }

    }

}

export default importCSLFiles;