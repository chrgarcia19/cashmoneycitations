import React, { Suspense, useState } from 'react';
import ReferenceTable from '@/components/ReferenceTable';
import ReferenceGallery from '@/components/ReferenceGallery';

export default async function HomePage() {

  return(
    <>
    <input type="checkbox" className="toggle" />
    
    <ReferenceTable />
    </>
    
  )
}