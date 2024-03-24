import dbConnect from "@/utils/dbConnect";
import CSLStyleModel from "@/models/CSLStyle";

await dbConnect();

async function cslStyleExists(cslStyleName) {
    const cslStyle = await CSLStyleModel.findOne({
        name: cslStyleName
    });
    return cslStyle !== null;
}

async function parseTitle(fileData) {
    const titleRegex = /<title>(.*?)<\/title>/;
    const titleShortRegex = /<title-short>(.*?)<\/title-short>/;

    const titleMatch = fileData.contents.match(titleRegex);
    const titleShortMatch = fileData.contents.match(titleShortRegex);

    let title = null;
    let titleShort = null;

    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
    }

    if (titleShortMatch && titleShortMatch[1]) {
        titleShort = titleShortMatch[1].trim();
    }

    return { title, titleShort };
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
            const { title, titleShort } = await parseTitle(fileData);
            const csl = new CSLStyleModel({ name: fileName, title: title, shortTitle: titleShort, cslData: fileData.contents, isDependent: fileData.isDependent })
            await csl.save()
            return { status: "success", message: 'CSL Style added' };
        }

    }

}

export default importCSLFiles;