'use client'

import React, { useState } from 'react';

function ImportCSLStyles({handleCslSubmit}: any) {
    const [cslDirectory, setCslDirectory] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedFile(e.target.files ? e.target.files[0] : null);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = function(event) {
            handleCslSubmit(event.target?.result);
          };
          reader.readAsText(selectedFile);
        }
      }
    
      return (
        <>
          <form onSubmit={handleSubmit}>
            <input type="file" accept=".csl" onChange={handleFileChange} />
            <button type="submit">Import CSL Styles</button>
          </form>
        </>
      );
    }
    
    export default ImportCSLStyles;