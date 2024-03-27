"use client"

import { useEffect, useState } from 'react';
import { SelectionCSL, SelectionLocale } from '../[id]/references/view/CSLComponents';
import { CreateCitation } from '../[id]/references/view/actions';
import { DeleteCitation, GetCitations } from './actions';
import { useRouter } from 'next/navigation';


export function CitationList({ referenceId }: any) {
  const [citations, setCitations] = useState<any[]>([]);
  const router = useRouter();
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
    //router.push(`/displayCitation?citation=${referenceId}`);
    router.refresh();
  }

  return (
    <>
        {citations?.map((citation, index) => (
          <tr key={citation.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
            <td className="px-6 py-4 text-center text-sm">
              {citation.style}
            </td>
            <td className="px-6 py- text-center text-sm">
              {citation.CitationData}
            </td>
            <td className="px-6 py-4 text-center">
              <CopyToClipboard citationData={citation.CitationData} />
              <DeleteCitationDisplay citationId={citation._id} />
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
  const [styleChoice, setStyleChoice] = useState(Array<string>(''));
  const [localeChoice, setLocaleChoice] = useState('');
  const router = useRouter();
  async function exportCitation() {
    // Call to server action to create citations & save in DB
    await CreateCitation(referenceId.referenceId, styleChoice, localeChoice);
    //router.push(`/displayCitation?citation=${referenceId}`);
    router.refresh();
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