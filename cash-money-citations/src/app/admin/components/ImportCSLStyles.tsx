'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const contentType = "application/x-zip-compressed";

function ImportCSLStyles({handleCslSubmit}: any) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [includeDependent, setIncludeDependent] = useState(Boolean);

    const router = useRouter();
    
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
          // Check the file extension for the file type
          const extension = file.name.split('.').pop();
          if (extension !== 'zip') {
            alert('Invalid file type. Please select a .zip file.');
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

    function handleIncludeDependentChange(e: React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      setIncludeDependent(e.target.checked)
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);

          handleCslSubmit(formData, includeDependent);
        }
    }
    
      return (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex items-center'>
                <label htmlFor='csl-file-upload' className="cursor-pointer">
                    <span className="mr-2 text-blue-600 hover:text-blue-800">Upload a .csl file</span>
                </label>
                <input id="csl-file-upload" type="file" accept=".zip" onChange={handleFileChange} className="hidden" />
                <label>Include Dependent Styles?</label>
                <input id='choose-dependent' type='checkbox' onChange={handleIncludeDependentChange}></input>
            </div>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded">Import CSL Styles</button>
          </form>
        </>
      );
    }
    
    export default ImportCSLStyles;