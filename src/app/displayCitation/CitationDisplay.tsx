"use client"
import { useEffect, useState } from 'react';
import { getSpecificReferenceById } from '@/components/componentActions/actions';
import { SelectionCSL, SelectionLocale } from '../[id]/references/view/CSLComponents';
import { SelectionGuestCSL } from '@/components/guest/GuestCSLComponents';
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
import { useSession } from 'next-auth/react';
import { Button } from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import {Card, CardHeader, CardBody} from "@nextui-org/react";
import { IoMdDownload } from "react-icons/io";

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
          <tr key={citation._id || index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
            <td className="px-6 py- text-center text-sm">
              {citation.data}
            </td>
            <td className="px-6 py-4 text-center">
              <CopyToClipboard citationData={citation.data} />
              <button onClick={() => handleDelete(citation._id)}>
                Remove
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

const Alert = ({ message, type, onClose }: any) => {
  const color = type === 'success' ? 'green' : 'red';

  return (
    <div className={`bg-${color}-100 border border-${color}-400 text-${color}-700 px-4 py-3 rounded relative`} role="alert">
      <strong className="font-bold">{type === 'success' ? 'Success!' : 'Error!'}</strong>
      <span className="block sm:inline"> {message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg className="fill-current h-6 w-6 text-${color}-500" role="button" onClick={onClose} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    </div>
  );
};

export const CitationChoice = React.memo(({ referenceId, citations, setCitations, referenceIds, selectedReferenceIds, styleChoice, setStyleChoice, localeChoice, setLocaleChoice}: any) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('txt');
  const [alert, setAlert] = useState({ type: '', message: ''})

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  async function exportCitation() {
    if (!styleChoice || !localeChoice) {
      setError('Please select both a citation style and a language.');
      return;
    }

    setIsLoading(true);
    try {
      // Call to server action to create citations & save in DB
      await CreateCitation(selectedReferenceIds, styleChoice, localeChoice);
      setAlert({ type: 'success', message: 'Citations saved successfully.' });
    } catch (error) {
      setError('An error occurred while creating the citation.');
      setAlert({ type: 'error', message: 'Failed to save citations.' });
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

  const {data: session, status} = useSession();
  const selectDownloadOptions = [
    {label: "TXT", value: 'txt'},
    {label: "CSV", value: 'csv'},
  ]

  return (
    <>
      {alert.message && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />}    
      <div className='center-content min-w-[60%]'>

        <div className='flex justify-between space-x-4 bg-gray-200 p-4 rounded-md'>
          <Card>
            <CardHeader className='justify-center'>
              <label htmlFor='styleChoice' className='mb-2 text-center font-bold text-lg'>Citation Style</label>
            </CardHeader>
            <CardBody>
              {status ==="authenticated" ?
            <SelectionCSL onStyleChoiceChange={setStyleChoice} currentStyle={styleChoice}/>
            :
            <SelectionGuestCSL onStyleChoiceChange={setStyleChoice} currentStyle={styleChoice} />
            }
            </CardBody>
          </Card>

          <Card>
            <CardHeader className='justify-center'>
              <label htmlFor='localeChoice' className='mb-2 font-bold text-lg'>Language</label>
            </CardHeader>
            <CardBody>
              <SelectionLocale onLocaleChoiceChange={setLocaleChoice}/>
            </CardBody>
          </Card>

          <Card className='min-w-[25%]'>
            <CardHeader className='justify-center'>
              <label className='mb-2 font-bold text-lg'>Download</label>

            </CardHeader>
            <CardBody className='flex justify-end'>
              <Select className='max-w-[100%]' value={downloadFormat} defaultSelectedKeys={["txt"]} onChange={event => setDownloadFormat(event.target.value)}>
                {selectDownloadOptions.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
              <Button onClick={downloadCitations} color='success' title='Click to download citations'>
                <IoMdDownload />
              </Button>
            </CardBody>
          </Card>

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