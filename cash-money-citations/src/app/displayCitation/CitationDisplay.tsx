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
    <div>
      {citations.map(citation => (
        <div key={citation._id}>
          <p>{citation.CitationData}</p>
          <button onClick={() => handleDelete(citation._id)}>Delete</button>
        </div>
      ))}
    </div>
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
  const [styleChoice, setStyleChoice] = useState(Array<string>(''));
  const [localeChoice, setLocaleChoice] = useState('');

  async function exportCitation() {
    // Call to server action to create citations & save in DB
    await CreateCitation(referenceId.referenceId.citation, styleChoice, localeChoice);
  }

  return (
    <>
      <span>
        <SelectionCSL onStyleChoiceChange={setStyleChoice} />
        <SelectionLocale onLocaleChoiceChange={setLocaleChoice}/>
        <button onClick={() => exportCitation()}>Make Citation</button>
      </span>

    </>
  )
}