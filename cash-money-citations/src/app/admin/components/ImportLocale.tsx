'use client'

import React, { useState } from 'react';

function ImportLocale({handleLocaleSubmit}: any) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
          // Check the file extension for the file type
          const extension = file.name.split('.').pop();
          if (extension !== 'xml') {
            alert('Invalid file type. Please select a .xml file.');
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
            handleLocaleSubmit(fileData)
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
          <form onSubmit={handleSubmit}>
            <input type="file" accept=".xml" onChange={handleFileChange} />
            <button type="submit">Import Locale</button>
          </form>
        </>
      );
    }
    
    export default ImportLocale;