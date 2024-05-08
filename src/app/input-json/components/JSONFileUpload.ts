'use server';

// Take in user input files | Single file complete
// Parse the bibtex | Parse single file complete
// Validate the bibtex
// Return to Textarea
// Allow user to edit BibTex
// Once user clicks submit, save to db as a reference and pass to CSL
import { CreateCslJsonDocument } from "@/components/componentActions/citationActions";

export const ParseJsonUpload = async (formData: FormData) => {
    try {
        const file = formData.get('file') as File;
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileContent = buffer.toString('utf-8');

        const jsonEntries = JSON.parse(fileContent);
        return jsonEntries;
    } catch(error) {
        return "Parsing JSON File Failed.";
    }
}

export const SaveJsonFileToDB = async (bibEntries: string[], userId: string) => {
    try {
        let success = false;
        for (const bibFile of bibEntries) {
            if (bibFile) {
                // Save cslBibData to the database
                const bibFileEntry = await CreateCslJsonDocument(bibFile, userId);
                if (bibFileEntry) {
                    success = true;
                } else {
                    success = false;
                }
            }
        }

        return success;
    } catch(e) {
        console.error(e)
    }
}