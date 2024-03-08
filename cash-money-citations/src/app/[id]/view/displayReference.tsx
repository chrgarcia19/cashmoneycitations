"use client"
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
const { plugins } = require('@citation-js/core')
// const config = plugins.config.get('@bibtex')
// const CSL = require("../../../../citeproc-js/citeproc_commonjs.js");
// import { getStyles, getCslStyle } from "./actions";
import { useState } from "react";
import { CreateCitation } from "./actions";

const fetcher = (url: string) =>
fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

// Styles buttons for Edit, Delete, & Export
function Button({ color, onClick, children }: any) {
  return (
    <button
      className={`linkBtn inline-block bg-gradient-to-r from-${color}-400 to-${color}-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200`}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
}

interface SelectionCSLProps {
  onStyleChoiceChange: (styleChoice: string) => void;
}

// Maps over CSL Style selection
function SelectionCSL({ onStyleChoiceChange }: SelectionCSLProps) {
  const [styleChoice, setStyleChoice] = useState('');

  const {
    data: cslStyles,
    error,
    isLoading,
  } = useSWR(`/api/csl/styles`, fetcher);

  
  if (error) return <p>Failed to load</p>;
  if (isLoading) return <p>Loading...</p>;
  if (!cslStyles) return null;

  const handleStyleChoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyleChoice = e.target.value;
    setStyleChoice(newStyleChoice);
    onStyleChoiceChange(newStyleChoice);
  };

  return (
      <span className="space-x-5">
          <select
              value={styleChoice}
              onChange={handleStyleChoiceChange}    
          >
            <option value={"default"} disabled selected>
              Select Citation Style
            </option>
              {cslStyles.map((cslStyle: any) => (
                  <option key={cslStyle.id} value={cslStyle.id}>
                      {cslStyle.name}
                  </option>
              ))}
          </select>
      </span>
  );
}

// Displays reference details
function ReferenceDetails({ reference }: any) {
  return (
    <>
      <span className="block h-auto rounded-lg">
          <label className="font-bold">Reference Type:</label>
          {reference.type}
      </span>
      <span className="block h-auto rounded-lg">
          <label className="font-bold">Title:</label>
          {reference.title}
      </span>
      <span className="block h-auto rounded-lg">
          <label className="font-bold">Contributors:</label>
          {reference.contributors.map((contributor: any) => (
          <div key={contributor._id}>{contributor.contributorFirstName} {contributor.contributorMiddleI} {contributor.contributorLastName}<br></br></div>
      ))}
      </span>
      <span className="block h-auto rounded-lg">
          <label className="font-bold">Publisher:</label>
          {reference.publisher}
      </span>
      <span className="block h-16 rounded-lg">
          <label className="font-bold">Date Published:</label>
          {reference.month} {reference.year}
      </span>
    </>
  )
}

function ReferenceActions({ onEdit, onDelete, onExport }: any) {
  return (
    <div>
      <Button color="green" onClick={onEdit}>Edit</Button>
      <Button color="red" onClick={onDelete}>Delete</Button>
      <Button color="orange" onClick={onExport}>Export</Button>
    </div>
  )
}

const ViewReference = () => {


    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [styleChoice, setStyleChoice] = useState('');
    const [referenceId, setReferenceId] = useState(id);
    
    const handleDelete = async () => {
        try {
          await fetch(`/api/references/${reference._id}`, {
            method: "Delete",
          });
          router.push('/');
          router.refresh();
        } catch (error) {
        }
    };

    async function exportCitation() {
      // Call to server action to create citations
        const citationData = await CreateCitation(referenceId, styleChoice)
        router.push(`/displayCitation?citation=${encodeURIComponent(citationData)}`);
      }

    const {
        data: reference,
        error,
        isLoading,
      } = useSWR(id ? `/api/references/${id}` : null, fetcher);

      
    if (error) return <p>Failed to load</p>;
    if (isLoading) return <p>Loading...</p>;
    if (!reference) return null;
      

    const handleEdit = () => {
      router.push(`/${reference._id}/edit?id=${encodeURIComponent(reference._id)}`);
    };


    return(
        <div className='w-full h-screen bg-zinc-700'>
            <>
                <div className="flex justify-center items-center pt-10">
                    <div className="bg-gray-100 w-2/5 rounded-xl p-4 space-y-4">
                        <ReferenceDetails reference={reference}/>
                        <ReferenceActions onEdit={handleEdit} onDelete={handleDelete} onExport={exportCitation} />
                        <SelectionCSL onStyleChoiceChange={setStyleChoice} />
                    </div> 
                </div>  
            </> 
        </div>
    )
    
}

export default ViewReference;