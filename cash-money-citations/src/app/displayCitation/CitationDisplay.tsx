"use client"

import { useEffect, useState } from 'react';
import { SelectionCSL, SelectionLocale } from '../[id]/view/CSLComponents';
import { CreateCitation } from '../[id]/view/actions';
import { DeleteCitation, GetCitations } from './actions';

export function CitationList({ referenceId }: any) {
  const [citations, setCitations] = useState<any[]>([]);
  // Fetch initial citation state
  useEffect(() => {
    fetchCitations();
  }, []);

  const fetchCitations = async () => {
    // Fetch citations from server and update state
    const fetchedCitations = await GetCitations(referenceId);
    setCitations(fetchedCitations);
  }

  const handleDelete = async (citationId: any) => {
    // Delete citation from server
    await DeleteCitation(citationId);

    // Remove citation from state
    const updatedCitations = citations.filter(citation => citation._id !== citationId);
    setCitations(updatedCitations);
  }

  return (
    <>
        {citations?.map((citation, index) => (
          <tr key={citation._id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
            <td className="px-6 py-4 text-center text-sm">
              {citation.style}
            </td>
            <td className="px-6 py- text-center text-sm">
              {citation.CitationData}
            </td>
            <td className="px-6 py-4 text-center">
              <CopyToClipboard citationData={citation.CitationData} />
              <button onClick={() => handleDelete(citation._id)}>
                Delete
              </button> 
            </td>
          </tr>
        ))}
    </>
  );
}

export function CopyToClipboard(citationData : any){

  const copyToClipboard = (text : string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <button onClick={() => copyToClipboard(JSON.stringify(citationData.citationData))}>
      <img className='copy-icon' src="/copy-icon.svg" alt="Copy" width="30" height="30" />
    </button> 
  )
};

export function DeleteCitationDisplay(citeId: any) {
  return (
    <>
      <button onClick={() => DeleteCitation(citeId.citationId)}>
        Delete
      </button>
    </>
  )
}

export function CitationChoice(referenceId: any) {
  const [styleChoice, setStyleChoice] = useState('');
  const [localeChoice, setLocaleChoice] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function exportCitation() {
    if (!styleChoice || !localeChoice) {
      setError('Please select both a citation style and a language.');
      return;
    }

    setIsLoading(true);
    try {
      // Call to server action to create citations & save in DB
      await CreateCitation(referenceId.referenceId, styleChoice, localeChoice);
      window.location.reload(); // Refresh the page
    } catch (error) {
      setError('An error occurred while creating the citation.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className='flex items-center space-x-5 bg-gray-200 p-4 rounded-md'>
        <div className='flex flex-col'>
          <label htmlFor='styleChoice' className='mb-2 font-bold text-lg'>Citation Style</label>
          <SelectionCSL onStyleChoiceChange={setStyleChoice}/>
        </div>
        <div className='flex flex-col'>
          <label htmlFor='localeChoice' className='mb-2 font-bold text-lg'>Language</label>
          <SelectionLocale onLocaleChoiceChange={setLocaleChoice}/>
        </div>
        <button onClick={() => exportCitation()} className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700' title='Click to generate citation' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Make Citation'}
        </button>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </>
  )
}