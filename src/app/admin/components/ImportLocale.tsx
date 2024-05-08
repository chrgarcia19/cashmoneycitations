"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

function ImportLocale({ handleLocaleSubmit }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();
  
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Check the file extension for the file type
      const extension = file.name.split(".").pop();
      if (extension !== "zip") {
        alert("Invalid file type. Please select a zip file.");
        return;
      }

      // Check the file size (25MB in this example)
      const maxSizeInBytes = 25 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert("File is too large. Please select a file smaller than 25MB.");
        return;
      }

      setSelectedFile(file);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      handleLocaleSubmit(formData);
      router.refresh();      
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 space-y-4">
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='text-center mb-12'>
        <label htmlFor='locale-file-upload' className="cursor-pointer flex justify-center items-center text-center space-x-2">
          <svg className="w-6 h-6 text-blue-600 hover:text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <span>Upload a zip file containing (locale) files in .xml format</span>
        </label>
        <input id="locale-file-upload" type="file" accept=".zip" onChange={handleFileChange} className="hidden"/>
      </div>
      <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Import Locale</button>
    </form>
  </div>
    </>
  );
}

export default ImportLocale;
