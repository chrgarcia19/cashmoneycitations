'use server';
import { getSpecificReferenceById } from "@/components/componentActions/actions";
import { GetBibLaTexFile, GetBibTexFile, GetJSONFile } from "../[id]/references/view/actions";

export async function ExportMultipleReferences(exportType: string, selectedReferenceIds: any, lang: string) {
    const references = [];

    for (const id of selectedReferenceIds) {
        const reference = await getSpecificReferenceById(id);
        references.push(reference);
    }

    let formattedReferences = '';
    switch (exportType) {
        case 'biblatex':
            for (const reference of references) {
                formattedReferences += await GetBibLaTexFile(reference, lang);
            }
 
            break;
        case 'bibtex':
            for (const reference of references) {
                formattedReferences += await GetBibTexFile(reference, lang);
            }
            break;
        case 'csljson':
            const jsonReferences = [];
            for (const reference of references) {
                const jsonReference = await GetJSONFile(reference, lang);
                jsonReferences.push(jsonReference);
            }
            formattedReferences = JSON.stringify(jsonReferences, null, 2);
            break;
        default:
            throw new Error(`Unsupported Export Type: ${exportType}`);
    }

    return formattedReferences;
}