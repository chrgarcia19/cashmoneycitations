import React from 'react';
import Link from 'next/link';
import {getUserReferences} from './componentActions/actions';
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function ReferenceGallery() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? '';

  const references = await getUserReferences(userId);

  return (
    <>  
      <div className='reference-wrapper'>
        {references?.map((reference) => (
          <div key={reference._id}>
              <div className="card">
                <img src={reference.image_url} alt="Image of a Reference Cover" />
                <h5 className="reference-name">{reference.title}</h5>
                <div className="main-content">
                  <p className="reference-name">{reference.title}</p>
                  <p className="owner">Type: {reference.type}</p>
    
                  {/* Extra Reference Info: Year and Publisher */}
                  <div className="likes info">
                    <p className="label">Year</p>
                    {reference.year_published}
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
                    <Link href={{ pathname: `/${reference._id}/view`, query: { id: reference._id} } }>
                      <button className="btn view bg-blue-400">View</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}
