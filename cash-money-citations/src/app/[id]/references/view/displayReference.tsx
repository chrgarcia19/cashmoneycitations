"use client"
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
import { useEffect, useState } from "react";
import { getSpecificReferenceById } from "@/components/componentActions/actions";
import { GetBibLaTexFile, GetBibTexFile, GetJSONFile } from "./actions";
import { Tag } from "@/models/Tag";

const fetcher = (url: string) =>
fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

    function monthConversion(month_num: string) {
      switch(month_num){
          case "0":
              return "January";
          case "1":
              return "February";
          case "2":
              return "March"; 
          case "3":
              return "April";
          case "4":
              return "May";
          case "5":
              return "June";
          case "6":
              return "July";
          case "7":
              return "August";
          case "8":
              return "September";
          case "9":
              return "October";
          case "10":
              return "November";
          case "11":
              return "December";   
          default:
              return (month_num + 1);     
      }
  }

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
          <label className="font-bold">Title:</label>
          {reference.title}
      </span>

      <span className="block h-auto rounded-lg">
          <label className="font-bold">Tags:</label>
          {reference.tags.map((tag: Tag) => (
            <div key={tag._id} className={`badge badge-lg bg-teal-200 me-2`}>
              {tag.tagName}
            </div>  
          ))}
      </span>

      <span className="block h-auto rounded-lg">
          <label className="font-bold">Contributors:</label>
          {reference.contributors.map((contributor: any) => (
          <div key={contributor._id}>{contributor.suffix}{contributor.given} {contributor.middle} {contributor.family}<br></br></div>
          ))}
      </span>
      <span className="block h-auto rounded-lg">
          <label className="font-bold">Publisher:</label>
          {reference.publisher}
      </span>
      <span className="block h-auto rounded-lg">
          <label className="font-bold">Reference Type:</label>
          {reference.type}
      </span>
      <span className="block h-16 rounded-lg">
          <label className="font-bold">Date Published:</label>
          {(reference.yearPublished === "NaN") ? "YYYY": reference.yearPublished} - {(reference.monthPublished === "NaN") ? "MM": reference.monthPublished} - {(reference.dayPublished === "NaN") ? "DD": reference.dayPublished}
      </span>
    </>
  )
}

function ReferenceActions({ onEdit, onDelete, onExport }: any) {
  return (
    <div>
      {/* <Button color="green" onClick={onEdit}>Edit</Button>
      <Button color="red" onClick={onDelete}>Delete</Button>
      <Button color="orange" onClick={onExport}>Bibliography</Button> */}
      <button
      className={`linkBtn inline-block bg-gradient-to-r from-green-400 to-green-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 me-2`}
      onClick={onEdit}
    >
      <span>Edit</span>
    </button>
    <button
      className={`linkBtn inline-block bg-gradient-to-r from-red-400 to-red-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 me-2`}
      onClick={onDelete}
    >
      <span>Delete</span>
    </button>
    <button
      className={`linkBtn inline-block bg-gradient-to-r from-orange-400 to-orange-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200`}
      onClick={onExport}
    >
      <span>Export</span>
    </button>
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
      router.push(`/displayCitation?citation=${referenceId}`);
      router.refresh();
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
      router.push(`/${reference._id}/references/edit?id=${encodeURIComponent(reference._id)}`);
    };


    return(
            
          <div className="flex justify-center items-center pt-10">
              <div className="bg-gray-100 w-2/5 rounded-xl p-4 space-y-4">
                  <ReferenceDetails reference={reference}/>
                  <ReferenceActions onEdit={handleEdit} onDelete={handleDelete} onExport={exportCitation} />
                  <ExportReferenceData referenceId={reference._id}/>
              </div> 
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

        // Create a blob from the JSON data
        const jsonBlob = new Blob([JSON.stringify(formattedReference, null, 2)], { type: 'application/json' });

        // Create a link element
        const jsonLink = document.createElement('a');

        // Set the download attribute of the link element
        jsonLink.download = `reference.${fileExtension}`;

        // Create a URL for the blob and set it as the href of the link
        jsonLink.href = URL.createObjectURL(jsonBlob);

        // Append the link to the body
        document.body.appendChild(jsonLink);

        // Trigger a click on the link to start the download
        jsonLink.click();

        // Remove the link from the body
        document.body.removeChild(jsonLink);

        break;
      case 'bibtex':
        const getBibTex = async() => {
          const bibtex = await GetBibTexFile(referenceId);
          return bibtex;
        }
        formattedReference = await getBibTex();
        fileExtension = 'bib';

        // Create a blob from the JSON data
        const bibTexBlob = new Blob([formattedReference], { type: 'application/text' });

        // Create a link element
        const bibTexLink = document.createElement('a');

        // Set the download attribute of the link element
        bibTexLink.download = `reference.${fileExtension}`;

        // Create a URL for the blob and set it as the href of the link
        bibTexLink.href = URL.createObjectURL(bibTexBlob);

        // Append the link to the body
        document.body.appendChild(bibTexLink);

        // Trigger a click on the link to start the download
        bibTexLink.click();

        // Remove the link from the body
        document.body.removeChild(bibTexLink);
        
        break;
      case 'biblatex':
        // Format the reference as BibTex or BibLaTex
        const getBibLaTex = async() => {
          const bibLaTex = await GetBibLaTexFile(referenceId);
          return bibLaTex;
        }
        formattedReference = await getBibLaTex();
        fileExtension = 'bib';
        // Create a blob from the JSON data
        const bibLaTexBlob = new Blob([formattedReference], { type: 'application/text' });

        // Create a link element
        const bibLaTexLink = document.createElement('a');

        // Set the download attribute of the link element
        bibLaTexLink.download = `reference.${fileExtension}`;

        // Create a URL for the blob and set it as the href of the link
        bibLaTexLink.href = URL.createObjectURL(bibLaTexBlob);

        // Append the link to the body
        document.body.appendChild(bibLaTexLink);

        // Trigger a click on the link to start the download
        bibLaTexLink.click();

        // Remove the link from the body
        document.body.removeChild(bibLaTexLink);
        break;
      case 'csv':
        // Format the reference as CSV
        formattedReference = Object.values(reference).join(',');
        fileExtension = 'csv';

        break;
      case 'txt':
        formattedReference = Object.values(reference).join('\n');
        fileExtension = 'json';

        break;
    }
  }

  return (
    <>
      <form onSubmit={downloadReference} className='flex items-center space-x-2'>
        <select value={downloadFormat} onChange={event => setDownloadFormat(event.target.value)} className='border p-1 rounded-md'>
          {/* <option value='txt'>TXT</option> */}
          <option value=''>Export Options</option>
          <option value='json'>JSON</option>
          <option value='bibtex'>BibTex</option>
          <option value='biblatex'>BibLaTex</option>
          {/* <option value='csv'>CSV</option> */}
        </select>
        <button type='submit' disabled={!downloadFormat} className='bg-green-500 text-white p-2 rounded-md hover:bg-green-700' title='Click to download reference'>
          Download Reference
        </button>
      </form>
    </>
  );
}

export default ViewReference;