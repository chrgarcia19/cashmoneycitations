"use client"
// CitationDisplay.tsx
import { useState } from 'react';
import { CitationChoice, CitationList } from '../../app/displayCitation/CitationDisplay';
import useLocalStorageReferenceContext from '../../hooks/useLocalStorageReferenceContext';

export interface Reference {
    id: string;
    selected?: boolean;
    // Add other properties as needed
  }
  
  export interface ReferenceContextType {
    references: Reference[];
    setReferences: (references: Reference[]) => void;
    addReference: (reference: Reference) => void;
    removeReference: (referenceId: string) => void;
    referenceIds: string[];
    setReferenceIds: (referenceIds: string[]) => void;
    selectedReferenceIds: string[];
    setSelectedReferenceIds: (selectedReferenceIds: string[]) => void;
  }

// interface Props {
//   params: { slug: string };
//   searchParams: { [key: string]: string | undefined };
// }

const CitationDisplay = () => {
  const [citations, setCitations] = useState<any[]>([]);
  const [styleChoice, setStyleChoice] = useState<string>('');
  const [localeChoice, setLocaleChoice] = useState<string>('en-US');
  const { references, setReferences, addReference, removeReference, referenceIds, setReferenceIds, selectedReferenceIds, setSelectedReferenceIds } = useLocalStorageReferenceContext();

  return (
    <div className='center-content'>
      <div className='flex flex-row items-start w-screen'>
        <div className='px-20'>
          <CitationChoice citations={citations} setCitations={setCitations} referenceIds={referenceIds} selectedReferenceIds={selectedReferenceIds} styleChoice={styleChoice} setStyleChoice={setStyleChoice} localeChoice={localeChoice} setLocaleChoice={setLocaleChoice} />
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className='bg-gray-50'>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <CitationList citations={citations} setCitations={setCitations} styleChoice={styleChoice} localeChoice={localeChoice} referenceIds={referenceIds} selectedReferenceIds={selectedReferenceIds} setSelectedReferenceIds={setSelectedReferenceIds}/>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CitationDisplay;
