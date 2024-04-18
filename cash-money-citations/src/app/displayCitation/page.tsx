'use client'
import { useState } from 'react';
import { CitationChoice, DeleteCitationDisplay, CitationList } from './CitationDisplay';
import { useReferenceContext } from '../reference-table/components/ReferenceTable';

export default function citationDisplay({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string | undefined }
}){
  const referenceId = searchParams.citation;
  const [citations, setCitations] = useState([]);
  const { references, setReferences, addReference, removeReference, referenceIds, setReferenceIds, selectedReferenceIds, setSelectedReferenceIds }  = useReferenceContext();

  return (
    <div className='center-content'>
      <div className='flex flex-row items-start w-screen'>

        <div className='px-20'>
          <CitationChoice referenceId={referenceId} citations={citations} setCitations={setCitations} referenceIds={referenceIds} selectedReferenceIds={selectedReferenceIds} />
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className='bg-gray-50'>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citation Style</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy</th>
              </tr>
              
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <CitationList referenceId={referenceId} citations={citations} setCitations={setCitations} referenceIds={referenceIds} selectedReferenceIds={selectedReferenceIds} />
            </tbody>

          </table>
        </div>
      </div>
    </div>
    
  )
};