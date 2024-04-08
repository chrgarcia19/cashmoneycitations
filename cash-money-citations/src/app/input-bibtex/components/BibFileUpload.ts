'use server';

// Take in user input files | Single file complete
// Parse the bibtex | Parse single file complete
// Validate the bibtex
// Return to Textarea
// Allow user to edit BibTex
// Once user clicks submit, save to db as a reference and pass to CSL
import { CreateCslFromBibTex } from "@/components/componentActions/citationActions";

export const ParseBibTexUpload = async (formData: FormData) => {
    try {
        const file = formData.get('file') as File;
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const parsedBibFile = buffer.toString('utf-8');

        // Split the file into individual BibTeX entries
        const entries = parsedBibFile.split('@').filter(entry => entry.trim() !== '');

        // Add '@' back to the start of each entry
        const bibEntries = entries.map(entry => '@' + entry);
        return bibEntries;
    } catch(error) {
        return "Parsing BibTex File Failed.";
    }
}

export const SaveBibFileToDb = async (bibEntries: string[], userId: string) => {
    try {
        for (const bibFile of bibEntries) {
            if (bibFile) {
                // Save cslBibData to the database
                const bibFileEntry = await CreateCslFromBibTex(bibFile, userId);
                if (bibFileEntry) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    } catch(e) {
        console.error(e)
    }
}