'use client'

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { useSession } from "next-auth/react";
const Cite = require('citation-js')
require('@citation-js/plugin-bibtex')
const { plugins } = require('@citation-js/core')
const config = plugins.config.get('@bibtex')

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

    const ReferencePage = () => {
      let mlaOutput = "";
      const searchParams = useSearchParams();
      const router = useRouter();
      const id = searchParams.get('id');

      // Following lines used to test user session status
      // const {data: session, status} = useSession();
      // console.log("status", status);
      // console.log("session", session);

      const handleDelete = async () => {
            try {
              await fetch(`/api/references/${id}`, {
                method: "Delete",
              });
              router.push('/');
              router.refresh();
            } catch (error) {
            }
          };

      const {
        data: reference,
        error,
        isLoading,
      } = useSWR(id ? `/api/references/${id}` : null, fetcher);

      
      if (error) return <p>Failed to load</p>;
      if (isLoading) return <p>Loading...</p>;
      if (!reference) return null;

      function exportCitation() {
        // Map your MongoDB data to CSL format
        let type = "";
        
        if (reference.type === 'journal'){
          type = 'article-journal'
        }
        if (reference.type === 'website'){
          type = reference.type
        }
        if (reference.type === 'book'){
          type = reference.type
        }
        const cslData = {
          id: reference._id,
          type: type,
          title: reference.title,
          author: reference.contributors.map((contributor: { contributorFirstName: any; contributorLastName: any; }) => ({
            family: contributor.contributorFirstName,
            given: contributor.contributorLastName,
          })),
          issued: { "date-parts": [[parseInt(reference.year, 10), reference.month ? parseInt(reference.month, 10) : 0]] },
          publisher: reference.publisher,
          DOI: reference.doi,
          URL: reference.url,
          ISBN: reference.isbn
        };
      
        // Create a Cite instance
        const citation = new Cite(cslData);
        //Generate Vancouver citation
        const vanOutput = citation.format('bibliography', {
          format: 'text',
          template: 'vancouver',
          lang: 'en-US'
        });
        //Generate apa citation
        const apaOutput = citation.format('bibliography', {
          format: 'text',
          template: 'apa',
          lang: 'en-US'
        });
        const bibtexOutput = citation.format('bibtex', {
          format: 'text',
          template: 'bibtex',
          lang: 'en-US'
        })
        // Implement the logic to display or prepare the citation for download
        // alert(`Vancouver Citation: \n${vanOutput}\nAPA Citation: \n${apaOutput}`);

        const citationData = JSON.stringify({ van: vanOutput, apa: apaOutput, bibtex: bibtexOutput });
        router.push(`/displayCitation?citation=${encodeURIComponent(citationData)}`);
      }


      return (
        <>

      <div key={reference._id}>
      <div className="card">
        <img src={reference.image_url} alt="Reference Cover" />
        <h5 className="reference-name">{reference.title}</h5>
        <div className="main-content">
          <p className="reference-name">{reference.title}</p>
          <p className="reference-type">Type: {reference.type}</p>

          <div className="likes info">
            <p className="label">Year</p>
            <ul>
              {reference.year}
            </ul>
          </div>
          <div className="dislikes info">
            <p className="label">Publisher</p>
            <ul>
              {reference.publisher}
            </ul>
          </div>

          <div className="btn-container">
            <Link href={{ pathname: `/${reference._id}/edit`, query: { id: reference._id } }}>
              <button className="btn edit bg-green-400">Edit</button>
            </Link>
            <button className="btn delete bg-red-400" onClick={handleDelete}>
              Delete
            </button>
            <button className="btn export" onClick={exportCitation}>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>

    
    </>
      )
    }

    export default ReferencePage

