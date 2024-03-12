import dbConnect from "@/utils/dbConnect";
import CSLLocaleModel from "@/models/CSLLocale";

await dbConnect();

async function localeExists(localeName) {
    const locale = await CSLLocaleModel.findOne({
        name: localeName
    });
    return locale !== null;
}

async function importLocaleFiles(fileData) {
    // Remove "locales" & "xml" from filename
    let fileName = fileData.name;
    fileName = fileName.replace("locales-", "");
    fileName = fileName.replace(".xml", "");

    // Check to see if locale already exists
    if (await localeExists(fileName)) {
        return { status: "error", message: 'Locale already exists' };
    } else {
        const locale = new CSLLocaleModel({ name: fileName, localeData: fileData.contents})
        await locale.save()   
        return { status: "success", message: 'Locale added' };
    }

}

export default importLocaleFiles;