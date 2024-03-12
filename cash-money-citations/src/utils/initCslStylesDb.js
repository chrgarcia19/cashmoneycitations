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
    // Remove ".csl" from filename
    let fileName = fileData.name;
    fileName = fileName.replace(".csl", "")

    // Check to see if CSL Style exists
    if (await cslStyleExists(fileName)) {
        return { status: "error", message: 'CSL Stlye already exists' };
    } else {
        const csl = new CSLStyleModel({ name: fileName, cslData: fileData.contents})
        await csl.save()
        return { status: "success", message: 'CSL Style added' };
    }

}

export default importCSLFiles;