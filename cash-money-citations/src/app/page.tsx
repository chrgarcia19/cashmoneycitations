import React, { Suspense } from 'react';
import ReferenceTable from '@/components/ReferenceTable';
import ViewToggle from '@/components/ViewToggle';

export default async function HomePage() {
  
  return(
    <>
    <div>
      <Suspense><ReferenceTable /></Suspense>
    </div>
    </>
    
  )
}