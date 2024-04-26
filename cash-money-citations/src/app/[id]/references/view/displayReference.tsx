"use client"
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
import { useEffect, useState } from "react";
import { getSpecificReferenceById } from "@/components/componentActions/actions";
import { GetBibLaTexFile, GetBibTexFile, GetJSONFile } from "./actions";
import { Tag } from "@/models/Tag";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button, Select, SelectItem, useDisclosure} from "@nextui-org/react";
import { getSpecificTagById } from "@/components/componentActions/tagActions";
import DisplayTags from "@/components/DisplayTags";
import { useSession } from "next-auth/react";
import {getUserReferences} from '../../../../components/componentActions/actions';
import { HandleManualReference } from "@/components/componentActions/citationActions";
import React, { Suspense, createContext, useContext } from "react";
import { useReferenceContext } from "@/app/reference-table/components/ReferenceTable";
import DeletePopup from "@/components/DeletePopup";

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
function exportButton({ color, onClick, children }: any) {
  return (
    <Button
      className={`linkBtn inline-block bg-gradient-to-r from-${color}-400 to-${color}-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200`}
      onClick={onClick}
    >
      <span>{children}</span>
    </Button>
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
        {reference.tagId &&
          <div>
            {reference.tagId.map((id: string) => (
              <DisplayTags key={id} tagId={id} />
            ))}
          </div>
        }  
      </span>

      <span className="block h-auto rounded-lg">
        <label className="font-bold">Contributors:</label>
        {reference.contributors &&
          <div>
            {
              reference.contributors.map((contributor: any) => (
                <div key={contributor._id}>{contributor.suffix}{contributor.given} {contributor.middle} {contributor.family}<br></br></div>
              ))
            }
          </div>
        }
          
      </span>
      <span className="block h-auto rounded-lg">
          <label className="font-bold">Publisher:</label>
          {reference.publisher}
      </span>
      <span className="block h-auto rounded-lg">
          <label className="font-bold">Reference Type:</label>
          {reference.type}
      </span>
      {reference.edition ? <span className="block h-16 rounded-lg"><label className="font-bold">Edition:</label>{reference.edition}</span> : ""}
      {reference.language ? <span className="block h-16 rounded-lg"><label className="font-bold">Language:</label>{reference.language}</span> : ""}
      {reference.ISBN ? <span className="block h-16 rounded-lg"><label className="font-bold">ISBN:</label>{reference.ISBN}</span> : ""}
      {reference.DOI ? <span className="block h-16 rounded-lg"><label className="font-bold">DOI:</label>{reference.DOI}</span> : ""}
      {reference.ISSN ? <span className="block h-16 rounded-lg"><label className="font-bold">Edition:</label>{reference.ISSN}</span> : ""}

      <span className="block h-16 rounded-lg">
          <label className="font-bold">Date Published:</label>
            {(reference.yearPublished === "NaN") ? "YYYY": reference.yearPublished} - {(reference.monthPublished === "NaN") ? "MM": reference.monthPublished} - {(reference.dayPublished === "NaN") ? "DD": reference.dayPublished}
      </span>
    </>
  )
}

function ReferenceActions({ onEdit, onDelete, onExport, onShare }: any) {
  return (
    <div>
      <Button
      className={`m-2 linkBtn inline-block bg-gradient-to-r from-cyan-400 to-cyan-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 me-2`}
      onClick={onShare}
    >
      <span>Share</span>
    </Button>
      <Button
      className={`m-2 linkBtn inline-block bg-gradient-to-r from-green-400 to-green-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 me-2`}
      onClick={onEdit}
    >
      <span>Edit</span>
    </Button>
    <Button
      className={`m-2 linkBtn inline-block bg-gradient-to-r from-red-400 to-red-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 me-2`}
      onClick={onDelete}
    >
      <span>Delete</span>
    </Button>
    <Button
      className={`m-2 linkBtn inline-block bg-gradient-to-r from-orange-400 to-orange-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 `}
      onClick={onExport}
    >
      <span>Create Citation</span>
    </Button>
    </div>
  )
}

function GuestActions({ onShare, onAdd }: any) {
  return (
    <div>
      <Button
        className={`m-2 linkBtn inline-block bg-gradient-to-r from-cyan-400 to-cyan-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 me-2`}
        onClick={onShare}
      >
        <span>Share</span>
      </Button>
      <Button
        className={`m-2 linkBtn inline-block bg-gradient-to-r from-slate-400 to-slate-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200`}
        onClick={onAdd}
      >
        <span>Add to your list</span>
      </Button>

    </div>
  )
}

function NoUserActions({ onShare }: any) {
  return (
    <div>
      <Button
        className={`m-2 linkBtn inline-block bg-gradient-to-r from-cyan-400 to-cyan-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200 me-2`}
        onClick={onShare}
      >
        <span>Share</span>
      </Button>
    </div>
  )
}

const ViewReference = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [referenceId, setReferenceId] = useState(id);
    const [userOwned, setUserOwned] = useState(false);
    const [notLoggedIn, setNotLoggedIn] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    useEffect(() => {
      async function setIsUserOwned() {
        const userId = session?.user?.id ?? '';
        if (userId === '') {
          setNotLoggedIn(true);
          setUserOwned(false);
        }
        else {
          try {
            const refs = await getUserReferences(userId);
            if (refs) {
              for (let i = 0; i < refs.length; i++) {
                if (refs[i]._id === id) {
                  setUserOwned(true);
                }
              }
            }
          }
          catch (error) {
            setUserOwned(false);
          }
        }
      }
      setIsUserOwned();
    }, []);
    
    const { references, setReferences, addReference, removeReference, referenceIds, setReferenceIds, selectedReferenceIds }  = useReferenceContext();

    const handleDelete = async () => {
        const deleteConfirm = confirm("Are you sure you want to delete this reference?");
        if (deleteConfirm){
          try {
            await fetch(`/api/references/${reference._id}`, {
              method: "Delete",
            });
            router.push('/');
            router.refresh();
          } catch (error) {
            console.log(error);
          }
        }       
    };

    async function exportCitation() {
      // Call to server action to create citations & save in DB
      router.push(`/displayCitation?citation=${referenceId}`);
      router.refresh();
    }

    async function shareLink() {
      await navigator.clipboard.writeText(location.href);
      alert('Copied to clipboard!');
    }

    async function addToList(item: any) {
      // Ensure item includes an ID field
      const itemWithId = { ...item, _id: undefined }; // Set _id to undefined to let MongoDB generate a new ID
      //Handling issues with tags
      const itemWithoutTags = { ...itemWithId, tags: [] };
      console.log(itemWithoutTags);
      HandleManualReference(itemWithoutTags, session?.user?.id)
      router.push("/reference-table");
      router.refresh();
    }

    const {
        data: reference,
        error,
        isLoading,
      } = useSWR(id ? `/api/reference/${id}` : null, fetcher);

      
    if (error) return <p>Failed to load</p>;
    if (isLoading) return <p>Loading...</p>;
    if (!reference) return null;
      

    const handleEdit = () => {
      router.push(`/${reference._id}/references/edit?id=${encodeURIComponent(reference._id)}`);
    };

    return(
      <Card className="min-w-[40%] max-w-[60%] ">

          <CardHeader>
            {reference.title}
          </CardHeader>
          <Divider/>
          <CardBody>
            <ReferenceDetails reference={reference} />
            <Divider/>
            {userOwned ? (
            <div>
              <ReferenceActions onEdit={handleEdit} onDelete={handleDelete} onExport={exportCitation} onShare={shareLink} />
              <Divider />
              <ExportReferenceData referenceId={reference._id} />
            </div>
            ) : (
              <div>
                <GuestActions onShare={shareLink} onAdd={() => addToList(reference)}/>
              </div>
            )}
            {!userOwned && !notLoggedIn && (
              <div>
                <NoUserActions onShare={shareLink} />
              </div>
            )}

          </CardBody>
      </Card>

    )
}

export function ExportReferenceData({ referenceId, referenceIds }: any){
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
          const json = await GetJSONFile(referenceId, 'en-US');
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
          const bibtex = await GetBibTexFile(referenceId,'en-US');
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
          const bibLaTex = await GetBibLaTexFile(referenceId, 'en-US');
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
      <form onSubmit={downloadReference} className='flex items-center space-x-2 '>
        <Select value={downloadFormat} onChange={event => setDownloadFormat(event.target.value)} label="Select Export Type" className='max-w-[45%] p-1 rounded-md'>
          {/* <option value='txt'>TXT</option> */}
          <SelectItem key='json' value='json' className="dark:text-white">JSON</SelectItem>
          <SelectItem key='bibtex' value='bibtex' className="dark:text-white">BibTex</SelectItem>
          <SelectItem key='biblatex' value='biblatex' className="dark:text-white">BibLaTex</SelectItem>
          {/* <option value='csv'>CSV</option> */}
        </Select>
        <Button type='submit' disabled={!downloadFormat} className='bg-green-500 text-white p-2 rounded-md hover:bg-green-700' title='Click to download reference'>
          Download Reference
        </Button>
      </form>
    </>
  );
}

export default ViewReference;