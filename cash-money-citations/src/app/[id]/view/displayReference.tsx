"use client"
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
require('@citation-js/plugin-bibtex')
require('@citation-js/core')
import { useState } from "react";

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
          {monthConversion(reference.month_published)} {reference.day_published}, {reference.year_published}
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
                    </div> 
                </div>  
            </> 
        </div>
    )
    
}

export default ViewReference;