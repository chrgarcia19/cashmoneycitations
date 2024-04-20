"use client"
import { useEffect, useState } from 'react';
import { getSpecificReferenceById } from '@/components/componentActions/actions';
import { SelectionCSL, SelectionLocale } from '../[id]/references/view/CSLComponents';
import { CreateCitation } from '../[id]/references/view/actions';
import { DeleteCitation, GetRefCSLJson } from './actions';
import React from 'react';
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/plugin-bibjson')
require('@citation-js/core')
const { plugins } = require('@citation-js/core')
import { GetCSLStyle, GetCSLLocale } from './actions';
import parse, { domToReact } from 'html-react-parser';
import ReactDOMServer from 'react-dom/server';
import { htmlToText } from 'html-to-text';

export function CitationList({ referenceId, styleChoice, localeChoice, citations, setCitations, referenceIds, selectedReferenceIds = [], setSelectedReferenceIds}: any) {
  // Fetch initial citation state
  useEffect(() => {

  }, []);

  // Add a new useEffect that listens for changes in styleChoice and localeChoice
  useEffect(() => {
    if (styleChoice && localeChoice) {
      fetchCitations();
    }
  }, [styleChoice, localeChoice]);

  const newCitations: any[] = [];

  const options = {
    replace({ attribs, children }: any) {
      if (!attribs) {
        return;
      }

      if (attribs.class === 'csl-entry') {
        const citation = {
          _id: attribs["data-csl-entry-id"],
          data: (
            <div>
              {domToReact(children, options)}
            </div>
          )
        };
        newCitations.push(citation)
        return citation;
      }
    },
  }

  const fetchCitations = async () => {
    // Fetch citations for all referenceIds in parallel
    const allCitations = await Promise.all(selectedReferenceIds.map(GetRefCSLJson));
    // Create a Cite instance with the references' cslJson data
    const citation = new Cite(allCitations);
    // Create a custom template and style for each specified style/locale
    const templateName = styleChoice;
    const localeName = localeChoice;


    const styleData = await GetCSLStyle(templateName);
    const localeData = await GetCSLLocale(localeName);


    const config = plugins.config.get('@csl')
    
    // Add citation style & locale to Citation.js config
    config.templates.add(templateName, styleData?.cslData);
    config.locales.add(localeName, localeData?.localeData);

    // Create custom citation with user specified style & locale
    const customCitation = citation.format('bibliography', {
        format: 'html',
        template: templateName,
        lang: localeName,
    });

    parse(customCitation, options);

    const updatedCitations = newCitations.map((newCitation: any) => {
      // Find the citation in citation.data that matches the _id of newCitation
      const matchingCitation = citation.data.find((dataCitation: any) => dataCitation.id === newCitation._id);
      // If a matching citation is found, return a new object that contains the refId
      if (matchingCitation) {
        return {
          ...newCitation,
          refId: matchingCitation.refId
        };
      }

      // If no matching citation is found, return the original newCitation
      return newCitation;
    });


    setCitations(updatedCitations);
  }

  const handleDelete = async (citationId: any) => {
    const citationToDelete = citations.find((citation: any) => citation._id === citationId);

    // Remove citation from state
    const updatedCitations = citations.filter((citation: any) => citation._id !== citationId);
    setCitations(updatedCitations);

    // If the citation was found, remove its referenceId from selectedReferenceIds
    if (citationToDelete) {
      const updatedSelectedReferences = selectedReferenceIds.filter((referenceId: any) => referenceId !== citationToDelete.refId);
      setSelectedReferenceIds(updatedSelectedReferences);
    }

  }

  return (
    <>
        {citations?.map((citation: any, index: any) => (
          <tr key={citation._id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
            <td className="px-6 py- text-center text-sm">
              {citation.data}
            </td>
            <td className="px-6 py-4 text-center">
              <CopyToClipboard citationData={citation.data} />
              <button onClick={() => handleDelete(citation._id)}>
                Delete
              </button> 
            </td>
          </tr>
        ))}

    </>
  );
}

const convertReactElementToPlainText = (reactElement: any) => {
  // Convert React element to HTML string
  const htmlString = ReactDOMServer.renderToStaticMarkup(reactElement);

  // Convert HTML string to plain text
  const plainText = htmlToText(htmlString);

  return plainText;
};

export function CopyToClipboard(citationData : any){

  const copyToClipboard = (text : string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <button onClick={() => copyToClipboard(convertReactElementToPlainText(citationData.citationData))}>
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

export const CitationChoice = React.memo(({ referenceId, citations, setCitations, referenceIds, selectedReferenceIds, styleChoice, setStyleChoice, localeChoice, setLocaleChoice}: any) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('txt');

  async function exportCitation() {
    if (!styleChoice || !localeChoice) {
      setError('Please select both a citation style and a language.');
      return;
    }

    setIsLoading(true);
    try {
      // Call to server action to create citations & save in DB
      await CreateCitation(selectedReferenceIds, styleChoice, localeChoice);
      window.location.reload(); // Refresh the page
    } catch (error) {
      setError('An error occurred while creating the citation.');
    } finally {
      setIsLoading(false);
    }
  }

  function downloadCitations(event: any) { // Downloads Citations
    event.preventDefault(); // Prevent the form from refreshing the page
  
    const element = document.createElement('a');
    const file = new Blob([citations.map((citation: any) => convertReactElementToPlainText(citation.data)).join('\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `citations.${downloadFormat}`;
    document.body.appendChild(element);
    element.click();
  }

  return (
    <>
    <div className='center-content'>
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
        <form onSubmit={downloadCitations} className='flex items-center space-x-2'>
        <select value={downloadFormat} onChange={event => setDownloadFormat(event.target.value)} className='border p-1 rounded-md'>
          <option value='txt'>TXT</option>
          <option value='csv'>CSV</option>
        </select>
        <button type='submit' className='bg-green-500 text-white p-2 rounded-md hover:bg-green-700' title='Click to download citations'>
          Download Citations
        </button>
        </form>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
      </div>
    </>
  )
});

export function ExportReferenceData({ referenceId }: any){

  const [reference, setReference] = useState(Object);
  const [downloadFormat, setDownloadFormat] = useState('txt');
  
  // Fetch initial citation state
  useEffect(() => {
    fetchReference();
  }, []);

  const fetchReference = async () => {
    const referenceData = await getSpecificReferenceById(referenceId);
    setReference(referenceData);
  }




}