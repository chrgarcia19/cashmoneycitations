'use client'

import React, { useState } from 'react';

function ImportLocale({handleLocaleSubmit}: any) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
          // Check the file extension for the file type
          const extension = file.name.split('.').pop();
          if (extension !== 'zip') {
            alert('Invalid file type. Please select a zip file.');
            return;
          }
      
          // Check the file size (25MB in this example)
          const maxSizeInBytes = 25 * 1024 * 1024;
          if (file.size > maxSizeInBytes) {
            alert('File is too large. Please select a file smaller than 25MB.');
            return;
          }
      
          setSelectedFile(file);
        }    
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);

          handleLocaleSubmit(formData);
        }
    }
    
      return (
        <>
          <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex items-center'>
                <label htmlFor='locale-file-upload' className="cursor-pointer">
                    <span className="mr-2 text-blue-600 hover:text-blue-800">Upload a (locale) file in .xml format</span>
                </label>
                <input id="locale-file-upload" type="file" accept=".zip" onChange={handleFileChange} className="hidden"/>

            </div>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded">Import Locale</button>
          </form>
        </>
      );
    }
    
    export default ImportLocale;