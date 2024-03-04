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
import CiteDisplay from "./citeDisplay";
import { useState } from "react";
import { CreateCitation } from "./actions";

const ViewReference = () => {
    const fetcher = (url: string) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data);

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [styleChoice, setStyleChoice] = useState('university-of-york-mla.csl');

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
        const citationData = await CreateCitation(reference)
        console.log(citationData)
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
      

    return(
        <div className='w-full h-screen bg-zinc-700'>
            <>
                <div className="flex justify-center items-center pt-10">
                    <div className="bg-gray-100 w-2/5 rounded-xl p-4 space-y-4">
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
                        <span className="space-x-5">
                            <button className="linkBtn inline-block bg-gradient-to-r from-green-400 to-green-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200">
                                <span><Link href={{ pathname: `/${reference._id}/edit`, query: { id: reference._id} } }>Edit</Link></span>
                            </button>
                            <button className="linkBtn inline-block bg-gradient-to-r from-red-400 to-red-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200"
                                onClick={handleDelete}>
                                <span>Delete</span>
                            </button>
                            <button className="linkBtn inline-block bg-gradient-to-r from-orange-400 to-orange-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200"
                                onClick={exportCitation}>
                                <span>Export</span>
                            </button>
                            <select
                              value={styleChoice}
                              onChange={e => setStyleChoice(e.target.value)}
                            >
                              <option value="university-of-york-mla.csl">
                                MLA
                              </option>
                              <option value='university-of-york-chicago.csl'>
                                Chicago
                              </option>
                            </select>
                        </span>
                    </div> 
                </div>  
            </> 
        </div>
    )
    
}

export default ViewReference;