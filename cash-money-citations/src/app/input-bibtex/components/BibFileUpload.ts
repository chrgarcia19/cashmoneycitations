'use server';

// Take in user input files
// Parse the bibtex
// Validate the bibtex
// Return to Textarea
// Allow user to edit BibTex
// Once user clicks submit, save to db as a reference and pass to CSL


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