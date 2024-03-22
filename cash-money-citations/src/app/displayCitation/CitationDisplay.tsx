"use client"

import { useEffect, useState } from 'react';
import { SelectionCSL, SelectionLocale } from '../[id]/view/CSLComponents';
import { CreateCitation } from '../[id]/view/actions';

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