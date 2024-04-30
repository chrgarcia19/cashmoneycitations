"use client"
import React, { useEffect, useState } from "react";

interface ReferenceData {
  // Define the properties as they appear in your form data
  title?: string;
  contributors?: string[];
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
    const loadedData = localStorage.getItem('referenceData');
    if (loadedData) {
      setReferences([JSON.parse(loadedData)]);
    }
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-bold text-center my-4">Guest References</h1>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Contributors</th>
            <th className="py-3 px-6 text-left">Publisher</th>
            <th className="py-3 px-6 text-left">Year Published</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">DOI</th>
            <th className="py-3 px-6 text-left">ISSN</th>
            <th className="py-3 px-6 text-left">ISBN</th>
            <th className="py-3 px-6 text-left">URL</th>
          </tr>
        </thead>
        <tbody>
          {references.map((reference, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{reference.title}</td>
              <td className="py-3 px-6 text-left">{reference.contributors?.join(', ')}</td>
              <td className="py-3 px-6 text-left">{reference.publisher}</td>
              <td className="py-3 px-6 text-left">{reference.yearPublished}</td>
              <td className="py-3 px-6 text-left">{reference.type}</td>
              <td className="py-3 px-6 text-left">{reference.DOI}</td>
              <td className="py-3 px-6 text-left">{reference.ISSN}</td>
              <td className="py-3 px-6 text-left">{reference.ISBN}</td>
              <td className="py-3 px-6 text-left">{reference.URL}</td>
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
