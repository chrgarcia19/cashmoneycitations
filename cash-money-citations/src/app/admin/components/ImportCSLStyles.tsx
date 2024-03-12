'use client'

import React, { useState } from 'react';

function ImportCSLStyles({handleCslSubmit}: any) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
          // Check the file extension for the file type
          const extension = file.name.split('.').pop();
          if (extension !== 'csl') {
            alert('Invalid file type. Please select a .csl file.');
            return;
          }
      
          // Check the file size (5MB in this example)
          const maxSizeInBytes = 5 * 1024 * 1024;
          if (file.size > maxSizeInBytes) {
            alert('File is too large. Please select a file smaller than 5MB.');
            return;
          }
      
          setSelectedFile(file);
        }    
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = function(event) {
            const fileContents = event.target?.result;
            const fileData = {
              name: selectedFile.name,
              contents: fileContents
            };
            handleCslSubmit(fileData)
                .then((response: any) => {
                    if (response.status === "error") {
                        alert(response.message)
                    }
                })
          };
          reader.readAsText(selectedFile);
        }
    }
    
      return (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex items-center'>
                <label htmlFor='file-upload' className="cursor-pointer">
                    <span className="mr-2 text-blue-600 hover:text-blue-800">Upload a .csl file</span>
                </label>
                <input id="file-upload" type="file" accept=".csl" onChange={handleFileChange} className="hidden" />

            </div>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded">Import CSL Styles</button>
          </form>
        </>
      );
    }
    
    export default ImportCSLStyles;