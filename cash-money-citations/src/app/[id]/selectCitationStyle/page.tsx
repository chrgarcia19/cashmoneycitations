'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SelectionCSL, SelectionLocale } from "../view/CSLComponents";
import { CreateCitation } from '../view/actions';

const SelectCitationStyle = () => {
  // const router = useRouter();
  // const { referenceId } = router.query;
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("referenceId");
  const router = useRouter();
  const [styleChoice, setStyleChoice] = useState(Array<string>(''));
  const [localeChoice, setLocaleChoice] = useState('');

  async function handleExportCitation() {
    if (!referenceId) return; // Check if referenceId is available
    // // Call to server action to create citations & save in DB
   await CreateCitation(referenceId, styleChoice, localeChoice);
    // // Optionally navigate to display the citation or back to home
   router.push(`/displayCitation?citation=${referenceId}`);

    console.log(referenceId, "this is the referenceid")
  }


  const redirectToSelectionLocale = () => {
    console.log("wow")

  }
  

  return (
    <div className='w-full flex justify-center items-start pt-10'> {/* Adjust vertical alignment and padding */}
    <div className="bg-gray-100 w-4/5 rounded-xl p-4 space-y-4 overflow-auto"> {/* Handle overflow if necessary */}
      <SelectionCSL onStyleChoiceChange={setStyleChoice} />
      <SelectionLocale onLocaleChoiceChange={setLocaleChoice} />
      <button onClick={handleExportCitation} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out">Export Citation</button>
    </div>
  </div>
  
  );
};

export default SelectCitationStyle;
{/* <button onClick={() => redirectToSelectionLocale()} className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out'>Choose Selection Locale</button> */}

