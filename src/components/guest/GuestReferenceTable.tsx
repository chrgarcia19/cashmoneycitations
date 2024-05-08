'use client'
import React, { useEffect, useState } from "react";

interface Contributor {
  given?: string; // Make it optional to handle missing properties
  family?: string; // Make it optional to handle missing properties
}

interface ReferenceData {
  title?: string;
  contributors?: Contributor[];
  publisher?: string;
  yearPublished?: string;
  type?: string;
  DOI?: string;
  ISSN?: string;
  ISBN?: string;
  URL?: string;
  [key: string]: any; // Add additional fields as necessary
}

const GuestReferenceTable = () => {
  const [references, setReferences] = useState<ReferenceData[]>([]);

  useEffect(() => {
    const loadedData = localStorage.getItem('references');
    if (loadedData) {
      setReferences(JSON.parse(loadedData));
      // console.log(loadedData, "references")
    }
  }, []);

  const getContributorName = (contributor: Contributor) => {
    const firstName = contributor.given || 'Unknown';
    const lastName = contributor.family || 'Contributor';
    return `${firstName} ${lastName}`;
  };

  return (
    <div className="container px-4 overflow-x-auto">
      <h1 className="text-xl font-bold text-center my-4">Guest References</h1>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Contributors</th>
            <th className="py-3 px-6 text-left">Publisher</th>
            <th className="py-3 px-6 text-left">Year Published</th>
            <th className="py-3 px-6 text-left">DOI</th>
            <th className="py-3 px-6 text-left">ISSN</th>
            <th className="py-3 px-6 text-left">ISBN</th>
          </tr>
        </thead>
        <tbody>
          {references.map((reference, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{reference.title}</td>
              <td className="py-3 px-6 text-left">
                {reference.contributors?.slice(0, 3).map(getContributorName).join(', ')}
                {(reference?.contributors?.length ?? 0) > 3 && 
                ` +${(reference.contributors?.length ?? 0) - 3} more`}
              </td>
              <td className="py-3 px-6 text-left">{reference.publisher}</td>
              <td className="py-3 px-6 text-left">{reference.yearPublished}</td>
              <td className="py-3 px-6 text-left">{reference.DOI}</td>
              <td className="py-3 px-6 text-left">{reference.ISSN}</td>
              <td className="py-3 px-6 text-left">{reference.ISBN}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {references.length === 0 && (
        <div className="text-center my-4">
          <p>No references stored.</p>
        </div>
      )}
    </div>
  );
};

export default GuestReferenceTable;
