"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { ExportMultipleReferences } from "../../reference-table/actions";

const ExportReferences: React.FC = () => {
    const [selectedReferences, setSelectedReferences] = useState<string[]>([]);
    const [localeChoice, setLocaleChoice] = useState('en');
    useEffect(() => {
        // Retrieve selected reference IDs from local storage
        const storedRefs = localStorage.getItem('selectedReferenceIds');
        if (storedRefs) {
            setSelectedReferences(JSON.parse(storedRefs));
        }
    }, []);

    async function DownloadReferences(exportType: string, lang: string) {
        let formattedReferences = '';
        // Retrieve selectedReferences from the localstorage
        let localStorageRefIds = localStorage.getItem('references')
        if (localStorageRefIds) {
          localStorageRefIds = JSON.parse(localStorageRefIds)
        }
        switch (exportType) {
          case 'biblatex':
              
              formattedReferences = await ExportMultipleReferences(exportType, localStorageRefIds ? localStorageRefIds : [], lang)
              const biblatexBlob = new Blob([formattedReferences], {type: 'application/text'});
    
              // Create a link element
              const bibLaTexLink = document.createElement('a');
    
              // Set the download attribute of the link element
              bibLaTexLink.download = `reference.bib`;
    
              // Create a URL for the blob and set it as the href of the link
              bibLaTexLink.href = URL.createObjectURL(biblatexBlob);
    
              // Append the link to the body
              document.body.appendChild(bibLaTexLink);
    
              // Trigger a click on the link to start the download
              bibLaTexLink.click();
    
              // Remove the link from the body
              document.body.removeChild(bibLaTexLink);
    
              break;
          case 'bibtex':
              formattedReferences = await ExportMultipleReferences(exportType, localStorageRefIds ? localStorageRefIds : [], lang)
              const bibtexBlob = new Blob([formattedReferences], {type: 'application/text'});
    
              // Create a link element
              const bibtexLink = document.createElement('a');
    
              // Set the download attribute of the link element
              bibtexLink.download = `reference.bib`;
    
              // Create a URL for the blob and set it as the href of the link
              bibtexLink.href = URL.createObjectURL(bibtexBlob);
    
              // Append the link to the body
              document.body.appendChild(bibtexLink);
    
              // Trigger a click on the link to start the download
              bibtexLink.click();
    
              // Remove the link from the body
              document.body.removeChild(bibtexLink);
              break;
          case 'csljson':
              formattedReferences = await ExportMultipleReferences(exportType, localStorageRefIds ? localStorageRefIds : [], lang)
              const jsonBlob = new Blob([formattedReferences], {type: 'application/json'});
    
              // Create a link element
              const jsonLink = document.createElement('a');
    
              // Set the download attribute of the link element
              jsonLink.download = `reference.json`;
    
              // Create a URL for the blob and set it as the href of the link
              jsonLink.href = URL.createObjectURL(jsonBlob);
    
              // Append the link to the body
              document.body.appendChild(jsonLink);
    
              // Trigger a click on the link to start the download
              jsonLink.click();
    
              // Remove the link from the body
              document.body.removeChild(jsonLink);
              break;
          default:
              throw new Error(`Unsupported Export Type: ${exportType}`);
      }
    }

    return (
        <div className='mt-20'>
            <h1 className='mb-5 font-bold'>Export References</h1>
            <Button className='mx-5' onClick={() => DownloadReferences('biblatex', localeChoice)}>Export as BibLaTeX</Button>
            <Button className='mx-5' onClick={() => DownloadReferences('bibtex', localeChoice)}>Export as BibTeX</Button>
            <Button className='mx-5' onClick={() => DownloadReferences('csljson', localeChoice)}>Export as CSL-JSON</Button>
        </div>
    );
};

export default ExportReferences;
