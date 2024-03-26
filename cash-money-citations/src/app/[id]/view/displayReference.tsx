"use client"
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
import { useEffect, useState } from "react";
import { getSpecificReferenceById } from "@/components/componentActions/actions";
import { GetBibLaTexFile, GetBibTexFile, GetJSONFile } from "./actions";

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
          <div key={contributor._id}>{contributor.firstName} {contributor.middleNameI} {contributor.lastName}<br></br></div>
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
      <Button color="orange" onClick={onExport}>Bibliography</Button>
    </div>
  )
}

const ViewReference = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
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
      // Call to server action to create citations & save in DB
      router.push(`/displayCitation?citation=${referenceId}`)
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
                        <ExportReferenceData referenceId={reference._id}/>
                    </div> 
                </div>  
            </> 
        </div>
    )
    
}

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

  const downloadReference = async(event: any) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    let formattedReference;
    let fileExtension;
    switch (downloadFormat) {
      case 'json':
        const getJSON = async() => {
          const json = await GetJSONFile(referenceId);
          return json;
        }
        formattedReference = await getJSON();
        fileExtension = 'json';
        break;
      case 'bibtex':
        const getBibTex = async() => {
          const bibtex = await GetBibTexFile(referenceId);
          return bibtex;
        }
        formattedReference = await getBibTex();
        fileExtension = 'bib';
      case 'biblatex':
        // Format the reference as BibTex or BibLaTex
        const getBibLaTex = async() => {
          const bibLaTex = await GetBibLaTexFile(referenceId);
          return bibLaTex;
        }
        formattedReference = await getBibLaTex();
        fileExtension = 'bib';

        break;
      case 'csv':
        // Format the reference as CSV
        formattedReference = Object.values(reference).join(',');
        fileExtension = 'csv';

        break;
      case 'txt':
        formattedReference = Object.values(reference).join('\n');
        fileExtension = 'txt';

        break;
    }

    const element = document.createElement('a');
    const file = new Blob([formattedReference], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `reference.${fileExtension}`;
    document.body.appendChild(element);
    element.click();
  }

  return (
    <>
      <form onSubmit={downloadReference} className='flex items-center space-x-2'>
        <select value={downloadFormat} onChange={event => setDownloadFormat(event.target.value)} className='border p-1 rounded-md'>
          <option value='txt'>TXT</option>
          <option value='json'>JSON</option>
          <option value='bibtex'>BibTex</option>
          <option value='biblatex'>BibLaTex</option>
          <option value='csv'>CSV</option>
        </select>
        <button type='submit' className='bg-green-500 text-white p-2 rounded-md hover:bg-green-700' title='Click to download reference'>
          Download Reference
        </button>
      </form>
    </>
  );
}

export default ViewReference;