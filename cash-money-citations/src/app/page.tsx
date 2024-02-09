import React from 'react';
import Link from 'next/link';
import dbConnect from "@/utils/dbConnect";
import Reference from "@/models/Reference";


async function getReferences() {
  await dbConnect();

  const result = await Reference.find({});
  const references = result.map((doc) => {
    const reference = JSON.parse(JSON.stringify(doc));
    return reference;
  });

  return references;
}

export default async function HomePage() {
  const references = await getReferences();

  return (

     
      <>
        {references.map((reference) => (
          <div key={reference._id}>
            <div className="card">
              <img src={reference.image_url} alt="Image of a Reference Cover" />
              <h5 className="pet-name">{reference.title}</h5>
              <div className="main-content">
                <p className="pet-name">{reference.title}</p>
                <p className="owner">Type: {reference.type}</p>
  
                {/* Extra Pet Info: Year and Publisher */}
                <div className="likes info">
                  <p className="label">Year</p>
                  {reference.year}
                </div>
                <div className="dislikes info">
                  <p className="label">Publisher</p>
                  <ul>
                    {reference.publisher}
                  </ul>
                </div>
                <div className="btn-container">
                  <Link href={{ pathname: `/${reference._id}/edit`, query: { id: reference._id } }}>
                    <button className="btn edit">Edit</button>
                  </Link>
                  <Link href={{ pathname: `/${reference._id}/`, query: { id: reference._id } }}>
                    <button className="btn view">View</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>

  )
}