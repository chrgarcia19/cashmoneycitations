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
        return parsedBibFile;
    } catch(error) {
        return "Parsing BibTex File Failed."
    }
}

export const SaveBibFileToDb = async (bibFile: string, userId: string) => {
    try {
        const cslBibData = await CreateCslFromBibTex(bibFile, userId);
    } catch(e) {
        console.error(e)
    }
}