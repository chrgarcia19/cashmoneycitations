'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { ExportMultipleReferences } from "../../../components//guest/GuestExportMultipleReferences";

const ExportReferences: React.FC = () => {
    const [references, setReferences] = useState<any[]>([]); // Store the references directly

    useEffect(() => {
        // Retrieve references from local storage
        const storedRefs = localStorage.getItem('references');
        if (storedRefs) {
            setReferences(JSON.parse(storedRefs)); // Parse and set the references
        }
    }, []); // Empty dependency array ensures this runs once on mount

    // Log the references after they are updated
    // useEffect(() => {
    //     console.log(references, "references");
    // }, [references]); // Will log whenever references are updated


    async function DownloadReferences(exportType: string, lang: string) {
        let formattedReferences = '';

        // Directly use the references array
        formattedReferences = await ExportMultipleReferences(exportType, references, lang);

        // Determine file extension based on export type
        const fileExtension = exportType === 'csljson' ? 'json' : 'bib';

        const exportBlob = new Blob([formattedReferences], { type: exportType === 'csljson' ? 'application/json' : 'application/text' });

        // Create a link element for downloading
        const downloadLink = document.createElement('a');
        downloadLink.download = `references.${fileExtension}`;
        downloadLink.href = URL.createObjectURL(exportBlob);

        // Append, click, and remove the link to trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    return (
        <div className='mt-20'>
            <h1 className='mb-5 font-bold'>Export References</h1>
            <Button className='mx-5' onClick={() => DownloadReferences('biblatex', 'en')}>Export as BibLaTeX</Button>
            <Button className='mx-5' onClick={() => DownloadReferences('bibtex', 'en')}>Export as BibTeX</Button>
            <Button className='mx-5' onClick={() => DownloadReferences('csljson', 'en')}>Export as CSL-JSON</Button>
        </div>
    );
};

export default ExportReferences;
