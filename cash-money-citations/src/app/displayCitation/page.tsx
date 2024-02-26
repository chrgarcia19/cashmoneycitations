"use client"

import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const citationDisplay = () => {
  const searchParams = useSearchParams();
  const [citationData, setCitationData] = useState({ van: '', apa: '' });
  useEffect(() => {
    const citation = searchParams.get('citation');
    if (citation) {
      const parsedData = JSON.parse(decodeURIComponent(citation));
      setCitationData(parsedData);
    }
  }, [searchParams]);

  return (
    <div>
      <p>Vancouver Citation: {citationData.van}</p>
      <p>APA Citation: {citationData.apa}</p>
    </div>
  )
};

export default citationDisplay;