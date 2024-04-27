'use client'
import { useState } from 'react';
import { CitationChoice, CitationList } from './CitationDisplay';
import { useReferenceContext } from '../reference-table/components/ReferenceTable';
import { ErrorBoundary } from '../error/boundary/errorBoundary';
import Link from 'next/link';
import { Button } from '@nextui-org/button';

export default function citationDisplay({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string | undefined }
}){
  //const referenceId = searchParams.citation;
  const [citations, setCitations] = useState([Object]);
  const [styleChoice, setStyleChoice] = useState('');
  const [localeChoice, setLocaleChoice] = useState('en-US');
  const { references, setReferences, addReference, removeReference, referenceIds, setReferenceIds, selectedReferenceIds, setSelectedReferenceIds }  = useReferenceContext();


return (
  <ErrorBoundary>
    <div className='center-content'>
      <div className='flex flex-row items-start w-screen'>

        <div className=''>
          {
            selectedReferenceIds.length === 0 &&
            <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative" role="alert">
              <div className='flex justify-between items-center'>
                <div>
                  <strong className="font-bold">Attention!</strong>
                  <span className="block sm:inline"> Please select a reference to proceed.</span>
                </div>
                <div>
                  <Link href="/reference-table">
                    <Button color='warning'>
                      Add References Here
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          }
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
  </ErrorBoundary>
)
};