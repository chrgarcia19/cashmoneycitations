"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const contentType = "application/x-zip-compressed";

function ImportCSLStyles({ handleCslSubmit }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [includeDependent, setIncludeDependent] = useState(Boolean);

  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Check the file extension for the file type
      const extension = file.name.split(".").pop();
      if (extension !== "zip") {
        alert("Invalid file type. Please select a .zip file.");
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

  function handleIncludeDependentChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    e.preventDefault();
    setIncludeDependent(e.target.checked);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      handleCslSubmit(formData, includeDependent);
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 space-y-4">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className='text-center'>
        <label htmlFor="csl-file-upload" className="cursor-pointer flex justify-center items-center text-center space-x-2">
          <svg className="w-6 h-6 text-blue-600 hover:text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16.707 5.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l6-6a1 1 0 000-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          <span>Upload a .csl file</span>
        </label>
        <input id="csl-file-upload" type="file" accept=".zip" onChange={handleFileChange} className="hidden"/>
      </div>
      <div className="flex items-center justify-center">
      <div className="flex items-center space-x-2 flex-1">
        <input id="choose-dependent" type="checkbox" className="form-checkbox" onChange={handleIncludeDependentChange}/>
        <label htmlFor="choose-dependent" className="text-gray-700 text-sm whitespace-nowrap mb-3">
          Include Dependent Styles?
        </label>
      </div>
    </div>
      <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg">
        Import CSL Styles
      </button>
    </form>
  </div>
    </>
  );
}

export default ImportCSLStyles;
