"use client"

import { useEffect, useState } from 'react';

export default function citationDisplay({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string | undefined }
}){
  const [citationData, setCitationData] = useState({ van: '', apa: '', bibtex: '' });
  useEffect(() => {
    const citation = searchParams.citation;
    if (citation) {
      const parsedData = JSON.parse(decodeURIComponent(citation));
      setCitationData(parsedData);
    }
  }, [searchParams]);

  const copyToClipboard = (text : string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className='flex flex-row items-start w-screen'>
     <div className='flex flex-row bg-green-200 rounded-lg p-4 m-4'>
        <div className='mt-3'>Vancouver Citation: {citationData.van}</div>
        <button onClick={() => copyToClipboard(citationData.van)}>
        <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
        </button>
      </div>
      <div className='flex flex-row bg-green-200 rounded-lg p-4 m-4'>
        <p className='mt-3'>APA Citation: {citationData.apa}</p>
        <button onClick={() => copyToClipboard(citationData.apa)}>
        <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
        </button>
      </div>
      <div className='flex flex-row bg-green-200 rounded-lg p-4 m-4'>
        <p className='mt-3'>BibTex: {citationData.bibtex}</p>
        <button onClick={() => copyToClipboard(citationData.bibtex)}>
        <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
        </button>
      </div>

    </div>
  )
};