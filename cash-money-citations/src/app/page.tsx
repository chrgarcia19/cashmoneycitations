import React, { Suspense } from 'react';
import ReferenceTable from '@/components/ReferenceTable';

export default function HomePage() {
  
  return(
    <>
    <div>
      <Suspense><ReferenceTable /></Suspense>
    </div>
    </>
    
  )
}